// import Elk from 'elkjs/lib/elk.bundled.js';
import { deepCloneNodes, type SusiNode } from '../NodeDataStructures/SusiNode';
import type { SusiEdge } from '../NodeDataStructures/SusiEdge';

const createElkGraphLayout = async (graphNodes: Array<SusiNode>, graphEdges: Array<SusiEdge>) => {
	/** Set up Layout options */
	// const elk = new Elk({
	const elk = new (await import('elkjs')).default({
		defaultLayoutOptions: {
			'elk.algorithm': 'layered',
			'elk.direction': 'RIGHT',
			'elk.spacing.nodeNode': '75',
			'elk.layered.spacing.nodeNodeBetweenLayers': '75',
			'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
		},
	});

	/** add sources and targets to edges, make a deep copy of the nodes */
	const nodes: Array<SusiNode> = deepCloneNodes(graphNodes);
	const edges = graphEdges.map((e) => ({ ...e, sources: [e.source], targets: [e.target] }));

	/** calculate new layout */
	const newGraph = await elk.layout({
		id: 'root',
		children: nodes.map((node: SusiNode) => ({
			...node,
			width: node.measured?.width,
			height: node.measured?.height,
		})),
		edges: edges,
	});

	/** set the position of the nodes using the calculated graph */
	nodes.forEach((node) => {
		const newLayoutNode = newGraph.children?.find((n) => n.id === node.id);
		if (newLayoutNode?.x && newLayoutNode?.y && newLayoutNode?.width && newLayoutNode?.height) {
			node.position = {
				x: newLayoutNode.x,
				y: newLayoutNode.y,
			};
		}
		return node;
	});
	return nodes;
};

export default createElkGraphLayout;
