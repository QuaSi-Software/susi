import { useContext, type Dispatch, type SetStateAction } from 'react';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import type { MenuPosition } from './Menus';
import { AppContext } from '../../AppContext';
import { Button, ButtonGroup } from 'react-bootstrap';
import { deleteNode, createDuplicateNode } from './ContextMenuUtils';
import { getNewEdge } from '../../NodeDataStructures/Edges/CreateEdge';
import { type Connection } from '@xyflow/react';
import { createGroupNodeFromSelection } from '../../NodeDataStructures/Nodes/GroupNode';
import { getPositionAfterParentChange } from '../../NodeDataStructures/Nodes/CalculateChildNodePosition';

interface SelectionContextMenuProps {
	selectionContextMenu: SelectionContextMenuData | null;
	nodes: SusiNode[];
	edges: SusiEdge[];
	setSelectionContextMenu: Dispatch<SetStateAction<SelectionContextMenuData | null>>;
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	setEdges: Dispatch<SetStateAction<SusiEdge[]>>;
}

interface SelectionContextMenuData {
	nodes: SusiNode[];
	menuPosition: MenuPosition;
}

const SelectionContextMenu = ({
	selectionContextMenu,
	nodes,
	edges,
	setSelectionContextMenu,
	setNodes,
	setEdges,
}: SelectionContextMenuProps) => {
	const setCheckState = useContext(AppContext)!.setCheckState;
	const mediums = useContext(AppContext)!.mediums;

	function deleteSelectionNodes() {
		if (!selectionContextMenu) return;
		selectionContextMenu.nodes.forEach((node) => {
			if (node.deletable) {
				deleteNode(node, edges, setNodes, setEdges);
			}
		});
		setCheckState(true);
		setSelectionContextMenu(null);
	}

	function duplicateSelectionNodes() {
		if (!selectionContextMenu) return;
		const duplicatedNodes: Record<string, SusiNode> = {};
		selectionContextMenu.nodes.forEach((node) => {
			const newNode = createDuplicateNode(node.id, nodes);
			if (newNode) duplicatedNodes[node.id] = newNode;
		});
		const unselectedNodes: SusiNode[] = nodes.map((n) => ({ ...n, selected: false }));
		const updatedNodes = unselectedNodes.concat(Object.values(duplicatedNodes));
		/** duplicate edges where both source and target are in the selection nodes */
		const newEdges: SusiEdge[] = [];
		edges.forEach((edge) => {
			const duplicateSource = duplicatedNodes[edge.source];
			const duplicateTarget = duplicatedNodes[edge.target];
			if (!duplicateSource || !duplicateTarget) return;
			const connection: Connection = {
				source: duplicateSource.id,
				target: duplicateTarget.id,
				sourceHandle: edge.sourceHandle!,
				targetHandle: edge.targetHandle!,
			};
			const newEdge = getNewEdge(connection, updatedNodes, edges, mediums, () => {});
			if (newEdge) newEdges.push(newEdge);
		});
		setNodes(updatedNodes);
		setEdges((_edges) => _edges.concat(newEdges));
		setCheckState(true);
		setSelectionContextMenu(null);
	}

	function groupSelectionNodes() {
		if (!selectionContextMenu) return;
		const parentNode: SusiNode = createGroupNodeFromSelection(selectionContextMenu.nodes, null);
		const selectedNodeIDs = selectionContextMenu.nodes.map((n) => n.id);
		setNodes((_nodes) => {
			const childNodes: SusiNode[] = _nodes.map((n) => {
				const isSelectedNode = selectedNodeIDs.includes(n.id);
				if (isSelectedNode) {
					const position = getPositionAfterParentChange(
						n,
						_nodes.find((e) => e.id === n.parentId),
						parentNode
					);
					return { ...n, parentId: parentNode.id, position: position };
				} else {
					return n;
				}
			});
			return [parentNode].concat(childNodes);
		});
		setCheckState(true);
		setSelectionContextMenu(null);
	}

	if (selectionContextMenu == null) return <></>;
	return (
		<>
			<div
				style={{
					position: 'absolute',
					top: selectionContextMenu.menuPosition.top,
					left: selectionContextMenu.menuPosition.left,
					right: selectionContextMenu.menuPosition.right,
					bottom: selectionContextMenu.menuPosition.bottom,
					backgroundColor: 'white',
					borderRadius: '8px',
					zIndex: 10,
				}}
			>
				{
					<ButtonGroup vertical>
						<Button className="contextMenu" variant={'outline-danger'} onClick={deleteSelectionNodes}>
							<i className="bi bi-trash3"></i> Delete
						</Button>
						<Button className="contextMenu" variant="outline-primary" onClick={duplicateSelectionNodes}>
							<i className="bi bi-copy"></i> Duplicate
						</Button>
						<Button className="contextMenu" variant="outline-primary" onClick={groupSelectionNodes}>
							<i className="bi bi-collection"></i> Group
						</Button>
					</ButtonGroup>
				}
			</div>
		</>
	);
};

export { SelectionContextMenu, type SelectionContextMenuData };
