import type { Medium } from '../../../NodeDataStructures/Medium';
import type { SusiNode } from '../../../NodeDataStructures/SusiNode';
import type { SusiEdge } from '../../../NodeDataStructures/SusiEdge';
import type { NodeInput } from '../../../NodeDataStructures/NodeInput';
import type { ComponentData, Connections } from '../ExportDataStrucures';
import { getUndefinedMedium } from '../../Mediums/MediumUtils';

interface ExportProps {
	nodes: SusiNode[];
	edges: SusiEdge[];
	mediums: Medium[];
}

function getNodeNameFromID(nodeID: string, nodes: SusiNode[]) {
	return nodes.find((n) => n.id === nodeID)!.data.content;
}

/**
 * Return a list of mediums as lists [name, color]
 */
const getMediumListForExport = (mediums: Medium[]): Array<[string, string]> => {
	const nonUndefinedMedium = mediums.filter((m) => m.key !== getUndefinedMedium().key);
	return nonUndefinedMedium.map((m) => [m.name, m.color]);
};

/**
 * Get outputs of the given node as dictionaries mapping medium variable names to target node contents
 */
const getOutputRefs = (
	nodeId: string,
	nodes: SusiNode[],
	edges: SusiEdge[]
	// mediums: Medium[]
): Record<string, string> => {
	const output_refs: Record<string, string> = {};
	const edgesFromNode = edges.filter((e) => e.source === nodeId);
	for (const edge of edgesFromNode) {
		const sourceNode = nodes.find((n) => n.id === edge.source);
		if (!sourceNode) continue;

		// Parse handle indices from format like "source-0"
		const sourceHandleIndex = parseInt(edge.sourceHandle?.split('-')[1] ?? '0');
		// Find medium associated with source handle
		const sourceMediums = sourceNode.data.handleMediumDict.source;
		const mediumVarName = sourceMediums[sourceHandleIndex];

		// Get target node content
		const targetNodeName = getNodeNameFromID(edge.target, nodes);
		output_refs[mediumVarName] = targetNodeName;
	}

	return output_refs;
};

/**
 * Get bus connections (input_order, output_order, energy_flow)
 */
const getBusConnections = (node: SusiNode, nodes: SusiNode[]): Connections => {
	if (!node.data.busData) {
		console.error(`Bus ${node.data.content} has no bus data defined`);
		return { input_order: [], output_order: [], energy_flow: [] };
	}
	const busData = node.data.busData;
	const inputOrder = busData.inputOrder.map((id) => getNodeNameFromID(id, nodes));
	const outputOrder = busData.outputOrder.map((id) => getNodeNameFromID(id, nodes));

	return {
		input_order: inputOrder,
		output_order: outputOrder,
		energy_flow: busData.energyFlow,
	};
};

const addNodeInputsToObject = (nodeInputs: NodeInput[], obj: Record<string, any>, mediums: Medium[]) => {
	nodeInputs.forEach((nodeInput) => {
		if (!nodeInput.isIncluded && !nodeInput.isRequired) {
			return;
		}
		console.log('In addNodeInputsToObject: ' + nodeInput.value);
		obj[nodeInput.resieName] = nodeInput.getNodeInputExportValue(mediums);
	});
	return obj;
};

const exportState = ({ nodes, edges, mediums }: ExportProps): string => {
	const exportDict: Record<string, unknown> = {
		components: {},
		mediums: getMediumListForExport(mediums),
	};

	// const nodeMap = new Map(nodes.map((n) => [n.id, n]));
	const components: Record<string, ComponentData> = {};

	nodes.forEach((node) => {
		const compDict: ComponentData = { type: node.data.componentType };
		addNodeInputsToObject(node.data.nodeInputs, compDict, mediums);

		// Add import data
		compDict.import_data = {
			node_position: { x: node.position.x, y: node.position.y },
			node_type: node.data.componentType,
		};

		// Set output_refs/connections
		if (node.data.busData) {
			compDict.connections = getBusConnections(node, nodes);
		} else {
			const outputRefs = getOutputRefs(node.id, nodes, edges);
			compDict.output_refs = outputRefs;
		}
		components[node.data.content] = compDict;
	});

	exportDict['components'] = components;

	return JSON.stringify(exportDict, null, 2);
};

export default exportState;
