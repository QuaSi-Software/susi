import type { SusiEdge } from '../Edges/SusiEdge';
import type { SusiNode } from './SusiNode';

/** Find all nodes that have no connected edges  */
export function findUnconnectedNodes(nodes: SusiNode[], edges: SusiEdge[]) {
	return nodes.filter((node) => {
		if (node.type === 'group') return false;
		/** Find all edges connected to this node */
		const connectedEdge = edges.find((edge) => edge.source === node.id || edge.target === node.id);
		return connectedEdge === undefined;
	});
}
