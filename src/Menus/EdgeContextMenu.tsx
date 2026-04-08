import { type FC } from 'react';
import { type Edge } from '@xyflow/react';
import Button from 'react-bootstrap/esm/Button';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';

interface EdgeContextMenuData {
	// xPosition: number;
	// yPosition: number;
	edge: Edge;
	top: number;
	left: number;
	right: number;
	bottom: number;
}
// const

const EdgeContextMenu: FC<{
	// nodes: Node[];
	// setNodes: (nodes: Node[]) => void;
	edgeContextMenuData: EdgeContextMenuData | null;
	edges: Edge[];
	setEdges: (edges: Edge[]) => void;
	setEdgeContextMenu: (edge: EdgeContextMenuData | null) => void;
}> = ({
	// nodes,
	// setNodes,
	edgeContextMenuData,
	edges,
	setEdges,
	setEdgeContextMenu,
}) => {
	// const [edges, setEdges] = useEdgesState([] as any);

	const handleDeleteEdge = () => {
		if (!edgeContextMenuData) return;
		const updatedEdges = edges.filter((edge) => edge.id !== edgeContextMenuData.edge.id);
		setEdges(updatedEdges);
		setEdgeContextMenu(null);
	};

	if (edgeContextMenuData == null) return <></>;
	console.log('Showing edge menu at ' + JSON.stringify(edgeContextMenuData));
	return (
		<>
			<div
				style={{
					position: 'absolute',
					top: edgeContextMenuData.top,
					left: edgeContextMenuData.left,
					right: edgeContextMenuData.right,
					bottom: edgeContextMenuData.bottom,
					backgroundColor: 'white',
					borderRadius: '8px',
					zIndex: 10,
				}}
			>
				{
					<ButtonGroup vertical>
						<Button variant={'outline-danger'} onClick={handleDeleteEdge}>
							<i className="bi bi-trash3"></i> Delete Edge
						</Button>
					</ButtonGroup>
				}
			</div>
		</>
	);
};

export { EdgeContextMenu, type EdgeContextMenuData };
