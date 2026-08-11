import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import type { Medium } from '../../../NodeDataStructures/Mediums/Medium';
import createNodeFromType from '../../../NodeDataStructures/Nodes/SusiNode';
import getImportMediums from './ImportMediums';
import type { ComponentData, ComponentImportData, ImportData, NodeGroup } from '../ExportDataStrucures';
import { getComponentImportData } from './ImportData';
import { getBusDataFromConnections, isBusDataValid } from './ImportBusData';
import type { SusiEdge } from '../../../NodeDataStructures/Edges/SusiEdge';
import { createSourceHandleDict, findTargetHandle, initializeTakenHandles } from './ImportHandles';
import { getNewEdge } from '../../../NodeDataStructures/Edges/CreateEdge';
import type { Dispatch, SetStateAction } from 'react';
import type { NodeType } from '../../../NodeDataStructures/Nodes/SusiNodeTypes';
import type { ResieParameterMenuInfo } from '../../ResieParameters/ResieParameterMenuInfo';
import { createGroupNode } from '../../../NodeDataStructures/GroupNodes/GroupNode';
import { getStartEndUnit } from '../../../Reactflow-Components/CustomInputWidgets/DateParsing';
import { setControlModules, setImportedValues, setListOfInputs } from './ImportInputs';
import type { ControlModule } from '../../../Reactflow-Components/ContextMenus/ControlModules/ControlModulesMenu';

interface ImportStateProps {
	stateJSON: string;
	setNodes: (nodes: SusiNode[]) => void;
	setEdges: (edges: SusiEdge[]) => void;
	setMediums: (mediums: Medium[]) => void;
	logError: (errorMessage: string) => void;
	/** io settings and simulation parameters */
	resieParameterMenus: ResieParameterMenuInfo[];
	setResieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
	nodeTypes: Record<string, NodeType>;
	controlParameters: ResieParameterMenuInfo;
	controlModules: ControlModule[];
}

function getOutputRefs(sourceNodeID: string, sourceNodeData: ComponentData): string[] {
	if (sourceNodeData.type.toLowerCase() === 'bus') {
		return sourceNodeData.connections?.output_order || [];
	} else {
		if (!Array.isArray(sourceNodeData.output_refs)) {
			console.warn(`output_refs on ${sourceNodeID} is a dictionary, but should already be a string[] here.`);
			return [];
		}
		if (!sourceNodeData.output_refs) return [];
		return sourceNodeData.output_refs;
	}
}

function setNodeGroups(groups: NodeGroup[], nodes: SusiNode[], logError: (errorMessage: string) => void): SusiNode[] {
	let nodesWithGroups: SusiNode[] = nodes;
	groups.forEach((group, groupIndex) => {
		/** Check if there's duplicate group names */
		const duplicate = groups.find((e, i) => e.groupName === group.groupName && i !== groupIndex);
		if (duplicate) {
			logError(`Group name ${group.groupName} is a duplicate. Please give all groups unique names`);
			return;
		}
		/** Create a group node and add it to the start of the list */
		const groupNode = createGroupNode(
			{ x: group.bounds.x, y: group.bounds.y },
			group.groupName,
			group.bounds.width,
			group.bounds.height,
			group.groupColorIndex
		);
		nodesWithGroups = [groupNode].concat(nodesWithGroups);
		/** set this node as the parent of all the child node */
		group.nodesInGroup.forEach((nodeName) => {
			const node = nodes.find((n) => n.data.content === nodeName);
			if (!node) {
				logError(`Group ${group.groupName} contains node id not found in components Dictionary: ${nodeName}`);
				return;
			}
			node.parentId = groupNode.id;
		});
	});
	return nodesWithGroups;
}

