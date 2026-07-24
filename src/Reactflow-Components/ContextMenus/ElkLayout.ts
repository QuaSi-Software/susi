// import Elk from 'elkjs/lib/elk.bundled.js';
import { type SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import type { ElkNode } from 'elkjs';
import { minGroupNodeSize } from '../../NodeDataStructures/GroupNodes/GroupNodeComponent';

type GraphNode = ElkNode & SusiNode;

const createElkGraphLayout = async (graphNodes: Array<SusiNode>, graphEdges: Array<SusiEdge>): Promise<SusiNode[]> => {
	/** Set up Layout options */
	// const elk = new Elk({
	const elk = new (await import('elkjs')).default({
		defaultLayoutOptions: {
			'elk.algorithm': 'layered',
			'elk.direction': 'RIGHT',
			'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
			'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
			'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
			'elk.layered.considerModelOrder': 'NODES_AND_EDGES',
			'elk.edgeRouting': 'ORTHOGONAL',
			'elk.spacing.nodeNode': '40',
			'elk.layered.spacing.nodeNodeBetweenLayers': '60',
		},
	});

	/** add sources and targets to edges, make a deep copy of the nodes */
	const edges = graphEdges.map((e) => ({ ...e, sources: [e.source], targets: [e.target] }));
	const nodes: GraphNode[] = graphNodes.map((n) => ({
		...n,
		id: n.id,
		width: n.measured?.width ?? 75,
		height: n.measured?.height ?? 75,
		type: n.type ?? 'default',
		parentId: n.parentId,
		layoutOptions:
			n.type === 'group'
				? {
						'elk.nodeSize.minimum': `[${minGroupNodeSize.width}, ${minGroupNodeSize.height}]`,
						'elk.nodeSize.constraints': 'MINIMUM_SIZE',
						'elk.padding': '[top=30, left=10, bottom=10, right=10]',
					}
				: undefined,
	}));
	const children = nodes.filter((n) => n.type === 'group' || !n.parentId);
	children.forEach((parentNode) => {
		if (parentNode.type !== 'group') return;
		const groupChildren = nodes.filter((n) => n.parentId === parentNode.id);
		parentNode.children = groupChildren;
	});

	/** calculate new layout */
	const newGraph = await elk.layout({
		id: 'root',
		children,
		edges: edges,
	});

	/** turn the child graph into an array again */
	const formattedNodesWithoutParents: ElkNode[] = newGraph.children ?? [];
	let formattedNodes: ElkNode[] = [];
	formattedNodesWithoutParents.forEach((node) => {
		if (!node.children) return;
		formattedNodes = formattedNodes.concat(node.children);
	});
	formattedNodes = formattedNodes.concat(formattedNodesWithoutParents);

	/** set the position of the nodes using the calculated graph */
	nodes.forEach((node) => {
		const newLayoutNode = formattedNodes.find((n) => n.id === node.id);
		if (newLayoutNode?.x && newLayoutNode?.y && newLayoutNode?.width && newLayoutNode?.height) {
			node.position = {
				x: newLayoutNode.x + newLayoutNode.width / 2,
				y: newLayoutNode.y + newLayoutNode.height / 2,
			};
		}
		return node as SusiNode;
	});
	return nodes as SusiNode[];
};

export default createElkGraphLayout;
