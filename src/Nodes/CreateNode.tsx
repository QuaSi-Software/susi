import type { Node, XYPosition } from '@xyflow/react';
import type { NodeType } from './SusiNodeTypes';
import { Position } from 'reactflow';
import { SusiNodeData } from './SusiNodeData';

export type NodeWithSusiData = Node & { susiData: SusiNodeData };

const createNodeFromType = (nodes: NodeWithSusiData[], nodeType: NodeType, position: XYPosition) => {
	const nodesWithType = nodes.filter((node: NodeWithSusiData) => node.susiData.componentType === nodeType.type_name);
	const index = nodesWithType.length;
	const content = 'TST_' + nodeType.segment + '_' + index;
	const timestamp = Date.now();
	const susiNodeData = new SusiNodeData(nodeType.type_name, content, [''], '', '', nodeType.category);
	return {
		id: `${content}_${timestamp}`,
		position: position,
		data: { label: content },
		type: 'default',
		sourcePosition: Position.Bottom,
		targetPosition: Position.Top,
		// sourceHandles: 0,
		// targetHandles: 0,
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
		susiData: susiNodeData,
	};
};

export default createNodeFromType;
