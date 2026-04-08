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
import createNodeFromType, { type NodeWithSusiData } from './Nodes/CreateNode';
import MarkdownNode from './Nodes/MarkdownNode';
import type { Edge } from '@xyflow/react';
import { EdgeContextMenu, type EdgeContextMenuData } from './Menus/EdgeContextMenu';

const initialNodes: NodeWithSusiData[] = [];

const DnDFlow = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState<NodeWithSusiData>(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState([] as any);
	const { screenToFlowPosition } = useReactFlow();
	const [type] = useDnD();
	const ref = useRef<HTMLInputElement>(null);

	const [edgeContextMenu, setEdgeContextMenu] = useState<EdgeContextMenuData | null>(null);

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
		const pane = ref.current?.getBoundingClientRect();
		console.assert(pane != undefined);
		if (pane == undefined) return;
		let newEdgeContextMenuData: EdgeContextMenuData = {
			edge: edge,
			top: event.clientY,
			left: event.clientX,
			right: pane.width - event.clientX,
			bottom: pane.height - event.clientY,
		};
		setEdgeContextMenu(newEdgeContextMenuData);
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