const importState = ({
	stateJSON,
	setNodes,
	setEdges,
	setMediums,
	logError,
	setResieParameterMenus,
	resieParameterMenus,
	nodeTypes,
	controlParameters,
	controlModules,
}: ImportStateProps): void => {
	let importDict: ImportData;
	try {
		importDict = JSON.parse(stateJSON);
	} catch (error) {
		logError('Input is not valid JSON.');
		return;
	}

	if (!importDict.components || typeof importDict.components !== 'object' || Array.isArray(importDict.components)) {
		logError('There is no dictionary of components defined in import file.');
		return;
	}
	const startEndUnit = getStartEndUnit(resieParameterMenus);
	resieParameterMenus.forEach((menu) => {
		const list = importDict[menu.exportKey];
		if (list === undefined) return;
		setListOfInputs(setResieParameterMenus, menu.exportKey, list, startEndUnit);
	});
	// Get or generate mediums
	const mediums = getImportMediums(importDict, nodeTypes);
	setMediums(mediums);

	const nodeDict: Record<string, SusiNode> = {};
	const nodeArray: SusiNode[] = [];

	// First pass: create all nodes
	for (const [nodeId, nodeData] of Object.entries(importDict.components)) {
		const importData: ComponentImportData = getComponentImportData(nodeData);
		if (!Object.keys(nodeTypes).includes(importData.node_type)) {
			logError(`Component Type ${importData.node_type} does not exist.`);
			continue;
		}
		const nodeType = nodeTypes[importData.node_type];

		if (!nodeType) {
			logError(`Node ${nodeId} has unknown component type: ${importData.node_type}`);
			continue;
		}
		const newNode = createNodeFromType(
			nodeArray,
			nodeType,
			importData.node_position,
			'',
			controlParameters,
			nodeId
		);

		// Fill in node inputs from import data
		const nodeInputs = newNode.data.nodeInputs;
		setImportedValues(nodeInputs, nodeData, mediums, startEndUnit);
		newNode.data.nodeInputs = nodeInputs;

		/** Set Control parameters */
		const importControlParameters = nodeData.control_parameters;
		if (importControlParameters) {
			const controlParameterInputs = newNode.data.controlParameters!.inputs;
			setImportedValues(controlParameterInputs, importControlParameters, mediums, startEndUnit);
			newNode.data.controlParameters!.inputs = controlParameterInputs;
		}
		/** set control modules */
		if (nodeData.control_modules) setControlModules(nodeData.control_modules, newNode, controlModules, logError);

		nodeArray.push(newNode);
		nodeDict[nodeId] = newNode;
	}

	// Second pass: create edges
	const edgeArray: SusiEdge[] = [];
	const takenHandles: Record<string, Record<string, boolean[]>> = initializeTakenHandles(nodeArray);
	const sourceHandlDict = createSourceHandleDict(nodeArray, importDict.components);

	for (const [sourceNodeID, sourceNodeData] of Object.entries(importDict.components)) {
		const sourceNode = nodeDict[sourceNodeID];
		if (!sourceNode) continue;

		const outputRefs = getOutputRefs(sourceNodeID, sourceNodeData);

		for (let inputNodeEdgeIndex = 0; inputNodeEdgeIndex < outputRefs.length; inputNodeEdgeIndex++) {
			const targetNodeID = outputRefs[inputNodeEdgeIndex];
			const targetNode = nodeDict[targetNodeID];

			if (!targetNode) {
				logError(`Node ${targetNodeID} is not defined in components.`);
				continue;
			}

			// Create the source and target handles the edge should connect to
			//source
			const sourceHandleIndex: number = sourceHandlDict[sourceNodeID][targetNodeID];
			const sourceHandle = `source-${sourceHandleIndex}`;
			// target
			let targetHandleIndex = findTargetHandle(sourceNode, sourceHandleIndex, targetNode, takenHandles, logError);
			if (targetHandleIndex === -1) continue;
			const targetHandle = `target-${targetHandleIndex}`;

			// Create edge
			const newEdge = getNewEdge(
				{
					source: nodeDict[sourceNodeID].id,
					sourceHandle: sourceHandle,
					target: nodeDict[targetNodeID].id,
					targetHandle: targetHandle,
				},
				nodeArray,
				edgeArray,
				mediums,
				logError
			);

			if (newEdge) {
				edgeArray.push(newEdge);
			}
		}
	}

	/** Check if the imported bus data exists and matches the edges we created */
	for (const [nodeId, nodeData] of Object.entries(importDict.components)) {
		const node = nodeDict[nodeId];
		if (node && node.data.busData) {
			if (isBusDataValid(node, nodeArray, nodeData, logError)) {
				const busData = getBusDataFromConnections(nodeData.connections!, nodeArray);
				node.data.busData = busData;
			}
		}
	}
	if (importDict.groups) {
		const nodeArrayWithGroups = setNodeGroups(importDict.groups, nodeArray, logError);
		setNodes(nodeArrayWithGroups);
	} else {
		setNodes(nodeArray);
	}
	setEdges(edgeArray);
};

export default importState;
