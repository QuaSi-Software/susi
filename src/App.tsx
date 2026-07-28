import { useCallback, useRef, useState, useEffect } from 'react';
import type { FC, DragEvent as ReactDragEvent } from 'react';
import {
	ReactFlow,
	ReactFlowProvider,
	addEdge,
	useNodesState,
	useEdgesState,
	Controls,
	useReactFlow,
	Background,
} from '@xyflow/react';

import './CSS/index.css';

/** Nodes */
import { DnDProvider, useDnD } from './Sidebar/DnDContext';
import createNodeFromType, { deepCloneNodes, type SusiNode } from './NodeDataStructures/Nodes/SusiNode';
import MarkdownNode from './NodeDataStructures/Nodes/MarkdownNode';
import { getIntersectionsWithGroupNode } from './NodeDataStructures/GroupNodes/IntersectionWithGroupNode';
import { getPositionAfterParentChange } from './NodeDataStructures/GroupNodes/CalculateChildNodePosition';
import GroupNodeComponent from './NodeDataStructures/GroupNodes/GroupNodeComponent';
import type { NodeType } from './NodeDataStructures/Nodes/SusiNodeTypes';

/** Edges */
import type { Connection } from '@xyflow/react';
import { EdgeType, type SusiEdge } from './NodeDataStructures/Edges/SusiEdge';
import { getNewEdge } from './NodeDataStructures/Edges/CreateEdge';

/** Mediums */
import { setMediumCSSVariables } from './Sidebar/Mediums/MediumCSSUtils';
import { type Medium } from './NodeDataStructures/Mediums/Medium';
import { getDefaultMediums } from './NodeDataStructures/Mediums/MediumUtils';

/** Context Menus */
import { EdgeContextMenu, type EdgeContextMenuData } from './Reactflow-Components/ContextMenus/EdgeContextMenu';
import { type MenuPosition } from './Reactflow-Components/ContextMenus/Menus';
import { NodeContextMenu, type NodeContextMenuData } from './Reactflow-Components/ContextMenus/NodeContextMenu';
import PaneContextMenu from './Reactflow-Components/ContextMenus/PaneContextMenu';
import {
	SelectionContextMenu,
	type SelectionContextMenuData,
} from './Reactflow-Components/ContextMenus/SelectionContextMenu';

/** Error Messages and Overlays */
import ErrorMenu from './Reactflow-Components/Errors/ErrorMenu';
import type { ErrorMessage } from './Reactflow-Components/Errors/ErrorMessage';
import LoadingOverlay from './Reactflow-Components/LoadingOverlay';
import ErrorOverlay from './Reactflow-Components/ErrorScreenOverlay';

/** API Data */
import { fetchComponentInputs, getNodeInputsFromAPI } from './FetchingApiData/HandleAPICalls';
import { type ApiCategory } from './FetchingApiData/ApiData';
import type { ResieParameterMenuInfo } from './Sidebar/ResieParameters/ResieParameterMenuInfo';

/** Other */
import Sidebar from './Sidebar/Sidebar';
import { AppContext } from './AppContext';
import { UndoButton } from './Reactflow-Components/UndoButton';
import { Locale } from './Sidebar/SettingsMenu';
import { ClearNodesButton } from './Reactflow-Components/ClearNodesButton';
import logo from './assets/resie.svg';
import { useContextMenuHandlers } from './Reactflow-Components/ContextMenus/useContextMenuHandlers';

