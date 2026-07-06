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
import { setMediumCSSVariables } from './Sidebar/Mediums/MediumCSSUtils';

import Sidebar from './Sidebar/Sidebar';
import { DnDProvider, useDnD } from './Sidebar/DnDContext';
import createNodeFromType, { type SusiNode } from './NodeDataStructures/Nodes/SusiNode';
import MarkdownNode from './NodeDataStructures/Nodes/MarkdownNode';
import type { Connection } from '@xyflow/react';
import { EdgeContextMenu, type EdgeContextMenuData } from './Reactflow-Components/Reactflow-Menus/EdgeContextMenu';
import { createMenuPosition, type MenuPosition } from './Reactflow-Components/Reactflow-Menus/Menus';
import { NodeContextMenu, type NodeContextMenuData } from './Reactflow-Components/Reactflow-Menus/NodeContextMenu';
import PaneContextMenu from './Reactflow-Components/Reactflow-Menus/PaneContextMenu';
import { type Medium } from './NodeDataStructures/Mediums/Medium';
import { getDefaultMediums } from './NodeDataStructures/Mediums/MediumUtils';
import { AppContext } from './AppContext';
import ErrorMenu from './Reactflow-Components/Errors/ErrorMenu';
import type { ErrorMessage } from './Reactflow-Components/Errors/ErrorMessage';
import type { SusiEdge } from './NodeDataStructures/Edges/SusiEdge';
import LoadingOverlay from './Reactflow-Components/LoadingOverlay';
import { getNewEdge } from './NodeDataStructures/Edges/CreateEdge';
import { fetchComponentInputs, getNodeInputsFromAPI } from './FetchingApiData/HandleAPICalls';
import { UndoButton } from './Reactflow-Components/UndoButton';
import { Locale } from './Sidebar/SettingsMenu';
import ErrorOverlay from './Reactflow-Components/ErrorScreenOverlay';
import type { NodeType } from './NodeDataStructures/Nodes/SusiNodeTypes';
import { type ApiCategory } from './FetchingApiData/ApiData';
import type { ResieParameterMenuInfo } from './Sidebar/ResieParameters/ResieParameterMenuInfo';
import { ClearNodesButton } from './Reactflow-Components/ClearNodesButton';
import {
	SelectionContextMenu,
	type SelectionContextMenuData,
} from './Reactflow-Components/Reactflow-Menus/SelectionContextMenu';
import logo from './assets/resie.svg';
import GroupNodeComponent from './Reactflow-Components/GroupNodeComponent';

const DnDFlow = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState<SusiNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<SusiEdge>([] as any);
	const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();
	const [type] = useDnD();
	const ref = useRef<HTMLInputElement>(null);

	/** Context Menus */
	const [edgeContextMenu, setEdgeContextMenu] = useState<EdgeContextMenuData | null>(null);
	const [nodeContextMenu, setNodeContextMenu] = useState<NodeContextMenuData | null>(null);
	const [paneContextMenu, setPaneContextMenu] = useState<MenuPosition | null>(null);
	const [selectionContextMenu, setSelectionContextMenu] = useState<SelectionContextMenuData | null>(null);

	/**  */
	const [mediums, setMediums] = useState<Medium[]>(getDefaultMediums());
	const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([]);
	const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
	const [overlayErrorMessage, setOverlayErrorMessage] = useState<string | null>(null);
	const [nodeNamePrefix, setNodeNamePrefix] = useState<string>('');
	const [checkState, setCheckState] = useState<boolean>(false);
	const [theme, setTheme] = useState<'dark' | 'light'>('light');
	const [locale, setLocale] = useState<Locale>(Locale.US);

	/** Data imported from API */
	const [componentTypes, setComponentTypes] = useState<Record<string, NodeType> | null>(null);
	const [componentCategories, setComponentCategories] = useState<ApiCategory[]>([]);
	const [resieParameterMenus, setResieParameterMenus] = useState<ResieParameterMenuInfo[]>([]);

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
	const getSusiNodes = useCallback((): SusiNode[] => {
		return nodes.filter((n) => 'nodeInputs' in n.data);
	}, [nodes]);
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
			const edge: SusiEdge | null = getNewEdge(connection, getSusiNodes(), edges, mediums, logError);
			if (edge === null) return;
			setEdges((eds: any[]) => addEdge(edge, eds) as any[]);
			setCheckState(true);
		},
		[setEdges, nodes, edges, mediums]
	);
	const onNodeDrag = useCallback(
		(_event: React.MouseEvent, _node: SusiNode) => {
			const intersections = getIntersectingNodes(_node, false) as SusiNode[];
			const parentNode = intersections.find((n: SusiNode) => n.id !== _node.id && n.type === 'group');
			const parentId = parentNode ? parentNode?.id : undefined;
			if (parentNode) console.log(`Node ${_node.data.content} found parent node ${parentNode.data.content}`);
			if (_node.parentId !== parentId) {
				setNodes((_nodes) =>
					_nodes.map((n: SusiNode) => (n.id === _node.id ? { ..._node, parentId: parentId } : n))
				);
			}
		},
		[setNodes]
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
		console.log(`Selected nodes: ${selectedNodes.map((node) => node.data.content)}`);
	};
	const clearAllMenus = () => {
		setNodeContextMenu(null);
		setEdgeContextMenu(null);
		setPaneContextMenu(null);
		setSelectionContextMenu(null);
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
				/>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onDrop={onDrop}
					onNodeDrag={onNodeDrag}
					onDragStart={onDragStart}
					onDragOver={onDragOver}
					onNodeDragStop={() => {
						setCheckState(true);
					}}
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
					multiSelectionKeyCode="Shift"
					proOptions={{ hideAttribution: true }}
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
					setNodeContextMenu={setNodeContextMenu}
					setNodes={setNodes}
					setEdges={setEdges}
					getResieParameter={getResieParameter}
				/>
				<SelectionContextMenu
					selectionContextMenu={selectionContextMenu}
					nodes={nodes}
					edges={edges}
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
