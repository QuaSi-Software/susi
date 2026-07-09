import type { Node, XYPosition } from '@xyflow/react';
import type { NodeType } from './SusiNodeTypes';
import { Position } from '@xyflow/react';
import { type SusiNodeData, createSusiNodeData } from './SusiNodeData';

import _ from 'lodash';

/**
 * SusiNode is a normal ReactFlow Node, but with data replaced by the interface SusiNodeData for clarity
 * We want our data structures to be clear, so you can easily tell what data is where without a debugger
 */
export type SusiNode = Node & { data: SusiNodeData };

const createNodeFromType = (
	nodes: SusiNode[],
	nodeType: NodeType,
	position: XYPosition,
	nodeNamePrefix: string,
	content: string | null = null
): SusiNode => {
	const nodesWithType = nodes.filter((node: SusiNode) => node.data.componentType === nodeType.type_name);
	const index = nodesWithType.length;
	const timestamp = Date.now();
	if (!content) {
		if (nodeNamePrefix !== '') nodeNamePrefix += '_';
		content = nodeNamePrefix + nodeType.segment + '_' + index;
	}
	const susiNodeData = createSusiNodeData(nodeType, content);
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

export function checkNodeValidInputs(node: SusiNode) {
	console.assert(
		node.data.nodeInputs !== undefined,
		`Trying to access node inputs of group node: ${node.data.label}`
	);
	const hasValidInputs = node.data.nodeInputs!.every((input) => input.isValid());
	node.data.hasValidInputs = hasValidInputs;
}

export const deepCloneNode = (node: SusiNode): SusiNode => {
	const newNode = _.cloneDeep(node);
	newNode.data.nodeInputs = node.data.nodeInputs.map((input) => input.copy());
	return newNode;
};
export const deepCloneNodes = (nodes: SusiNode[]): SusiNode[] => {
	return nodes.map((n) => deepCloneNode(n));
};

export default createNodeFromType;
