import { useCallback, useRef, useState, useEffect } from 'react';
import type { FC } from 'react';
import {
	ReactFlow,
	ReactFlowProvider,
	addEdge,
	useNodesState,
	useEdgesState,
	Controls,
	Background,
} from '@xyflow/react';

import './CSS/index.css';

/** Nodes */
import { DnDProvider, useDnD } from './Sidebar/DnDContext';
import { deepCloneNodes, type SusiNode } from './NodeDataStructures/Nodes/SusiNode';
import MarkdownNode from './NodeDataStructures/Nodes/MarkdownNode';
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
import { fetchData } from './FetchingApiData/fetchData';
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
import { InputObject } from './Reactflow-Components/CustomInputWidgets/InputObject';
import { useDraghandlers } from './useDraghandlers';

const DnDFlow = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState<SusiNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<SusiEdge>([]);

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
	const [controlParameters, setControlParameters] = useState<ResieParameterMenuInfo | null>(null);
	const [controlModules, setControlModules] = useState<Record<string, InputObject[]>>({});

	document.documentElement.setAttribute('data-theme', theme);

	/** if component types is not set, fetch the api data to set it as well as the other api data */
	useEffect(() => {
		if (componentTypes !== null) {
			return;
		}
		fetchData({
			setLoadingMessage,
			mediums,
			componentTypes,
			setComponentTypes,
			setComponentCategories,
			setResieParameterMenus,
			setOverlayError: setOverlayErrorMessage,
			setControlParameters,
			setControlModules,
		});
	}, [componentTypes]);

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

	const { onDrop, onDragOver, onNodeDragStop, onDragStart } = useDraghandlers({
		nodes,
		setNodes,
		setCheckState,
		type,
		nodeNamePrefix,
	});

	return (
		<div className="dndflow">
			<AppContext.Provider
				value={{
					mediums: mediums,
					setMediums: setMediums,
					setErrorMessages: setErrorMessages,
					setLoadingMessage: setLoadingMessage,
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
