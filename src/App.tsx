import { useCallback, useMemo } from 'react';
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
import './CSS/node-styling.css';

import Sidebar from './Sidebar/Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
import createNodeFromType, { type NodeWithSusiData } from './Nodes/CreateNode';
import { MarkdownInputNode, MarkdownOutputNode, MarkdownDefaultNode } from './Nodes/MarkdownNode';

const initialNodes: NodeWithSusiData[] = [];

const DnDFlow = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState<NodeWithSusiData>(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState([] as any);
	const { screenToFlowPosition } = useReactFlow();
	const [type] = useDnD();

	const nodeTypes = useMemo(
		() => ({
			input: MarkdownInputNode,
			output: MarkdownOutputNode,
			default: MarkdownDefaultNode,
		}),
		[]
	);

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
				nodeTypes={nodeTypes}
				colorMode="system"
			>
				<Controls />
				<Background />
			</ReactFlow>
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
