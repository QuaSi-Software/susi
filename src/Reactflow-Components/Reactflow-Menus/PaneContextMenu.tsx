import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import type { MenuPosition } from './Menus';
import type { NodeWithSusiData } from '../../NodeDataStructures/NodeWithSusiData';
import { useReactFlow, type Edge } from '@xyflow/react';
import createElkGraphLayout from '../ElkLayout';
import { useEffect, useState } from 'react';

interface PaneContextMenuInput {
	paneContextMenu: MenuPosition | null;
	setPaneContextMenu: (NodeContextMenuData: MenuPosition | null) => void;
	nodes: NodeWithSusiData[];
	setNodes: (nodes: NodeWithSusiData[]) => void;
	edges: Edge[];
	setEdges: (edges: Edge[]) => void;
}

const PaneContextMenu = ({
	paneContextMenu,
	setPaneContextMenu,
	nodes,
	setNodes,
	edges,
	setEdges,
}: PaneContextMenuInput) => {
	const { fitView } = useReactFlow();
	const [layoutCalculated, setLayoutCalculated] = useState(true);

	const handleLayoutReset = () => {
		setPaneContextMenu(null);
		setLayoutCalculated(false);
		setPaneContextMenu(null);
	};

	useEffect(() => {
		if (layoutCalculated) return;
		createElkGraphLayout(nodes, edges)
			.then(
				({
					layoutedNodes,
					layoutedEdges,
				}: {
					layoutedNodes: Array<NodeWithSusiData>;
					layoutedEdges: Array<Edge>;
				}) => {
					setNodes(layoutedNodes);
					setEdges(layoutedEdges);
					fitView();
					setLayoutCalculated(true);
				}
			)
			.catch((err: Error) => console.log(err));
	}, [layoutCalculated]);

	if (!paneContextMenu) return <></>;
	return (
		<>
			<div
				style={{
					position: 'absolute',
					top: paneContextMenu.top,
					left: paneContextMenu.left,
					right: paneContextMenu.right,
					bottom: paneContextMenu.bottom,
					backgroundColor: 'white',
					borderRadius: '8px',
					zIndex: 10,
				}}
			>
				{
					<ButtonGroup vertical>
						<Button variant="outline-success" onClick={handleLayoutReset}>
							<i className="bi bi-arrow-clockwise"></i> Reset Layout
						</Button>
					</ButtonGroup>
				}
			</div>
		</>
	);
};

export default PaneContextMenu;
