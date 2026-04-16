import type { Node, XYPosition } from '@xyflow/react';
import type { NodeType } from './SusiNodeTypes';
import { Position } from '@xyflow/react';
import { type SusiNodeData, createSusiNodeData } from './SusiNodeData';
import type { Medium } from './Medium';

/**
 * NodeWithSusiData is a normal ReactFlow Node, but with data replaced by the interface SusiNodeData for clarity
 * We want our data structures to be clear, so you can easily tell what data is where without a debugger
 */
export type NodeWithSusiData = Node & { data: SusiNodeData };

const createNodeFromType = (nodes: NodeWithSusiData[], nodeType: NodeType, position: XYPosition, mediums: Medium[]) => {
	const nodesWithType = nodes.filter((node: NodeWithSusiData) => node.data.componentType === nodeType.type_name);
	const index = nodesWithType.length;
	const content = 'TST_' + nodeType.segment + '_' + index;
	const timestamp = Date.now();
	const susiNodeData = createSusiNodeData(nodeType, content, mediums);
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
		selectable: true,
		connectable: true,
		resizing: false,
		deletable: true,
		zIndex: 0,
		focusable: true,
		style: {
			'--category': susiNodeData.nodeCategory.toLowerCase(),
			width: 'auto',
		} as React.CSSProperties,
	};
};

export default createNodeFromType;
