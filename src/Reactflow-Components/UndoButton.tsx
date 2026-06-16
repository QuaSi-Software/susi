import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { SusiEdge } from '../NodeDataStructures/Edges/SusiEdge';
import { type SusiNode } from '../NodeDataStructures/Nodes/SusiNode';
import * as jsondiffpatch from 'jsondiffpatch';
import { AppContext } from '../AppContext';
import { Button } from 'react-bootstrap';
import _ from 'lodash';

type Delta = jsondiffpatch.Delta;
interface SusiState {
	nodes: SusiNode[];
	edges: SusiEdge[];
}
interface UndoButtonProps {
	nodes: SusiNode[];
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	edges: SusiEdge[];
	setEdges: Dispatch<SetStateAction<SusiEdge[]>>;
	checkState: boolean;
}

export function UndoButton({ nodes, setNodes, edges, setEdges, checkState }: UndoButtonProps) {
	const [stateHistory, setStateHistory] = useState<Delta[]>([]);
	const [currentState, setCurrentState] = useState<SusiState>({ nodes: [], edges: [] });
	const setCheckState = useContext(AppContext)!.setCheckState;

	useEffect(() => {
		if (!checkState) return;
		const newState: SusiState = {
			nodes,
			edges,
		};
		const delta: Delta = jsondiffpatch.diff(currentState, newState);
		if (delta === undefined) return;
		stateHistory.push(delta);
		setStateHistory(stateHistory);
		setCurrentState(newState);
		setCheckState(false);
	}, [nodes, edges, checkState]);

	function undoAction() {
		const delta = stateHistory.pop();
		if (delta === undefined) return;
		const prevState = _.cloneDeep(currentState);
		jsondiffpatch.unpatch(prevState, delta);
		setNodes(prevState.nodes);
		setEdges(prevState.edges);
		setStateHistory(stateHistory);
		setCurrentState(prevState);
	}

	return (
		<>
			<Button variant="outline-primary" onClick={undoAction} disabled={stateHistory.length === 0}>
				<i className="bi bi-arrow-clockwise"></i> Undo
			</Button>
		</>
	);
}
