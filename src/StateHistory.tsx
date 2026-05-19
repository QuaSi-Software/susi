import { useContext, useEffect, useState } from 'react';
import type { SusiEdge } from './NodeDataStructures/Edges/SusiEdge';
import { type SusiNode } from './NodeDataStructures/Nodes/SusiNode';
import * as jsondiffpatch from 'jsondiffpatch';
import { AppContext } from './AppContext';

interface SusiState {
	nodes: SusiNode[];
	edges: SusiEdge[];
}

export function UndoButton({ nodes, edges, checkState }: SusiState & { checkState: boolean }) {
	const [stateHistory, setStateHistory] = useState<Object[]>([]);
	const [prevState, setPrevState] = useState<SusiState>({ nodes: [], edges: [] });
	const setCheckState = useContext(AppContext)!.setCheckState;

	useEffect(() => {
		if (!checkState) return;
		const newState: SusiState = {
			nodes,
			edges,
		};
		const patcher = jsondiffpatch.create();
		const delta = patcher.diff(prevState, newState);
		if (delta === undefined) return;
		console.log(`Delta: ${JSON.stringify(delta)}`);
		stateHistory.push(delta);
		setStateHistory(stateHistory);
		setPrevState(newState);
		setCheckState(false);
	}, [nodes, edges, checkState]);

	return <></>;
}
