import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import type { MenuPosition } from './Menus';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import { useReactFlow } from '@xyflow/react';
import createElkGraphLayout from './ElkLayout';
import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import { flushSync } from 'react-dom';
import { AppContext } from '../../AppContext';
import { createGroupNode } from '../../NodeDataStructures/GroupNodes/GroupNode';
import { checkForDuplicateNodeNames } from './ContextMenuUtils';

interface PaneContextMenuInput {
	paneContextMenu: MenuPosition | null;
	setPaneContextMenu: (NodeContextMenuData: MenuPosition | null) => void;
	nodes: SusiNode[];
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	edges: SusiEdge[];
}

const PaneContextMenu = ({ paneContextMenu, setPaneContextMenu, nodes, setNodes, edges }: PaneContextMenuInput) => {
	const { fitView, screenToFlowPosition } = useReactFlow();
	const [layoutCalculated, setLayoutCalculated] = useState(true);
	const setLoadingMessage = useContext(AppContext)!.setLoadingMessage;
	const setCheckState = useContext(AppContext)!.setCheckState;

	const nodeWithIssues = nodes.find((n) => !n.data.hasValidInputs || !n.data.hasValidName);

	const handleLayoutReset = () => {
		setPaneContextMenu(null);
		setLayoutCalculated(false);
		setLoadingMessage('Resetting Layout...');
	};

	function instantiateGroupNode() {
		if (!paneContextMenu) return;
		const pos = screenToFlowPosition({
			x: paneContextMenu!.left,
			y: paneContextMenu!.top,
		});
		const groupNode: SusiNode = createGroupNode(pos);
		setNodes((_nodes) => [groupNode].concat(_nodes)); // group nodes must be at the start of the array
		checkForDuplicateNodeNames(setNodes);
		setCheckState(true);
		setPaneContextMenu(null);
	}

	useEffect(() => {
		if (layoutCalculated) return;
		createElkGraphLayout(nodes, edges)
			.then((layoutedNodes: Array<SusiNode>) => {
				flushSync(() => setNodes(layoutedNodes));
				fitView();
				setLayoutCalculated(true);
				setLoadingMessage(null);
				setCheckState(true);
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
						<Button className="contextMenu" variant="outline-primary" onClick={instantiateGroupNode}>
							<i className="bi bi-collection"></i> Create Component Group
						</Button>
						<Button
							className="contextMenu"
							variant="outline-primary"
							onClick={() => {
								setPaneContextMenu(null);
								fitView({ nodes: [nodeWithIssues!] });
							}}
							disabled={nodeWithIssues === undefined}
						>
							<i className="bi bi-search"></i> Find Issue
						</Button>
					</ButtonGroup>
				}
			</div>
		</>
	);
};

export default PaneContextMenu;
