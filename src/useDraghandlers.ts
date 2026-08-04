import { useCallback, type Dispatch, type DragEvent, type SetStateAction } from 'react';
import type { SusiNode } from './NodeDataStructures/Nodes/SusiNode';
import { getIntersectionsWithGroupNode } from './NodeDataStructures/GroupNodes/IntersectionWithGroupNode';
import { getPositionAfterParentChange } from './NodeDataStructures/GroupNodes/CalculateChildNodePosition';
import { useReactFlow } from '@xyflow/react';
import createNodeFromType from './NodeDataStructures/Nodes/SusiNode';
import type { NodeType } from './NodeDataStructures/Nodes/SusiNodeTypes';
import type { ResieParameterMenuInfo } from './Sidebar/ResieParameters/ResieParameterMenuInfo';

interface useDraghandlersProps {
	nodes: SusiNode[];
	controlParameters: ResieParameterMenuInfo | null;
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	setCheckState: Dispatch<SetStateAction<boolean>>;
	type: NodeType | null;
	nodeNamePrefix: string;
}

export function useDraghandlers({
	nodes,
	setNodes,
	setCheckState,
	type,
	nodeNamePrefix,
	controlParameters,
}: useDraghandlersProps) {
	const { screenToFlowPosition } = useReactFlow();

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

	const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onDrop = useCallback(
		(event: DragEvent<HTMLDivElement>) => {
			event.preventDefault();

			// check if the dropped element is valid
			if (!type || !controlParameters) {
				return;
			}

			// project was renamed to screenToFlowPosition
			// and you don't need to subtract the reactFlowBounds.left/top anymore
			// details: https://reactflow.dev/whats-new/2023-11-10
			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});
			const newNode = createNodeFromType(nodes, type, position, nodeNamePrefix, controlParameters);
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
	const onDragStart = (event: DragEvent<HTMLDivElement>) => {
		if (type) {
			event.dataTransfer.setData('text/plain', type.button_name as string);
			event.dataTransfer.effectAllowed = 'move';
		}
	};

	return {
		onDrop,
		onDragOver,
		onNodeDragStop,
		onDragStart,
	};
}
