import type { Node, XYPosition } from '@xyflow/react';
import type { SusiNode } from './SusiNode';

function getPositionAfterParentChange(_node: SusiNode, prevParent?: SusiNode, newParent?: SusiNode): XYPosition {
	let position = Object.assign({}, _node.position);
	if (prevParent?.id === newParent?.id) return position;
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
	const nodeWidth = node.measured?.width ?? node.width ?? 0;
	const nodeHeight = node.measured?.height ?? node.height ?? 0;
	const nodeTopLeftCorner = {
		x: position.x - nodeWidth / 2,
		y: position.y - nodeHeight / 2,
	};

	const groupWidth = groupNode.measured?.width ?? groupNode.width ?? 0;
	const groupHeight = groupNode.measured?.height ?? groupNode.height ?? 0;

	const parentTopLeftCorner = {
		x: groupNode.position.x - groupWidth / 2,
		y: groupNode.position.y - groupHeight / 2,
	};

	if (nodeTopLeftCorner.x < parentTopLeftCorner.x) {
		position.x = 0;
	} else if (nodeTopLeftCorner.x + nodeWidth > parentTopLeftCorner.x + groupWidth) {
		position.x = groupWidth - nodeWidth / 2;
	} else {
		position.x = position.x - parentTopLeftCorner.x;
	}

	if (position.y < parentTopLeftCorner.y) {
		position.y = 0;
	} else if (nodeTopLeftCorner.y + nodeHeight > parentTopLeftCorner.y + groupHeight) {
		position.y = groupHeight - nodeHeight / 2;
	} else {
		position.y = position.y - parentTopLeftCorner.y;
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
