import { useRef, useCallback } from 'react';
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

import Sidebar from './Sidebar/Sidebar';
import { DnDProvider, useDnD } from './DnDContext';

const initialNodes = [
	{
		id: '1',
		type: 'input',
		data: { label: 'input node' },
		position: { x: 250, y: 5 },
	},
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState([] as any);
	const { screenToFlowPosition } = useReactFlow();
	const [type] = useDnD();

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
			const newNode = {
				id: getId(),
				type: type!,
				position,
				data: { label: `${type} node` },
			};

			setNodes((nds) => nds.concat(newNode));
		},
		[screenToFlowPosition, type, setNodes]
	);

	const onDragStart = (event: ReactDragEvent<HTMLDivElement>) => {
		if (type) {
			event.dataTransfer.setData('text/plain', type as string);
			event.dataTransfer.effectAllowed = 'move';
		}
	};

	return (
		<div className="dndflow">
			<Sidebar />
			<div className="reactflow-wrapper" ref={reactFlowWrapper}>
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
				>
					<Controls />
					<Background />
				</ReactFlow>
			</div>
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

