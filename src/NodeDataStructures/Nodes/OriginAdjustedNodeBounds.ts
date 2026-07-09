import type { Rect, XYPosition } from '@xyflow/react';
import type { SusiNode } from './SusiNode';

function getNodeBounds(node: SusiNode): Rect {
	const position = node.position ?? { x: 0, y: 0 };
	const nodeWidth = node.measured?.width ?? 0;
	const nodeHeight = node.measured?.height ?? 0;

	return {
		x: position.x,
		y: position.y,
		width: nodeWidth,
		height: nodeHeight,
	};
}

function getMinMax(rect: Rect): { min: XYPosition; max: XYPosition } {
	return {
		min: {
			x: rect.x - rect.width / 2,
			y: rect.y - rect.height / 2,
		},
		max: {
			x: rect.x + rect.width / 2,
			y: rect.y + rect.height / 2,
		},
	};
}

function getBoundingBounds(rect1: Rect, rect2: Rect): Rect {
	const { min: min1, max: max1 } = getMinMax(rect1);
	const { min: min2, max: max2 } = getMinMax(rect2);
	const min = {
		x: Math.min(min1.x, min2.x),
		y: Math.min(min1.y, min2.y),
	};
	const max = {
		x: Math.max(max1.x, max2.x),
		y: Math.max(max1.y, max2.y),
	};
	return {
		x: (min.x + max.x) / 2,
		y: (min.y + max.y) / 2,
		width: Math.abs(max.x - min.x),
		height: Math.abs(max.y - min.y),
	};
}

export default function getOriginAdjustedNodeBounds(nodes: SusiNode[], padding: number): Rect {
	let bounds: Rect = getNodeBounds(nodes[0]);
	nodes.forEach((node) => {
		const nodeBounds = getNodeBounds(node);
		bounds = getBoundingBounds(bounds, nodeBounds);
	});
	return {
		x: bounds.x,
		y: bounds.y,
		width: bounds.width + padding,
		height: bounds.height + padding,
	};
}
