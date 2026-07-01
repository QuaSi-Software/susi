import { useContext, type Dispatch, type SetStateAction } from 'react';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import type { MenuPosition } from './Menus';
import { AppContext } from '../../AppContext';
import { Button, ButtonGroup } from 'react-bootstrap';
import { deleteNode, duplicateNode } from './ContextMenuUtils';

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
	edges,
	setSelectionContextMenu,
	setNodes,
	setEdges,
}: SelectionContextMenuProps) => {
	const setCheckState = useContext(AppContext)!.setCheckState;

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
		selectionContextMenu.nodes.forEach((node) => {
			duplicateNode(node.id, setNodes);
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
							<i className="bi bi-trash3"></i> Delete Components
						</Button>
						<Button className="contextMenu" variant="outline-primary" onClick={duplicateSelectionNodes}>
							<i className="bi bi-copy"></i> Duplicate Component
						</Button>
					</ButtonGroup>
				}
			</div>
		</>
	);
};

export { SelectionContextMenu, type SelectionContextMenuData };
