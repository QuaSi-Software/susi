import Elk from 'elkjs/lib/elk.bundled.js';
import type { NodeWithSusiData } from '../NodeDataStructures/NodeWithSusiData';
import type { Edge } from '@xyflow/react';

const createElkGraphLayout = async (graphNodes: Array<NodeWithSusiData>, graphEdges: Array<Edge>) => {
	/** Set up Layout options */
	const elk = new Elk({
		defaultLayoutOptions: {
			'elk.algorithm': 'layered',
			'elk.direction': 'RIGHT',
			'elk.spacing.nodeNode': '75',
			'elk.layered.spacing.nodeNodeBetweenLayers': '75',
			'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
		},
	});

	/** add sources and targets to edges, make a deep copy of the nodes */
	const nodes: Array<NodeWithSusiData> = Object.assign([], graphNodes);
	const edges = graphEdges.map((e) => ({ ...e, sources: [e.source], targets: [e.target] }));

	/** calculate new layout */
	const newGraph = await elk.layout({
		id: 'root',
		children: nodes.map((node: NodeWithSusiData) => ({
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
