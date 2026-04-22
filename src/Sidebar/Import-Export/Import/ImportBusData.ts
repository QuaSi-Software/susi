import type { NodeWithSusiData } from '../../../NodeDataStructures/NodeWithSusiData';
import type { ComponentData } from '../ExportDataStrucures';

export function isBusDataValid(
	node: NodeWithSusiData,
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
	if (isPermutation(connections.input_order, node.data.busData.inputOrder)) {
		logError(`Bus ${node.data.content} has an invalid input_order.`);
		return false;
	}

	if (!connections.output_order) {
		logError(`Bus ${node.data.content} does not have an output_order.`);
		return false;
	}
	if (isPermutation(connections.output_order, node.data.busData.outputOrder)) {
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
	if (arr1.length !== arr2.length) return false;
	const sorted1 = [...arr1].sort();
	const sorted2 = [...arr2].sort();
	return sorted1.every((val, idx) => val === sorted2[idx]);
}

function isValidMatrix(matrix: any[], numRows: number, numCols: number): boolean {
	if (!Array.isArray(matrix) || matrix.length !== numRows) return false;
	return matrix.every(
		(row) => Array.isArray(row) && row.length === numCols && row.every((el) => typeof el === 'number')
	);
}