const DnDFlow = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState<SusiNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<SusiEdge>([]);
	const { screenToFlowPosition } = useReactFlow();
	const [type] = useDnD();
	const ref = useRef<HTMLInputElement>(null);

	/** Context Menus */
	const [edgeContextMenu, setEdgeContextMenu] = useState<EdgeContextMenuData | null>(null);
	const [nodeContextMenu, setNodeContextMenu] = useState<NodeContextMenuData | null>(null);
	const [paneContextMenu, setPaneContextMenu] = useState<MenuPosition | null>(null);
	const [selectionContextMenu, setSelectionContextMenu] = useState<SelectionContextMenuData | null>(null);
	const { onNodeContextMenu, onEdgeContextMenu, onPaneContextMenu, onSelectionContextMenu, clearAllMenus } =
		useContextMenuHandlers({
			ref,
			nodes,
			setNodeContextMenu,
			setEdgeContextMenu,
			setPaneContextMenu,
			setSelectionContextMenu,
		});

	/**  */
	const [mediums, setMediums] = useState<Medium[]>(getDefaultMediums());
	const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([]);
	const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
	const [overlayErrorMessage, setOverlayErrorMessage] = useState<string | null>(null);
	const [nodeNamePrefix, setNodeNamePrefix] = useState<string>('');
	const [checkState, setCheckState] = useState<boolean>(false);
	const [theme, setTheme] = useState<'dark' | 'light'>('light');
	const [locale, setLocale] = useState<Locale>(Locale.US);
	const [edgeType, setEdgeType] = useState<EdgeType>(EdgeType.DEFAULT);

	/** Data imported from API */
	const [componentTypes, setComponentTypes] = useState<Record<string, NodeType> | null>(null);
	const [componentCategories, setComponentCategories] = useState<ApiCategory[]>([]);
	const [resieParameterMenus, setResieParameterMenus] = useState<ResieParameterMenuInfo[]>([]);

	// const { onNodeDragStop } = useNodeDragHandlers();
	document.documentElement.setAttribute('data-theme', theme);

	fetchComponentInputs(
		setLoadingMessage,
		mediums,
		componentTypes,
		setComponentTypes,
		setComponentCategories,
		setResieParameterMenus,
		setOverlayErrorMessage
	);
	const getNodeInputs = (componentType: string) => {
		return getNodeInputsFromAPI(componentType, componentTypes);
	};
	/** Log error */
	const logError = (message: string) => {
		setErrorMessages((prevMessages) => [
			...prevMessages,
			{
				message: message,
				key: `id_${Math.random().toString(16).slice(2)}`,
			},
		]);
	};
	/** check value in resie parameter menus */
	const getResieParameter = (menuExportKey: string, inputName: string) => {
		const menu = resieParameterMenus.find((e) => e.exportKey === menuExportKey);
		if (!menu) return null;
		const input = menu.inputs.find((e) => e.resieName === inputName);
		if (!input) return null;
		return input.value;
	};

	// Update CSS variables whenever mediums change
	useEffect(() => {
		setMediumCSSVariables(mediums);
	}, [mediums]);

	const onConnect = useCallback(
		(connection: Connection): void => {
			const _nodes = deepCloneNodes(nodes);
			const edge: SusiEdge | null = getNewEdge(connection, _nodes, edges, mediums, logError);
			if (edge === null) return;
			setEdges((eds) => addEdge({ ...edge, type: edgeType }, eds));
			setNodes(_nodes);
			setCheckState(true);
		},
		[setEdges, nodes, edges, mediums]
	);
	const onNodeDragStop = useCallback(
		(_: MouseEvent | TouchEvent, _draggedNode: SusiNode, draggedNodes: SusiNode[]) => {
			draggedNodes.forEach((_node) => {
				/** For the intersection check, you have to convert the node position into world space */
				const prevParent = _node.parentId ? nodes.find((n) => n.id === _node.parentId) : undefined;
				const intersections = getIntersectionsWithGroupNode(
					{ ..._node, position: getPositionAfterParentChange(_node, prevParent, undefined) },
					nodes
				);
				const newParent = intersections[0];
				const parentId = newParent ? newParent?.id : undefined;
				if (_node.parentId !== parentId) {
					/** get node position */
					const position = getPositionAfterParentChange(_node, prevParent, newParent);
					/** update node with new or newly undefined parent */
					setNodes((_nodes) =>
						_nodes.map((n: SusiNode) =>
							n.id === _node.id ? { ..._node, parentId: parentId, position } : n
						)
					);
				}
			});
			setCheckState(true);
		},
		[setNodes, nodes]
	);

	const onDragOver = useCallback((event: ReactDragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onDrop = useCallback(
		(event: ReactDragEvent<HTMLDivElement>) => {
			event.preventDefault();

			// check if the dropped element is valid
			if (!type) {
				return;
			}

			// project was renamed to screenToFlowPosition
			// and you don't need to subtract the reactFlowBounds.left/top anymore
			// details: https://reactflow.dev/whats-new/2023-11-10
			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});
			const newNode = createNodeFromType(nodes, type, position, nodeNamePrefix);
			newNode.measured = {
				width: 50,
				height: 50,
			}; // add estimated height and width, so getIntersectingNodes works right
			newNode.selected = true;

			/** check if node was dragged into a group */
			const intersections = getIntersectionsWithGroupNode(newNode, nodes) as SusiNode[];
			const newParent = intersections.length > 0 ? intersections[0] : undefined;
			if (newParent) {
				newNode.position = getPositionAfterParentChange(newNode, undefined, newParent);
				newNode.parentId = newParent.id;
			}

			setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
			setNodes((nds) => nds.concat(newNode));

			setCheckState(true);
		},
		[screenToFlowPosition, type, setNodes, nodes, nodeNamePrefix]
	);

	const onDragStart = (event: ReactDragEvent<HTMLDivElement>) => {
		if (type) {
			event.dataTransfer.setData('text/plain', type.button_name as string);
			event.dataTransfer.effectAllowed = 'move';
		}
	};

	return (
		<div className="dndflow">
			<AppContext.Provider
				value={{
					mediums: mediums,
					setMediums: setMediums,
					setErrorMessages: setErrorMessages,
					setLoadingMessage: setLoadingMessage,
					getNodeInputs: getNodeInputs,
					setCheckState: setCheckState,
					locale: locale,
				}}
			>
				<LoadingOverlay message={loadingMessage} />
				<ErrorOverlay message={overlayErrorMessage} />
				<Sidebar
					nodes={nodes}
					setNodes={setNodes}
					edges={edges}
					setEdges={setEdges}
					logError={logError}
					nodeNamePrefix={nodeNamePrefix}
					setNodeNamePrefix={setNodeNamePrefix}
					resieParameterMenus={resieParameterMenus}
					setresieParameterMenus={setResieParameterMenus}
					theme={theme}
					setTheme={setTheme}
					setLocale={setLocale}
					nodeTypes={componentTypes}
					categories={componentCategories}
					setResieParameterMenus={setResieParameterMenus}
					edgeType={edgeType}
					setEdgeType={setEdgeType}
				/>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onDrop={onDrop}
					onNodeDragStop={onNodeDragStop}
					onDragStart={onDragStart}
					onDragOver={onDragOver}
					fitView
					nodeOrigin={[0.5, 0.5]}
					nodeTypes={{ default: MarkdownNode, group: GroupNodeComponent }}
					colorMode={theme}
					ref={ref}
					onEdgeContextMenu={onEdgeContextMenu}
					onNodeContextMenu={onNodeContextMenu}
					onPaneContextMenu={onPaneContextMenu}
					onSelectionContextMenu={onSelectionContextMenu}
					onPaneClick={clearAllMenus}
				>
					<Controls showInteractive={false} />
					<Background />
					<div className="canvas-button-section">
						<UndoButton
							nodes={nodes}
							edges={edges}
							checkState={checkState}
							setNodes={setNodes}
							setEdges={setEdges}
						/>
						<ClearNodesButton nodes={nodes} setNodes={setNodes} setEdges={setEdges} />
					</div>
					<a href="https://quasi-software.readthedocs.io/en/latest/" className="resie-logo" target="_blank">
						<img src={logo} style={{ width: 'inherit' }} />
					</a>
				</ReactFlow>
				<EdgeContextMenu
					edgeContextMenuData={edgeContextMenu}
					setEdgeContextMenu={setEdgeContextMenu}
					setEdges={setEdges}
					setNodes={setNodes}
				/>
				<NodeContextMenu
					nodeContextMenu={nodeContextMenu}
					nodes={nodes}
					edges={edges}
					edgeType={edgeType}
					setNodeContextMenu={setNodeContextMenu}
					setNodes={setNodes}
					setEdges={setEdges}
					getResieParameter={getResieParameter}
				/>
				<SelectionContextMenu
					selectionContextMenu={selectionContextMenu}
					nodes={nodes}
					edges={edges}
					edgeType={edgeType}
					setSelectionContextMenu={setSelectionContextMenu}
					setNodes={setNodes}
					setEdges={setEdges}
				/>
				<PaneContextMenu
					paneContextMenu={paneContextMenu}
					setPaneContextMenu={setPaneContextMenu}
					nodes={nodes}
					setNodes={setNodes}
					edges={edges}
				/>
				<ErrorMenu messages={errorMessages} setMessages={setErrorMessages} />
			</AppContext.Provider>
		</div>
	);
};

const App: FC = () => (
	<ReactFlowProvider>
		<DnDProvider>
			<DnDFlow />
		</DnDProvider>
	</ReactFlowProvider>
);

export default App;
