import type { Edge } from '@xyflow/react';
import type { NodeWithSusiData } from '../../../NodeDataStructures/NodeWithSusiData';
import type { Medium } from '../../../NodeDataStructures/Medium';
import { getNodeTypeWithName } from '../../../NodeDataStructures/SusiNodeTypes';
import createNodeFromType from '../../../NodeDataStructures/NodeWithSusiData';
import getNodeInputs from '../../../NodeDataStructures/NodeInputData';
import { getNewEdge } from '../../../Reactflow-Components/CreateEdge';
import getImportMediums from './ImportMediums';
import type { ComponentData, ComponentImportData, ImportData } from '../ExportDataStrucures';
import { getComponentImportData } from './ImportData';
import { isBusDataValid } from './ImportBusData';
import BusData from '../../../NodeDataStructures/BusData';
import { setNodeInputValue } from '../../../NodeDataStructures/NodeInput';
import { min } from 'lodash';

interface ImportStateProps {
	stateJSON: string;
	setNodes: (nodes: NodeWithSusiData[]) => void;
	setEdges: (edges: Edge[]) => void;
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

	// Get or generate mediums
	const mediums = getImportMediums(importDict);
	setMediums(mediums);

	const nodeDict: Record<string, NodeWithSusiData> = {};
	const nodeArray: NodeWithSusiData[] = [];

	// First pass: create all nodes
	for (const [nodeId, nodeData] of Object.entries(importDict.components)) {
		const importData: ComponentImportData = getComponentImportData(nodeData);
		const nodeType = getNodeTypeWithName(importData.node_type);

		if (!nodeType) {
			logError(`Node ${nodeId} has unknown component type: ${nodeData.type}`);
			continue;
		}
		const newNode = createNodeFromType(nodeArray, nodeType, importData.node_position, mediums);

		// Fill in node inputs from import data
		const nodeInputs = getNodeInputs(nodeType.type_name, mediums);
		for (const nodeInput of nodeInputs) {
			const value = nodeData[nodeInput.resieName];
			if (value !== undefined) {
				setNodeInputValue(nodeInput, value, mediums);
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
	const edgeArray: Edge[] = [];
	const numIncomingEdgesPerNode: Record<string, number> = {};

	for (const [inputNodeId, inputNodeData] of Object.entries(importDict.components)) {
		const inputNode = nodeDict[inputNodeId];
		if (!inputNode) continue;

		const outputRefs = getOutputRefs(inputNodeData);

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
			const sourceHandleIndex = min([inputNodeEdgeIndex, inputNode.data.sourceHandles - 1]);
			const targetHandleIndex = min([0, outputNodeIncomingEdges, outputNode.data.targetHandles - 1]);
			const sourceHandle = `source-${sourceHandleIndex}`;
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

function getOutputRefs(nodeData: ComponentData): string[] {
	if (nodeData.import_data!.node_type!.toLowerCase() === 'bus') {
		return nodeData.connections?.output_order || [];
	}

	const outputRefs = nodeData.output_refs;
	if (Array.isArray(outputRefs)) {
		return outputRefs;
	}

	if (typeof outputRefs === 'object' && outputRefs !== null) {
		return Object.values(outputRefs) as string[];
	}

	return [];
}

export default importState;
