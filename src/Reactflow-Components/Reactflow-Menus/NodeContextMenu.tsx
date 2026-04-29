import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';

import type { MenuPosition } from './Menus';
import { deepCloneNode, type SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import EditNodeModal from './EditNodeModal/EditNodeModal';
import BusData from '../../NodeDataStructures/Bus/BusData';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import { updateBusDataOnNodeDelete } from '../../NodeDataStructures/Bus/BusDataUtils';
import _ from 'lodash';

interface NodeContextMenuInput {
	nodeContextMenu: NodeContextMenuData | null;
	nodes: SusiNode[];
	edges: SusiEdge[];
	setNodeContextMenu: (NodeContextMenuData: NodeContextMenuData | null) => void;
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	setEdges: Dispatch<SetStateAction<SusiEdge[]>>;
}

interface NodeContextMenuData {
	node: SusiNode;
	menuPosition: MenuPosition;
}

const NodeContextMenu = ({
	nodeContextMenu,
	nodes,
	edges,
	setNodeContextMenu,
	setNodes,
	setEdges,
}: NodeContextMenuInput) => {
	const [showModal, setShowModal] = useState(false);

	// Check if the node still exists and if it was deleted somehow, close the context menu
	// This can happen if the user clicked 'Clear Graph' while the context menu was open
	useEffect(() => {
		if (!nodeContextMenu) return;
		let nodeInList = nodes.find((node) => node.id === nodeContextMenu.node.id);
		if (nodeInList === undefined) setNodeContextMenu(null);
	});

	const closeEditNodeModal = () => {
		setShowModal(false);
		setNodeContextMenu(null);
	};

	const handleEditNode = () => setShowModal(true);

	const handleDeleteNode = () => {
		if (!nodeContextMenu) return;
		if (nodeContextMenu.node.deletable) {
			const updatedNodes = nodes.filter((node) => node.id !== nodeContextMenu.node.id);
			const updatedEdges = edges.filter(
				(edge) => edge.source !== nodeContextMenu.node.id && edge.target !== nodeContextMenu.node.id
			);
			updateBusDataOnNodeDelete(nodeContextMenu.node.id, nodes, edges);
			setNodes(updatedNodes);
			setEdges(updatedEdges);
		}
		setNodeContextMenu(null);
	};

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

	/**
	 * Duplicate the selected node. Move the duplicated node towards the bottom right.
	 * Give the duplicated node a unique ID and name.
	 */
	const handleDuplicateNode = () => {
		if (!nodeContextMenu) return;
		// duplicate node object
		const nodeToDuplicate: SusiNode | undefined = nodes.find((node) => node.id === nodeContextMenu.node.id);
		console.assert(nodeToDuplicate != undefined);
		if (!nodeToDuplicate) return;
		const duplicateNode: SusiNode = deepCloneNode(nodeToDuplicate);
		// move node towards bottom right and give it a unique ID
		duplicateNode.position.x += 20;
		duplicateNode.position.y += 20;
		duplicateNode.id = nodeToDuplicate.id + '_' + new Date().getTime();
		let isBus = duplicateNode.data.componentType.toLowerCase() === 'bus';
		duplicateNode.data.busData = isBus ? new BusData() : null;
		duplicateNode.data.content = findNameForDuplicate(nodeToDuplicate.data.content, nodes);
		duplicateNode.selected = false;
		// update list of nodes
		let updatedNodes = [...nodes, duplicateNode];
		setNodes(updatedNodes);
		setNodeContextMenu(null);
	};

	if (!nodeContextMenu) return <></>;
	return (
		<>
			<div
				style={{
					position: 'absolute',
					top: nodeContextMenu.menuPosition.top,
					left: nodeContextMenu.menuPosition.left,
					right: nodeContextMenu.menuPosition.right,
					bottom: nodeContextMenu.menuPosition.bottom,
					backgroundColor: 'white',
					borderRadius: '8px',
					zIndex: 10,
				}}
			>
				{!showModal && (
					<ButtonGroup vertical>
						<Button className="contextMenu" variant="outline-primary" onClick={handleEditNode}>
							<i className="bi bi-tools"></i> Edit Node
						</Button>
						<Button className="contextMenu" variant="outline-primary" onClick={handleDuplicateNode}>
							<i className="bi bi-copy"></i> Duplicate Node
						</Button>
						<Button
							className="contextMenu"
							variant={nodeContextMenu.node.deletable ? 'outline-danger' : 'secondary'}
							onClick={handleDeleteNode}
							disabled={!nodeContextMenu.node.deletable}
						>
							<i className="bi bi-trash3"></i> Delete Node
						</Button>
					</ButtonGroup>
				)}
			</div>
			<EditNodeModal
				show={showModal}
				node={nodeContextMenu.node}
				nodes={nodes}
				edges={edges}
				handleClose={closeEditNodeModal}
				setNodes={setNodes}
				setEdges={setEdges}
			/>
		</>
	);
};

export { NodeContextMenu, type NodeContextMenuData };
