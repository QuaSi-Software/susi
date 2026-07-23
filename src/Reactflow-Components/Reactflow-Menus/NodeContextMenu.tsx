import { useState, useEffect, type Dispatch, type SetStateAction, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';

import type { MenuPosition } from './Menus';
import { type SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import EditNodeModal from './EditNodeModal';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import _ from 'lodash';
import { AppContext } from '../../AppContext';
import { checkForDuplicateNodeNames, createDuplicateNode, deleteNode } from './ContextMenuUtils';
import { resizeGroupNodeToFitChildren } from '../../NodeDataStructures/GroupNodes/ResizeGroupNodeToFitChildren';

interface NodeContextMenuInput {
	nodeContextMenu: NodeContextMenuData | null;
	nodes: SusiNode[];
	edges: SusiEdge[];
	setNodeContextMenu: (NodeContextMenuData: NodeContextMenuData | null) => void;
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	setEdges: Dispatch<SetStateAction<SusiEdge[]>>;
	getResieParameter: (menuName: string, inputName: string) => any;
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
	getResieParameter,
}: NodeContextMenuInput) => {
	const [showModal, setShowModal] = useState(false);
	const setCheckState = useContext(AppContext)!.setCheckState;

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
			deleteNode(nodeContextMenu.node, edges, setNodes, setEdges);
			checkForDuplicateNodeNames(setNodes);
		}
		setCheckState(true);
		setNodeContextMenu(null);
	};

	/**
	 * Duplicate the selected node. Move the duplicated node towards the bottom right.
	 * Give the duplicated node a unique ID and name.
	 */
	const handleDuplicateNode = () => {
		if (!nodeContextMenu) return;
		setNodes((nodes) => {
			const nodeID = nodeContextMenu.node.id;
			const duplicateNode = createDuplicateNode(nodeID, nodes);
			if (!duplicateNode) return nodes;
			// update list of nodes: deselect original, keep new one selected
			let updatedNodes: SusiNode[] = nodes.map((node) => ({ ...node, selected: false }));
			updatedNodes = [...updatedNodes, duplicateNode];
			return updatedNodes;
		});
		setNodeContextMenu(null);
		setCheckState(true);
	};

	const fitGroupNodeToChildren = () => {
		if (!nodeContextMenu) return;
		const parentNode = nodeContextMenu.node;
		setNodes((nodes) => {
			return resizeGroupNodeToFitChildren(nodes, parentNode);
		});
		setNodeContextMenu(null);
		setCheckState(true);
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
							<i className="bi bi-tools"></i> Edit
						</Button>
						<Button className="contextMenu" variant="outline-primary" onClick={handleDuplicateNode}>
							<i className="bi bi-copy"></i> Duplicate
						</Button>
						{nodeContextMenu.node.type === 'group' && (
							<Button className="contextMenu" variant="outline-primary" onClick={fitGroupNodeToChildren}>
								<i className="bi bi-bounding-box-circles"></i> Resize to fit content
							</Button>
						)}
						<Button
							className="contextMenu"
							variant={nodeContextMenu.node.deletable ? 'outline-danger' : 'secondary'}
							onClick={handleDeleteNode}
							disabled={!nodeContextMenu.node.deletable}
						>
							<i className="bi bi-trash3"></i> Delete
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
				getResieParameter={getResieParameter}
			/>
		</>
	);
};

export { NodeContextMenu, type NodeContextMenuData };
