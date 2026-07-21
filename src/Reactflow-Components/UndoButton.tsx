import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { SusiEdge } from '../NodeDataStructures/Edges/SusiEdge';
import { type SusiNode } from '../NodeDataStructures/Nodes/SusiNode';
import * as jsondiffpatch from 'jsondiffpatch';
import { AppContext } from '../AppContext';
import { Button } from 'react-bootstrap';
import _ from 'lodash';
import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import { getDefaultMediums } from '../NodeDataStructures/Mediums/MediumUtils';

type Delta = jsondiffpatch.Delta;
interface SusiState {
	nodes: SusiNode[];
	edges: SusiEdge[];
	mediums: Medium[];
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
	const [currentState, setCurrentState] = useState<SusiState>({ nodes: [], edges: [], mediums: getDefaultMediums() });
	const context = useContext(AppContext);
	if (!context) return <></>;
	const setCheckState = context.setCheckState;
	const mediums = context.mediums;
	const setMediums = context.setMediums;

	useEffect(() => {
		if (!checkState) return;
		const newState: SusiState = {
			nodes,
			edges,
			mediums: _.cloneDeep(mediums),
		};
		const delta: Delta = jsondiffpatch.diff(currentState, newState);
		console.debug(`Undo button delta: ${JSON.stringify(delta)}`);
		if (delta === undefined) return;
		stateHistory.push(delta);
		setStateHistory(stateHistory);
		setCurrentState(newState);
		setCheckState(false);
	}, [nodes, edges, checkState, mediums]);

	function undoAction() {
		const delta = stateHistory.pop();
		if (delta === undefined) return;
		const prevState = _.cloneDeep(currentState);
		jsondiffpatch.unpatch(prevState, delta);
		setNodes(prevState.nodes);
		setEdges(prevState.edges);
		setMediums(_.cloneDeep(prevState.mediums));
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
