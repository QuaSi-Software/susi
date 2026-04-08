import type { Node, XYPosition } from '@xyflow/react';
import type { NodeType } from './SusiNodeTypes';
import { Position } from '@xyflow/react';
import { type SusiNodeData, createSusiNodeData } from './SusiNodeData';

export type NodeWithSusiData = Node & { data: SusiNodeData };

const createNodeFromType = (nodes: NodeWithSusiData[], nodeType: NodeType, position: XYPosition) => {
	const nodesWithType = nodes.filter((node: NodeWithSusiData) => node.data.componentType === nodeType.type_name);
	const index = nodesWithType.length;
	const content = 'TST_' + nodeType.segment + '_' + index;
	const timestamp = Date.now();
	const susiNodeData = createSusiNodeData(
		nodeType.type_name,
		content,
		[''],
		'',
		'',
		nodeType.category,
		nodeType.nr_outputs,
		nodeType.nr_inputs
	);
	return {
		id: `${content}_${timestamp}`,
		position: position,
		data: susiNodeData,
		type: 'default',
		sourcePosition: Position.Bottom,
		targetPosition: Position.Top,
		hidden: false,
		selected: false,
		dragging: false,
		draggable: true,
		selectable: false,
		connectable: true,
		resizing: false,
		deletable: false,
		zIndex: 0,
		focusable: true,
		style: {},
	};
};

export default createNodeFromType;
