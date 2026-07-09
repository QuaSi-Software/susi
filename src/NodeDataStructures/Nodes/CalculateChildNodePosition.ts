import type { Node, XYPosition } from '@xyflow/react';
import type { SusiNode } from './SusiNode';

function getPositionAfterParentChange(_node: SusiNode, prevParent?: SusiNode, newParent?: SusiNode): XYPosition {
	let position = _node.position;
	if (prevParent) {
		position = getNodePositionOutsideParent(_node.position, prevParent);
	}
	if (newParent) {
		position = getNodePositionInsideParent(position, _node, newParent);
	}
	return position;
}

const getNodePositionInsideParent = (nodePosition: XYPosition, node: Partial<Node>, groupNode: Node): XYPosition => {
	const position = nodePosition ?? { x: 0, y: 0 };
	const nodeWidth = node.measured?.width ?? 0;
	const nodeHeight = node.measured?.height ?? 0;

	const groupWidth = groupNode.measured?.width ?? 0;
	const groupHeight = groupNode.measured?.height ?? 0;

	const groupPosition = {
		x: groupNode.position.x - groupWidth / 2,
		y: groupNode.position.y - groupHeight / 2,
	};

	if (position.x < groupPosition.x) {
		position.x = 0;
	} else if (position.x + nodeWidth > groupPosition.x + groupWidth) {
		position.x = groupWidth - nodeWidth;
	} else {
		position.x = position.x - groupPosition.x;
	}

	if (position.y < groupPosition.y) {
		position.y = 0;
	} else if (position.y + nodeHeight > groupPosition.y + groupHeight) {
		position.y = groupHeight - nodeHeight;
	} else {
		position.y = position.y - groupPosition.y;
	}

	return position;
};

function getNodePositionOutsideParent(nodePosition: XYPosition, previousParent: SusiNode): XYPosition {
	const groupWidth = previousParent.measured?.width ?? 0;
	const groupHeight = previousParent.measured?.height ?? 0;
	const parentPos = {
		x: previousParent.position.x - groupWidth / 2,
		y: previousParent.position.y - groupHeight / 2,
	};
	return {
		x: nodePosition.x + parentPos.x,
		y: nodePosition.y + parentPos.y,
	};
}

export { getPositionAfterParentChange };
