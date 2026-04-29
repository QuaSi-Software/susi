import type { Connection } from '@xyflow/react';
import type { SusiNode } from '../NodeDataStructures/SusiNode';
import { updateBusDataOnEdgeConnect } from './BusDataWidget/BusDataUtils';
import { getMedium, getMediumKey, mediumsMatch } from '../Sidebar/Mediums/MediumUtils';
import type { Medium } from '../NodeDataStructures/Medium';
import type { SusiEdge } from '../NodeDataStructures/SusiEdge';

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
	var sourceIsBus = sourceNode.data.componentType === 'Bus';
	var targetIsBus = targetNode.data.componentType === 'Bus';
	for (let i = 0; i < edges.length; i++) {
		const edge = edges[i];
		var sourceHandleTaken = edge.source === sourceNode.id && edge.sourceHandle === sourceHandle;
		var targetHandleTaken = edge.target === targetNode.id && edge.targetHandle === targetHandle;
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
	const sourceMedium = getMedium(connection.sourceHandle!, sourceNode!.data, mediums);
	const sourceMediumKey = sourceMedium!.key;
	const targetMediumKey = getMediumKey(connection.targetHandle!, targetNode!.data);
	if (!mediumsMatch(sourceMediumKey, targetMediumKey)) {
		logError(
			`The mediums of handle ${connection.sourceHandle} on ${sourceNode?.data.content} and ${connection.targetHandle} on ${targetNode?.data.content} do not match or are undefined.`
		);
		return null;
	}
	/** Update Bus Data */
	if (sourceNode && targetNode) {
		updateBusDataOnEdgeConnect(sourceNode, targetNode.id, false);
		updateBusDataOnEdgeConnect(targetNode, sourceNode.id, true);
	}
	var newEdgeId = `st-flow-edge_${connection.source}-${connection.target}`;
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
