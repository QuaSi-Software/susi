import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { SusiEdge } from '../NodeDataStructures/Edges/SusiEdge';
import { type SusiNode } from '../NodeDataStructures/Nodes/SusiNode';
import * as jsondiffpatch from 'jsondiffpatch';
import { AppContext } from '../AppContext';
import { Button } from 'react-bootstrap';
import _ from 'lodash';
import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import { getDefaultMediums } from '../NodeDataStructures/Mediums/MediumUtils';
import type { ParameterStudy } from '../Sidebar/ParameterStudyModal/ParameterStudyModal';

type Delta = jsondiffpatch.Delta;
interface SusiState {
	nodes: SusiNode[];
	edges: SusiEdge[];
	mediums: Medium[];
	parameterStudies: ParameterStudy[];
}
interface UndoButtonProps {
	nodes: SusiNode[];
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	edges: SusiEdge[];
	setEdges: Dispatch<SetStateAction<SusiEdge[]>>;
	parameterStudies: ParameterStudy[];
	setParameterStudies: Dispatch<SetStateAction<ParameterStudy[]>>;

	checkState: boolean;
	overwriteState: boolean;
}

/** Note on overwrite State:
 * Since deleting a node can delete a parameter study, you want an undo to
 * also restore the parameter studies. However, since the change is not visible,
 * every change to the parameter studies should not be saved as a new state.
 * That's why overwriteState allows you to simply replace the most recent state
 * with the current reactflow state.
 */

export function UndoButton({
	nodes,
	setNodes,
	edges,
	setEdges,
	parameterStudies,
	setParameterStudies,
	checkState,
	overwriteState,
}: UndoButtonProps) {
	const [stateHistory, setStateHistory] = useState<Delta[]>([]);
	const [currentState, setCurrentState] = useState<SusiState>({
		nodes: [],
		edges: [],
		mediums: getDefaultMediums(),
		parameterStudies: [],
	});
	const context = useContext(AppContext);
	if (!context) return <></>;
	const setCheckState = context.setCheckState;
	const setOverwriteState = context.setOverwriteState;
	const mediums = context.mediums;
	const setMediums = context.setMediums;

	useEffect(() => {
		if (checkState) {
			pushCurrentState();
		} else if (overwriteState) {
			stateHistory.pop();
			pushCurrentState();
		}
	}, [nodes, edges, checkState, mediums, checkState, overwriteState]);

	function pushCurrentState() {
		const newState: SusiState = {
			nodes: _.cloneDeep(nodes),
			edges,
			mediums: _.cloneDeep(mediums),
			parameterStudies: _.cloneDeep(parameterStudies),
		};
		const delta: Delta = jsondiffpatch.diff(currentState, newState);
		if (delta === undefined) return;
		stateHistory.push(delta);
		setStateHistory(stateHistory);
		setCurrentState(newState);
		setCheckState(false);
		setOverwriteState(false);
	}

	function undoAction() {
		const delta = stateHistory.pop();
		if (delta === undefined) return;
		const prevState = _.cloneDeep(currentState);
		jsondiffpatch.unpatch(prevState, delta);
		setNodes(prevState.nodes);
		setEdges(prevState.edges);
		setMediums(_.cloneDeep(prevState.mediums));
		setParameterStudies(prevState.parameterStudies);
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
