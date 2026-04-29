import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import type { MenuPosition } from './Menus';
import type { SusiNode } from '../../NodeDataStructures/SusiNode';
import { useReactFlow } from '@xyflow/react';
import createElkGraphLayout from '../ElkLayout';
import { useContext, useEffect, useState } from 'react';
import type { SusiEdge } from '../../NodeDataStructures/SusiEdge';
import { flushSync } from 'react-dom';
import { AppContext } from '../AppContext';

interface PaneContextMenuInput {
	paneContextMenu: MenuPosition | null;
	setPaneContextMenu: (NodeContextMenuData: MenuPosition | null) => void;
	nodes: SusiNode[];
	setNodes: (nodes: SusiNode[]) => void;
	edges: SusiEdge[];
}

const PaneContextMenu = ({ paneContextMenu, setPaneContextMenu, nodes, setNodes, edges }: PaneContextMenuInput) => {
	const { fitView } = useReactFlow();
	const [layoutCalculated, setLayoutCalculated] = useState(true);
	const setLoadingMessage = useContext(AppContext)!.setLoadingMessage;

	const handleLayoutReset = () => {
		setPaneContextMenu(null);
		setLayoutCalculated(false);
		setLoadingMessage('Resetting Layout...');
		setPaneContextMenu(null);
	};

	useEffect(() => {
		if (layoutCalculated) return;
		createElkGraphLayout(nodes, edges)
			.then((layoutedNodes: Array<SusiNode>) => {
				flushSync(() => setNodes(layoutedNodes));
				fitView();
				setLayoutCalculated(true);
				setLoadingMessage(null);
			})
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
						<Button className="contextMenu" variant="outline-success" onClick={handleLayoutReset}>
							<i className="bi bi-arrow-clockwise"></i> Reset Layout
						</Button>
					</ButtonGroup>
				}
			</div>
		</>
	);
};

export default PaneContextMenu;
