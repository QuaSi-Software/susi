import type { SusiNode } from '../Nodes/SusiNode';
import type { SusiEdge } from '../Edges/SusiEdge';

/**
 * Update input_order, output_order and energy_flow in node.data.bus_data with this new connection
 * This code is a duplicate of a python function in create_elements.py
 * @param {Object} node The bus, whose data we're updating
 * @param {string} connectedNodeID the id of the node being connected to this bus
 * @param {boolean} incoming is this an incoming (or outgoing) connection i.e. is node the target node
 * @returns
 */
function updateBusDataOnEdgeConnect(node: SusiNode, connectedNodeID: string, incoming: boolean) {
	if (node.data.componentType.toLowerCase() !== 'bus') return;
	let busData = node.data.busData;
	if (incoming) {
		busData?.addToInputOrder(connectedNodeID);
	} else {
		busData?.addToOutputOrder(connectedNodeID);
	}
}

/**
 * Removes a node from a bus's input/output_order and energy_flow
 * @param {Object} node the node whose bus_data we're updating
 * @param {string} disconnectedNodeID the id of the node we're disconnecting from the bus
 * @param {boolean} incoming Is this an incoming connection i.e. is the bus the target
 */
function removeBusConnection(node: SusiNode, disconnectedNodeID: string, incoming: boolean) {
	if (!node.data.busData) return;
	const busData = node.data.busData;
	if (incoming) busData.removeFromInputOrder(disconnectedNodeID);
	else busData.removeFromOutputOrder(disconnectedNodeID);
}

/**
 * Find all the edges that are deleted when this node is deleted.
 * Then update the bus_data to remove those connections.
 * @param {string} deletedNodeID The id of the node that was deleted
 * @param {List[Object]} nodes All the nodes in the scene
 * @param {List[Object]} edges All the edges in the scene
 */
function updateBusDataOnNodeDelete(deletedNodeID: string, nodes: Array<SusiNode>, edges: Array<SusiEdge>) {
	const deletedEdges = edges.filter((edge) => edge.source === deletedNodeID || edge.target === deletedNodeID);
	deletedEdges.forEach((edge) => {
		let source = nodes.find((node) => node.id === edge.source);
		let target = nodes.find((node) => node.id === edge.target);
		if (source) removeBusConnection(source, edge.target, false);
		if (target) removeBusConnection(target, edge.source, true);
	});
}

function updateBusDataOnEdgeDelete(nodes: Array<SusiNode>, edge: SusiEdge) {
	nodes.forEach((node) => {
		if (edge.source === node.id) {
			removeBusConnection(node, edge.target, false);
		} else if (edge.target === node.id) {
			removeBusConnection(node, edge.source, true);
		}
	});
}

export { updateBusDataOnEdgeConnect, updateBusDataOnNodeDelete, updateBusDataOnEdgeDelete };
