import Button from 'react-bootstrap/esm/Button';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import type { MenuPosition } from './Menus';
import { updateBusDataOnEdgeDelete } from '../BusDataWidget/BusDataUtils';
import type { SusiNode } from '../../NodeDataStructures/SusiNode';
import type { SusiEdge } from '../../NodeDataStructures/SusiEdge';
import type { Dispatch, SetStateAction } from 'react';

interface EdgeContextMenuData {
	edge: SusiEdge;
	menuPosition: MenuPosition;
}
interface EdgeContextMenuInput {
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	setEdges: Dispatch<SetStateAction<SusiEdge[]>>;
	edgeContextMenuData: EdgeContextMenuData | null;
	setEdgeContextMenu: Dispatch<SetStateAction<EdgeContextMenuData | null>>;
}

const EdgeContextMenu = ({ setNodes, edgeContextMenuData, setEdges, setEdgeContextMenu }: EdgeContextMenuInput) => {
	const handleDeleteEdge = () => {
		if (!edgeContextMenuData) return;
		/** update bus data of connected nodes */
		setNodes((nodes) => {
			updateBusDataOnEdgeDelete(nodes, edgeContextMenuData.edge);
			return nodes;
		});
		/** update edge list */
		setEdges((edges) => edges.filter((edge) => edge.id !== edgeContextMenuData.edge.id));
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
						<Button className="contextMenu" variant={'outline-danger'} onClick={handleDeleteEdge}>
							<i className="bi bi-trash3"></i> Delete Edge
						</Button>
					</ButtonGroup>
				}
			</div>
		</>
	);
};

export { EdgeContextMenu, type EdgeContextMenuData };
