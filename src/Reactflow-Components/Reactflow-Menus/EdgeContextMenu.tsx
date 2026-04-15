import { type Edge } from '@xyflow/react';
import Button from 'react-bootstrap/esm/Button';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import type { MenuPosition } from './Menus';
import { updateBusDataOnEdgeDelete } from '../BusDataWidget/BusDataUtils';
import type { NodeWithSusiData } from '../../NodeDataStructures/NodeWithSusiData';

interface EdgeContextMenuData {
	edge: Edge;
	menuPosition: MenuPosition;
}
interface EdgeContextMenuInput {
	nodes: NodeWithSusiData[];
	setNodes: (nodes: NodeWithSusiData[]) => void;
	edgeContextMenuData: EdgeContextMenuData | null;
	edges: Edge[];
	setEdges: (edges: Edge[]) => void;
	setEdgeContextMenu: (edgeContextMenuData: EdgeContextMenuData | null) => void;
}

const EdgeContextMenu = ({
	nodes,
	setNodes,
	edgeContextMenuData,
	edges,
	setEdges,
	setEdgeContextMenu,
}: EdgeContextMenuInput) => {
	const handleDeleteEdge = () => {
		if (!edgeContextMenuData) return;
		/** update bus data of connected nodes */
		const updatedNodes: NodeWithSusiData[] = Object.assign([], nodes);
		updateBusDataOnEdgeDelete(updatedNodes, edgeContextMenuData.edge);
		setNodes(updatedNodes);
		/** update edge list */
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
					top: edgeContextMenuData.menuPosition.top,
					left: edgeContextMenuData.menuPosition.left,
					right: edgeContextMenuData.menuPosition.right,
					bottom: edgeContextMenuData.menuPosition.bottom,
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
