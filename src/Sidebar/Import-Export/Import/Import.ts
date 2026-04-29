import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import type { Medium } from '../../../NodeDataStructures/Mediums/Medium';
import { getNodeTypeWithName } from '../../../NodeDataStructures/Nodes/SusiNodeTypes';
import createNodeFromType from '../../../NodeDataStructures/Nodes/SusiNode';
import getNodeInputs from '../../../NodeDataStructures/Nodes/NodeInputData';
import getImportMediums from './ImportMediums';
import type { ComponentData, ComponentImportData, ImportData } from '../ExportDataStrucures';
import { getComponentImportData } from './ImportData';
import { getBusDataFromConnections, isBusDataValid } from './ImportBusData';
// import getOutputRefs from './ImportOutputRefs';
import type { SusiEdge } from '../../../NodeDataStructures/Edges/SusiEdge';
import { createSourceHandleDict, findTargetHandle, initializeTakenHandles } from './ImportHandles';
import { getNewEdge } from '../../../NodeDataStructures/Edges/CreateEdge';

interface ImportStateProps {
	stateJSON: string;
	setNodes: (nodes: SusiNode[]) => void;
	setEdges: (edges: SusiEdge[]) => void;
	setMediums: (mediums: Medium[]) => void;
	logError: (errorMessage: string) => void;
}

function getOutputRefs(sourceNodeID: string, sourceNodeData: ComponentData): string[] {
	if (sourceNodeData.type.toLowerCase() === 'bus') {
		return sourceNodeData.connections?.output_order || [];
	} else {
		if (!Array.isArray(sourceNodeData.output_refs)) {
			console.log(`output_refs on ${sourceNodeID} is a dictionary, but should already be a string[] here.`);
			return [];
		}
		if (!sourceNodeData.output_refs) return [];
		return sourceNodeData.output_refs;
	}
}

const importState = ({ stateJSON, setNodes, setEdges, setMediums, logError }: ImportStateProps): void => {
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
	// Get or generate mediums
	const mediums = getImportMediums(importDict);
	setMediums(mediums);

	const nodeDict: Record<string, SusiNode> = {};
	const nodeArray: SusiNode[] = [];

	// First pass: create all nodes
	for (const [nodeId, nodeData] of Object.entries(importDict.components)) {
		const importData: ComponentImportData = getComponentImportData(nodeData);
		const nodeType = getNodeTypeWithName(importData.node_type);

		if (!nodeType) {
			logError(`Node ${nodeId} has unknown component type: ${nodeData.type}`);
			continue;
		}
		const newNode = createNodeFromType(nodeArray, nodeType, importData.node_position, mediums, nodeId);

		// Fill in node inputs from import data
		const nodeInputs = getNodeInputs(nodeType.type_name, mediums);
		for (const nodeInput of nodeInputs) {
			const value = nodeData[nodeInput.resieName];
			if (value !== undefined) {
				nodeInput.setNodeInputValue(value, mediums);
				nodeInput.isIncluded = true;
			} else {
				nodeInput.isIncluded = false;
			}
		}
		newNode.data.nodeInputs = nodeInputs;

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

	setNodes(nodeArray);
	setEdges(edgeArray);
};

export default importState;
