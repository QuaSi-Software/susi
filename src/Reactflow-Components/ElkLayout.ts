import Elk from 'elkjs/lib/elk.bundled.js';
import type { NodeWithSusiData } from '../NodeDataStructures/NodeWithSusiData';
import type { Edge } from '@xyflow/react';

const createElkGraphLayout = async (graphNodes: Array<NodeWithSusiData>, graphEdges: Array<Edge>) => {
	// console.log('Example node: ' + JSON.stringify(graphNodes[0]));
	console.log('node positions before: ' + graphNodes.map((n) => JSON.stringify(n.position)));

	const elk = new Elk({
		defaultLayoutOptions: {
			'elk.algorithm': 'stress',
			'elk.direction': 'RIGHT',
			'elk.spacing.nodeNode': '75',
			'elk.layered.spacing.nodeNodeBetweenLayers': '200',
			'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
		},
	});

	const nodes: Array<NodeWithSusiData> = JSON.parse(JSON.stringify(graphNodes));
	const edges = graphEdges.map((e) => ({ ...e, sources: [e.source], targets: [e.target] }));

	const newGraph = await elk.layout({
		id: 'root',
		children: nodes.map((node: NodeWithSusiData) => ({
			...node,
			width: node.measured?.width,
			height: node.measured?.height,
		})),
		edges: edges,
	});

	graphNodes.forEach((node) => {
		const newLayoutNode = newGraph.children?.find((n) => n.id === node.id);
		if (newLayoutNode?.x && newLayoutNode?.y && newLayoutNode?.width && newLayoutNode?.height) {
			node.position = {
				x: newLayoutNode.x, //- newLayoutNode.width / 2,
				y: newLayoutNode.y, //- newLayoutNode.height / 2,
			};
		}
		return node;
	});
	// console.log('graph.children positions after: ' + newGraph.children!.map((n) => '(' + n.x + ',' + n.y + ')'));
	console.log('node positions after: ' + graphNodes.map((n) => JSON.stringify(n.position)));
	return { layoutedNodes: graphNodes, layoutedEdges: newGraph.edges };
};

export default createElkGraphLayout;
