import type { SusiNode } from '../../../NodeDataStructures/SusiNode';
import type { Medium } from '../../../NodeDataStructures/Medium';
import { getNodeTypeWithName } from '../../../NodeDataStructures/SusiNodeTypes';
import createNodeFromType from '../../../NodeDataStructures/SusiNode';
import getNodeInputs from '../../../NodeDataStructures/NodeInputData';
import { getNewEdge } from '../../../Reactflow-Components/CreateEdge';
import getImportMediums from './ImportMediums';
import type { ComponentImportData, ImportData } from '../ExportDataStrucures';
import { getComponentImportData } from './ImportData';
import { isBusDataValid } from './ImportBusData';
import BusData from '../../../NodeDataStructures/BusData';
import { min } from 'lodash';
import getOutputRefs from './ImportOutputRefs';
import type { SusiEdge } from '../../../NodeDataStructures/SusiEdge';

interface ImportStateProps {
	stateJSON: string;
	setNodes: (nodes: SusiNode[]) => void;
	setEdges: (edges: SusiEdge[]) => void;
	setMediums: (mediums: Medium[]) => void;
	logError: (errorMessage: string) => void;
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
	const numIncomingEdgesPerNode: Record<string, number> = {};

	for (const [inputNodeId, inputNodeData] of Object.entries(importDict.components)) {
		const inputNode = nodeDict[inputNodeId];
		if (!inputNode) continue;

		const outputRefs = getOutputRefs(inputNodeData, inputNode, logError);

		for (let inputNodeEdgeIndex = 0; inputNodeEdgeIndex < outputRefs.length; inputNodeEdgeIndex++) {
			const outputNodeId = outputRefs[inputNodeEdgeIndex];
			const outputNode = nodeDict[outputNodeId];

			if (!outputNode) {
				logError(`Node ${outputNodeId} is not defined in components.`);
				continue;
			}

			// Count incoming edges to target node
			const outputNodeIncomingEdges = numIncomingEdgesPerNode[outputNodeId] || 0;
			numIncomingEdgesPerNode[outputNodeId] = outputNodeIncomingEdges + 1;

			// Create the source and target handles the edge should connect to
			//source
			const importedConnectionHandles = inputNodeData.import_data?.connection_handles?.[inputNodeId];
			let sourceHandleIndex = importedConnectionHandles?.source;
			if (sourceHandleIndex === undefined) {
				sourceHandleIndex = min([inputNodeEdgeIndex, inputNode.data.sourceHandles - 1]);
			}
			const sourceHandle = `source-${sourceHandleIndex}`;
			// target
			let targetHandleIndex = importedConnectionHandles?.target;
			if (targetHandleIndex === undefined) {
				targetHandleIndex = min([outputNodeIncomingEdges, outputNode.data.targetHandles - 1]);
			}
			const targetHandle = `target-${targetHandleIndex}`;

			// Create edge
			const newEdge = getNewEdge(
				{
					source: nodeDict[inputNodeId].id,
					sourceHandle: sourceHandle,
					target: nodeDict[outputNodeId].id,
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
			if (isBusDataValid(node, nodeData, logError)) {
				const connections = nodeData.connections;
				node.data.busData = new BusData(
					connections!.input_order,
					connections!.output_order,
					connections!.energy_flow
				);
			}
		}
	}

	setNodes(nodeArray);
	setEdges(edgeArray);
};

export default importState;
