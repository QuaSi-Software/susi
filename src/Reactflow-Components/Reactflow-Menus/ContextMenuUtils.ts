import type { Dispatch, SetStateAction } from 'react';
import { deepCloneNode, type SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import { updateBusDataOnNodeDelete } from '../../NodeDataStructures/Bus/BusDataUtils';
import BusData from '../../NodeDataStructures/Bus/BusData';
import {
	getPositionAfterParentChange,
	moveChildIntoParentBounds,
} from '../../NodeDataStructures/GroupNodes/CalculateChildNodePosition';

function deleteNode(
	node: SusiNode,
	// allNodes: SusiNode[],
	allEdges: SusiEdge[],
	setNodes: Dispatch<SetStateAction<SusiNode[]>>,
	setEdges: Dispatch<SetStateAction<SusiEdge[]>>
) {
	if (node.deletable) {
		setNodes((nodes) => {
			let updatedNodes = nodes.filter((e) => e.id !== node.id);
			if (node.type === 'group') {
				/** If this node was a group node,  */
				updatedNodes = updatedNodes.map((n) =>
					n.parentId === node.id
						? { ...n, parentId: undefined, position: getPositionAfterParentChange(n, node, undefined) }
						: n
				);
			}
			updateBusDataOnNodeDelete(node.id, nodes, allEdges);
			return updatedNodes;
		});
		setEdges((edges) => {
			const updatedEdges = edges.filter((edge) => edge.source !== node.id && edge.target !== node.id);
			return updatedEdges;
		});
	}
}
/**
 * Seperate the node name into the text part and the number at the end,
 * And increase the number at the end until it's a unique name
 * @param {string} name The name of the node being duplicated
 * @param {*} nodes A list of all the nodes in the scene
 * @returns {string} The name for the duplicated node
 */
const findNameForDuplicate = (name: string, nodes: SusiNode[]) => {
	// divide the node name into a string part nameBase and whatever number is at the end of the name
	// if there is no number, the nameBase will just be the name and the new number will be 1
	const match = name.match(/^(.*?)(\d+)$/);
	let nameBase = match ? match[1] : name;
	let number = match ? parseInt(match[2]) + 1 : 1;
	// increase number until the name 'nameBase + number' (with and without 0 padding) is not taken
	while (nodes.find((node: SusiNode) => nameMatches(node.data.content, nameBase, number))) {
		number++;
	}
	return getPaddedName(nameBase, number);

	/** Get the node name where the number is zero padded to >2 digits */
	function getPaddedName(nameBase: string, number: number) {
		let paddedNumber = (number < 10 ? '0' : '') + number;
		return nameBase + paddedNumber;
	}
	/** Check if the name matches either the regular or padded version of nameBase+number */
	function nameMatches(nameToCheck: string, nameBase: string, number: number) {
		return nameToCheck === getPaddedName(nameBase, number) || nameToCheck === nameBase + number;
	}
};

function createDuplicateNode(nodeID: string, nodes: SusiNode[]): SusiNode | null {
	const nodeToDuplicate: SusiNode | undefined = nodes.find((node) => node.id === nodeID);
	console.assert(nodeToDuplicate != undefined, `Trying to duplicate a node that doesn't exist`);
	if (!nodeToDuplicate) return null;
	const duplicateNode: SusiNode = deepCloneNode(nodeToDuplicate);
	// move node towards bottom right and give it a unique ID
	duplicateNode.position.x += 20;
	duplicateNode.position.y += 20;
	/** if it's parented, make sure it's still within the bounds of the group */
	if (duplicateNode.parentId) {
		const parent = nodes.find((n) => n.id === duplicateNode.parentId);
		if (parent) duplicateNode.position = moveChildIntoParentBounds(duplicateNode, parent);
	}
	duplicateNode.id = nodeToDuplicate.id + '_' + new Date().getTime();
	let isBus = duplicateNode.data.componentType.toLowerCase() === 'bus';
	duplicateNode.data.busData = isBus ? new BusData() : null;
	duplicateNode.data.content = findNameForDuplicate(nodeToDuplicate.data.content, nodes);
	duplicateNode.selected = true;
	return duplicateNode;
}

export { deleteNode, createDuplicateNode };
