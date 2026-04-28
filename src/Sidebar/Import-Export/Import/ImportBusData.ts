import type { SusiNode } from '../../../NodeDataStructures/SusiNode';
import type { ComponentData } from '../ExportDataStrucures';

function getNodeIDFromName(nodeName: string, nodes: SusiNode[]) {
	return nodes.find((n) => n.data.content === nodeName)!.id;
}

export function isBusDataValid(
	node: SusiNode,
	nodes: SusiNode[],
	importedNodeData: ComponentData,
	logError: (msg: string) => void
): boolean {
	if (!node.data.busData) return false;

	const connections = importedNodeData.connections;
	if (!connections) {
		logError(`Bus ${node.data.content} does not have connections object.`);
		return false;
	}

	// Validate input_order and output_order
	if (!connections.input_order) {
		logError(`Bus ${node.data.content} does not have an input_order.`);
		return false;
	}
	const importedInputOrderIDs = connections.input_order.map((name) => getNodeIDFromName(name, nodes));
	if (!isPermutation(importedInputOrderIDs, node.data.busData.inputOrder)) {
		logError(`Bus ${node.data.content} has an invalid input_order.`);
		return false;
	}

	if (!connections.output_order) {
		logError(`Bus ${node.data.content} does not have an output_order.`);
		return false;
	}
	const importedOutputOrderIDs = connections.output_order.map((name) => getNodeIDFromName(name, nodes));
	if (!isPermutation(importedOutputOrderIDs, node.data.busData.outputOrder)) {
		logError(`Bus ${node.data.content} has an invalid output_order.`);
		return false;
	}

	// Validate energy_flow matrix
	if (!connections.energy_flow) {
		logError(`Bus ${node.data.content} has no energy_flow.`);
		return false;
	} else if (
		!isValidMatrix(
			connections.energy_flow,
			node.data.busData.inputOrder.length,
			node.data.busData.outputOrder.length
		)
	) {
		logError(`Bus ${node.data.content} has invalid energy_matrix`);
		return false;
	}
	return true;
}

function isPermutation(arr1: string[], arr2: string[]): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	} else if (arr1.length === 0) {
		return true;
	}
	const sorted1 = [...arr1].sort();
	const sorted2 = [...arr2].sort();
	const isSame = sorted1.every((val, idx) => val === sorted2[idx]);
	return isSame;
}

function isValidMatrix(matrix: any[], numRows: number, numCols: number): boolean {
	if (!Array.isArray(matrix) || matrix.length !== numRows) return false;
	return matrix.every(
		(row) => Array.isArray(row) && row.length === numCols && row.every((el) => typeof el === 'number')
	);
}
