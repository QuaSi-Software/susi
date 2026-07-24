import type { Connection } from '@xyflow/react';
import type { SusiNode } from '../Nodes/SusiNode';
import { updateBusDataOnEdgeConnect } from '../Bus/BusDataUtils';
import { getMedium, getMediumKey, getUndefinedMedium, mediumsMatch, setMediumOfHandle } from '../Mediums/MediumUtils';
import type { Medium } from '../Mediums/Medium';
import type { SusiEdge } from './SusiEdge';

function getOrdinalNumberString(indexString: string): string {
	const index: number = parseInt(indexString) + 1;
	if (index % 10 === 1) return `${index}st`;
	if (index % 10 === 2) return `${index}nd`;
	if (index % 10 === 3) return `${index}rd`;
	return `${index}th`;
}

/**
 * Check if the source and target handle of the edge we are trying to connect are already taken
 * i.e. if there exists an edge that is already attached to it.
 * An exception is made for Buses, which are the only node allowed to have multiple edges connect to its handles
 */
function isHandleTaken(
	sourceHandle: string,
	targetHandle: string,
	sourceNode: SusiNode,
	targetNode: SusiNode,
	edges: SusiEdge[]
) {
	// edge is valid if its target and source handle are not already taken unless the node is a bus
	const sourceIsBus = sourceNode.data.componentType === 'Bus';
	const targetIsBus = targetNode.data.componentType === 'Bus';
	for (let i = 0; i < edges.length; i++) {
		const edge = edges[i];
		const sourceHandleTaken = edge.source === sourceNode.id && edge.sourceHandle === sourceHandle;
		const targetHandleTaken = edge.target === targetNode.id && edge.targetHandle === targetHandle;
		if ((!sourceIsBus && sourceHandleTaken) || (!targetIsBus && targetHandleTaken)) {
			return true;
		}
	}
	return false;
}
function nodesShareEdge(sourceNode: SusiNode, targetNode: SusiNode, edges: SusiEdge[]): boolean {
	const sharedEdge = edges.find((edge) => edge.source === sourceNode.id && edge.target === targetNode.id);
	return sharedEdge !== undefined;
}

const getNewEdge = (
	connection: Connection,
	nodes: SusiNode[],
	edges: SusiEdge[],
	mediums: Medium[],
	logError: (error: string) => void
): SusiEdge | null => {
	const sourceNode = nodes.find((e) => e.id === connection.source);
	if (!sourceNode) {
		console.error(`Node ${connection.source} not found.`);
		return null;
	}
	const targetNode = nodes.find((e) => e.id === connection.target);
	if (!targetNode) {
		console.error(`Node ${connection.target} not found.`);
		return null;
	}
	console.assert(connection.sourceHandle !== undefined, 'Source Handle cannot be undefined');
	console.assert(connection.targetHandle !== undefined, 'Target Handle cannot be undefined');
	/** Check if handle is taken */
	if (isHandleTaken(connection.sourceHandle!, connection.targetHandle!, sourceNode!, targetNode!, edges)) {
		logError('Cannot attach two edges to the same Handle');
		return null;
	}
	/** Check if the two nodes already share an edge */
	if (nodesShareEdge(sourceNode, targetNode, edges)) {
		logError(`${sourceNode.data.content} and ${targetNode.data.content} already share an edge.`);
		return null;
	}
	/** Set Mediums */
	let sourceMediumKey = getMedium(connection.sourceHandle!, sourceNode!.data, mediums)!.key;
	let targetMediumKey = getMediumKey(connection.targetHandle!, targetNode!.data);
	/** if only one of the mediums is undefined, set it to be the same as the other medium */
	const sourceMediumUndefined = sourceMediumKey === getUndefinedMedium().key;
	const targetMediumUndefined = targetMediumKey === getUndefinedMedium().key;
	if (sourceMediumUndefined && !targetMediumUndefined) {
		setMediumOfHandle(targetMediumKey, connection.sourceHandle!, sourceNode);
		sourceMediumKey = targetMediumKey;
	}
	if (targetMediumUndefined && !sourceMediumUndefined) {
		setMediumOfHandle(sourceMediumKey, connection.targetHandle!, targetNode);
		targetMediumKey = sourceMediumKey;
	}
	/** Check if the mediums match */
	if (!mediumsMatch(sourceMediumKey, targetMediumKey)) {
		const sourceHandleIndex = connection.sourceHandle?.charAt(connection.sourceHandle.length - 1);
		const targetHandleIndex = connection.targetHandle?.charAt(connection.targetHandle.length - 1);
		logError(
			`The mediums of the ${getOrdinalNumberString(sourceHandleIndex!)} handle on ${sourceNode?.data.content} and the ${getOrdinalNumberString(targetHandleIndex!)} handle on ${targetNode?.data.content} do not match or are undefined.`
		);
		return null;
	}
	/** Update Bus Data */
	if (sourceNode && targetNode) {
		updateBusDataOnEdgeConnect(sourceNode, targetNode.id, false);
		updateBusDataOnEdgeConnect(targetNode, sourceNode.id, true);
	}
	let newEdgeId = `st-flow-edge_${connection.source}-${connection.target}`;
	newEdgeId += '_' + Date.now();
	const newEdge: SusiEdge = {
		...connection,
		style: {
			stroke: `var(--medium-${sourceMediumKey})`,
		} as React.CSSProperties,
		data: { mediumKey: sourceMediumKey },
		labelShowBg: false,
		id: newEdgeId,
	};
	return newEdge;
};

export { getNewEdge };
