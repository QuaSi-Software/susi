import getOriginAdjustedNodeBounds from '../../NodeDataStructures/GroupNodes/OriginAdjustedNodeBounds';
import type { SusiNode } from '../Nodes/SusiNode';
import { getPositionAfterParentChange } from './CalculateChildNodePosition';

export function resizeGroupNodeToFitChildren(nodes: SusiNode[], parentNode: SusiNode): SusiNode[] {
	console.assert(parentNode.type === 'group', `Cannot resize non-group node`);
	/** Get the global child node positions, so you can get their bounding box */
	const childNodes = nodes.filter((n) => n.parentId === parentNode.id);
	const deparentedChildNodes = childNodes.map((n) => ({
		...n,
		position: getPositionAfterParentChange(n, parentNode, undefined),
	}));
	const bounds = getOriginAdjustedNodeBounds(deparentedChildNodes);
	const newParentNode = {
		...Object.assign({}, parentNode),
		position: { x: bounds.x, y: bounds.y },
		width: bounds.width,
		height: bounds.height,
		measured: {
			width: bounds.width,
			height: bounds.height,
		},
	};
	return nodes.map((n) => {
		if (n.id === parentNode.id) return newParentNode;
		else if (n.parentId === parentNode.id) {
			const deparentedNode = deparentedChildNodes.find((e) => e.id === n.id);
			const newPos = getPositionAfterParentChange(deparentedNode!, undefined, newParentNode);
			return { ...n, position: newPos, parentId: parentNode.id };
		} else return n;
	});
}
