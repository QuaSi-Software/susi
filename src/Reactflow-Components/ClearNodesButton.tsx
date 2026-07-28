import { useContext, type Dispatch, type SetStateAction } from 'react';
import type { SusiNode } from '../NodeDataStructures/Nodes/SusiNode';
import type { SusiEdge } from '../NodeDataStructures/Edges/SusiEdge';
import { Button } from 'react-bootstrap';
import { AppContext } from '../AppContext';

interface ClearNodesButtonProps {
	nodes: SusiNode[];
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	setEdges: Dispatch<SetStateAction<SusiEdge[]>>;
}

export function ClearNodesButton({ nodes, setNodes, setEdges }: ClearNodesButtonProps) {
	const context = useContext(AppContext);
	function clearNodes() {
		setEdges([]);
		setNodes([]);
		context?.setCheckState(true);
	}
	return (
		<>
			<Button
				variant="outline-danger"
				onClick={clearNodes}
				disabled={nodes.length === 0}
				className="delete-all-components-button"
			>
				<i className="bi bi-trash3"></i> Delete All Components
			</Button>
		</>
	);
}
