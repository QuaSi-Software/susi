import type { SusiNode } from '../../../NodeDataStructures/SusiNode';

/**
 * Create a dictionary that for each node has a list for the source handles and target handles
 * if the value of takenHandles[nodeName].source[i] is True,
 * then the ith source handle on node nodeName is taken
 * @param nodes {SusiNode[]}
 */
export function initializeTakenHandles(nodes: SusiNode[]) {
	const takenHandles: Record<string, Record<string, boolean[]>> = {};
	nodes.forEach((node) => {
		takenHandles[node.id] = {
			source: Array(node.data.sourceHandles).fill(false),
			target: Array(node.data.targetHandles).fill(false),
		};
	});
	return takenHandles;
}

export function findTargetHandle(
	sourceNode: SusiNode,
	sourceHandleIndex: number,
	targetNode: SusiNode,
	takenHandles: Record<string, Record<string, boolean[]>>,
	logError: (errorMessage: string) => void
) {
	/** If target is a bus, all edges connect to handle 0 */
	if (targetNode.data.busData) return 0;
	/** Find the medium of the source node's handle */
	const mediumVarName = sourceNode.data.handleMediumDict.source[sourceHandleIndex];
	const mediumNodeInput = sourceNode.data.nodeInputs.find((input) => input.resieName === mediumVarName);
	const sourceMediumKey = mediumNodeInput!.value;

	/** find target handle on targetNode with same medium that is not taken */
	const targetHandleMediumVarNames = targetNode.data.handleMediumDict.target;
	for (let handleIndex = 0; handleIndex < targetHandleMediumVarNames.length; handleIndex++) {
		/** Does the medium match? */
		const varName = targetHandleMediumVarNames[handleIndex];
		const handleMediumKey = targetNode.data.nodeInputs.find((input) => input.resieName === varName)!.value;
		if (sourceMediumKey !== handleMediumKey) continue;
		/** If the handle isn't taken */
		if (!takenHandles[targetNode.id].target[handleIndex]) {
			/** update takenHandles and return the handleIndex */
			takenHandles[targetNode.id].target[handleIndex] = true;
			return handleIndex;
		}
	}
	/** If nothing has been returned, then no connection is possible */
	logError(
		`The connection between ${sourceNode.data.content} and ${targetNode.data.content} couldn't be made, because there wasn't a free handle of the correct medium on ${targetNode.data.content}`
	);
	return -1;
}
