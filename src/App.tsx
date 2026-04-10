import { useCallback, useRef, useState } from 'react';
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

import '@xyflow/react/dist/style.css';
import './CSS/bootstrap.min.css';
import './CSS/node-styling.css';

import Sidebar from './Sidebar/Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
import createNodeFromType, { type NodeWithSusiData } from './NodeDataStructures/NodeWithSusiData';
import MarkdownNode from './Reactflow-Components/MarkdownNode';
import type { Edge } from '@xyflow/react';
import { EdgeContextMenu, type EdgeContextMenuData } from './Reactflow-Components/Reactflow-Menus/EdgeContextMenu';
import { createMenuPosition } from './Reactflow-Components/Reactflow-Menus/Menus';
import { NodeContextMenu, type NodeContextMenuData } from './Reactflow-Components/Reactflow-Menus/NodeContextMenu';

const initialNodes: NodeWithSusiData[] = [];

const DnDFlow = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState<NodeWithSusiData>(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState([] as any);
	const { screenToFlowPosition } = useReactFlow();
	const [type] = useDnD();
	const ref = useRef<HTMLInputElement>(null);

	const [edgeContextMenu, setEdgeContextMenu] = useState<EdgeContextMenuData | null>(null);
	const [nodeContextMenu, setNodeContextMenu] = useState<NodeContextMenuData | null>(null);

	const onConnect = useCallback(
		(params: any): void => {
			setEdges((eds: any[]) => addEdge(params, eds) as any[]);
		},
		[setEdges]
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
			const newNode = createNodeFromType(nodes, type, position);

			setNodes((nds) => nds.concat(newNode));
		},
		[screenToFlowPosition, type, setNodes, nodes]
	);

	const onDragStart = (event: ReactDragEvent<HTMLDivElement>) => {
		if (type) {
			event.dataTransfer.setData('text/plain', type.button_name as string);
			event.dataTransfer.effectAllowed = 'move';
		}
	};

	const onEdgeContextMenu = (event: React.MouseEvent, edge: Edge): void => {
		event.preventDefault();

		let newEdgeContextMenuData: EdgeContextMenuData = {
			edge: edge,
			menuPosition: createMenuPosition(event, ref),
		};
		setEdgeContextMenu(newEdgeContextMenuData);
	};
	const onNodeContextMenu = (event: React.MouseEvent, node: NodeWithSusiData): void => {
		event.preventDefault();

		let newNodeContextMenuData: NodeContextMenuData = {
			node: node,
			menuPosition: createMenuPosition(event, ref),
		};
		setNodeContextMenu(newNodeContextMenuData);
	};

	return (
		<div className="dndflow">
			<Sidebar />
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onDrop={onDrop}
				onDragStart={onDragStart}
				onDragOver={onDragOver}
				fitView
				nodeOrigin={[0.5, 0.5]}
				nodeTypes={{ default: MarkdownNode }}
				colorMode="system"
				ref={ref}
				onEdgeContextMenu={onEdgeContextMenu}
				onNodeContextMenu={onNodeContextMenu}
			>
				<Controls />
				<Background />
			</ReactFlow>
			<EdgeContextMenu
				edgeContextMenuData={edgeContextMenu}
				setEdges={setEdges}
				edges={edges}
				setEdgeContextMenu={setEdgeContextMenu}
			/>
			<NodeContextMenu
				nodeContextMenu={nodeContextMenu}
				nodes={nodes}
				edges={edges}
				setNodeContextMenu={setNodeContextMenu}
				setNodes={setNodes}
				setEdges={setEdges}
			/>
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
