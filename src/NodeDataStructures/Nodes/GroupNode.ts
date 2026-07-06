import { Position, type XYPosition } from '@xyflow/react';
import type { SusiNodeData } from './SusiNodeData';
import type { SusiNode } from './SusiNode';

function createGroupNode(position: XYPosition, content: string | null = null): SusiNode {
	const timestamp = Date.now();
	if (!content) {
		content = 'New Group';
	}
	const susiNodeData: SusiNodeData = {
		content,
		componentType: '',
		nodeInputs: [],
		handleMediumDict: {
			source: [],
			target: [],
		},
		busData: null,
		nodeCategory: 'group',
		sourceHandles: 0,
		targetHandles: 0,
		hasValidInputs: true,
		inputCategories: [],
		economicInputs: [],
		emissionsInputs: [],
	};
	return {
		id: `${content}_${timestamp}`,
		position: position,
		data: susiNodeData,
		type: 'group',
		width: 200,
		height: 150,
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
		zIndex: 1,
		focusable: true,
		style: {
			'--category': susiNodeData.nodeCategory.toLowerCase(),
			width: 'auto',
		} as React.CSSProperties,
	};
}

export { createGroupNode };
