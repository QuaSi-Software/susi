import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { NodeContextMenuData } from './NodeContextMenu';
import { createMenuPosition, type MenuPosition } from './Menus';
import type { EdgeContextMenuData } from './EdgeContextMenu';
import type { SelectionContextMenuData } from './SelectionContextMenu';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';

interface ContextMenuHandlerProps {
	ref: RefObject<HTMLInputElement | null>;
	nodes: SusiNode[];
	setNodeContextMenu: Dispatch<SetStateAction<NodeContextMenuData | null>>;
	setPaneContextMenu: Dispatch<SetStateAction<MenuPosition | null>>;
	setEdgeContextMenu: Dispatch<SetStateAction<EdgeContextMenuData | null>>;
	setSelectionContextMenu: Dispatch<SetStateAction<SelectionContextMenuData | null>>;
}

export function useContextMenuHandlers({
	ref,
	nodes,
	setNodeContextMenu,
	setPaneContextMenu,
	setEdgeContextMenu,
	setSelectionContextMenu,
}: ContextMenuHandlerProps) {
	const onEdgeContextMenu = (event: React.MouseEvent, edge: SusiEdge): void => {
		event.preventDefault();
		setNodeContextMenu(null);
		setPaneContextMenu(null);
		setSelectionContextMenu(null);

		let newEdgeContextMenuData: EdgeContextMenuData = {
			edge: edge,
			menuPosition: createMenuPosition(event, ref),
		};
		setEdgeContextMenu(newEdgeContextMenuData);
	};
	const onNodeContextMenu = (event: React.MouseEvent, node: SusiNode): void => {
		const selectedNodes = nodes.filter((node) => node.selected);
		if (selectedNodes.length > 1) {
			onSelectionContextMenu(event, selectedNodes);
			return;
		}
		event.preventDefault();
		setPaneContextMenu(null);
		setEdgeContextMenu(null);
		setSelectionContextMenu(null);

		setNodeContextMenu({
			node: node,
			menuPosition: createMenuPosition(event, ref),
		});
	};
	const onPaneContextMenu = (event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
		event.preventDefault();
		setNodeContextMenu(null);
		setEdgeContextMenu(null);
		setSelectionContextMenu(null);

		let newPaneContextMenuData: MenuPosition = createMenuPosition(event, ref);
		setPaneContextMenu(newPaneContextMenuData);
	};
	const onSelectionContextMenu = (event: React.MouseEvent<Element, MouseEvent>, selectedNodes: SusiNode[]) => {
		event.preventDefault();
		setNodeContextMenu(null);
		setEdgeContextMenu(null);
		setPaneContextMenu(null);

		let newSelectionContextData: SelectionContextMenuData = {
			nodes: selectedNodes,
			menuPosition: createMenuPosition(event, ref),
		};
		setSelectionContextMenu(newSelectionContextData);
	};
	const clearAllMenus = () => {
		setNodeContextMenu(null);
		setEdgeContextMenu(null);
		setPaneContextMenu(null);
		setSelectionContextMenu(null);
	};

	return {
		onNodeContextMenu,
		onEdgeContextMenu,
		onPaneContextMenu,
		onSelectionContextMenu,
		clearAllMenus,
	};
}
