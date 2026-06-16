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
import type { MenuInputs } from './FetchingApiData/MenuInputs';

const initialNodes: SusiNode[] = [];

const DnDFlow = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState<SusiNode>(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState<SusiEdge>([] as any);
	const { screenToFlowPosition } = useReactFlow();
	const [type] = useDnD();
	const ref = useRef<HTMLInputElement>(null);

	/** Context Menus */
	const [edgeContextMenu, setEdgeContextMenu] = useState<EdgeContextMenuData | null>(null);
	const [nodeContextMenu, setNodeContextMenu] = useState<NodeContextMenuData | null>(null);
	const [paneContextMenu, setPaneContextMenu] = useState<MenuPosition | null>(null);

	/**  */
	const [mediums, setMediums] = useState<Medium[]>(getDefaultMediums());
	const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([]);
	const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
	const [overlayErrorMessage, setOverlayErrorMessage] = useState<string | null>(null);
	const [nodeNamePrefix, setNodeNamePrefix] = useState<string>('');
	const [checkState, setCheckState] = useState<boolean>(false);
	const [theme, setTheme] = useState<'dark' | 'light'>('light');
	const [locale, setLocale] = useState<Locale>(Locale.US);

	/** Component Inputs */
	const [componentTypes, setComponentTypes] = useState<Record<string, NodeType> | null>(null);
	const [componentCategories, setComponentCategories] = useState<ApiCategory[]>([]);
	const [ioSettingsList, setIOSettingsList] = useState<MenuInputs>({ inputs: [], categories: [] });
	const [simulationParametersList, setSimulationParametersList] = useState<MenuInputs>({
		inputs: [],
		categories: [],
	});

	document.documentElement.setAttribute('data-theme', theme);

	fetchComponentInputs(
		setLoadingMessage,
		mediums,
		componentTypes,
		setComponentTypes,
		setComponentCategories,
		setIOSettingsList,
		setSimulationParametersList,
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

	// Update CSS variables whenever mediums change
	useEffect(() => {
		setMediumCSSVariables(mediums);
	}, [mediums]);

	const onConnect = useCallback(
		(connection: Connection): void => {
			const edge: SusiEdge | null = getNewEdge(connection, nodes, edges, mediums, logError);
			if (edge === null) return;
			setEdges((eds: any[]) => addEdge(edge, eds) as any[]);
			setCheckState(true);
		},
		[setEdges, nodes, edges, mediums]
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

		let newEdgeContextMenuData: EdgeContextMenuData = {
			edge: edge,
			menuPosition: createMenuPosition(event, ref),
		};
		setEdgeContextMenu(newEdgeContextMenuData);
	};
	const onNodeContextMenu = (event: React.MouseEvent, node: SusiNode): void => {
		event.preventDefault();
		setPaneContextMenu(null);
		setEdgeContextMenu(null);

		let newNodeContextMenuData: NodeContextMenuData = {
			node: node,
			menuPosition: createMenuPosition(event, ref),
		};
		setNodeContextMenu(newNodeContextMenuData);
	};
	const onPaneContextMenu = (event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
		event.preventDefault();
		setNodeContextMenu(null);
		setEdgeContextMenu(null);

		let newPaneContextMenuData: MenuPosition = createMenuPosition(event, ref);
		setPaneContextMenu(newPaneContextMenuData);
	};
	const clearAllMenus = () => {
		setNodeContextMenu(null);
		setEdgeContextMenu(null);
		setPaneContextMenu(null);
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
					// setOverlayError: setOverlayErrorMessage,
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
					ioSettings={ioSettingsList}
					setIOSettings={setIOSettingsList}
					simulationParameters={simulationParametersList}
					setSimulationParameters={setSimulationParametersList}
					theme={theme}
					setTheme={setTheme}
					setLocale={setLocale}
					nodeTypes={componentTypes}
					categories={componentCategories}
				/>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onDrop={onDrop}
					onDragStart={onDragStart}
					onDragOver={onDragOver}
					onNodeDragStop={() => {
						setCheckState(true);
					}}
					fitView
					nodeOrigin={[0.5, 0.5]}
					nodeTypes={{ default: MarkdownNode }}
					colorMode={theme}
					ref={ref}
					onEdgeContextMenu={onEdgeContextMenu}
					onNodeContextMenu={onNodeContextMenu}
					onPaneContextMenu={onPaneContextMenu}
					onPaneClick={clearAllMenus}
				>
					<Controls showInteractive={false} />
					<Background />
					<UndoButton
						nodes={nodes}
						edges={edges}
						checkState={checkState}
						setNodes={setNodes}
						setEdges={setEdges}
					/>
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
				/>
				<PaneContextMenu
					paneContextMenu={paneContextMenu}
					setPaneContextMenu={setPaneContextMenu}
					nodes={nodes}
					setNodes={setNodes}
					edges={edges}
				/>{' '}
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
