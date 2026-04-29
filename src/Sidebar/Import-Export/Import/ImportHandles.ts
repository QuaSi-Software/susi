import type { SusiNode } from '../../../NodeDataStructures/SusiNode';
import type { ComponentData } from '../ExportDataStrucures';

/**
 * Create a dictionary that for each node has a list for the source handles and target handles
 * if the value of takenHandles[nodeName].source[i] is True,
 * then the ith source handle on node nodeName is taken
 * @param nodes {ComponentData[]}
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

/**
 * Using nodes' output_refs, create a dictionary that maps each source node name to a dictionary
 * that maps each target node name to a handle index
 * so sourceHandleDict[sourceNodeName][targetNodeName] = handleIndex
 * means that the edge connecting sourceNode to targetNode should have the source handle index handleIndex
 *
 * Once we've used this information to map the source handles, make the output_refs a string array
 */
export function createSourceHandleDict(nodes: SusiNode[], components: Record<string, ComponentData>) {
	const sourceHandleDict: Record<string, Record<string, number>> = {};
	nodes.forEach((sourceNode) => {
		const componentData: ComponentData = components[sourceNode.data.content];
		sourceHandleDict[sourceNode.data.content] = {};
		/** if it's a bus, all handles are mapped to the 0 handle */
		if (componentData.type.toLowerCase() === 'bus') {
			componentData.connections!.output_order.forEach((targetNodeName) => {
				sourceHandleDict[sourceNode.data.content][targetNodeName] = 0;
			});
			return;
		}
		const outputRefs = componentData.output_refs;
		/** If outputRefs is an array, just map them one after another */
		if (Array.isArray(outputRefs)) {
			for (let handleIndex = 0; handleIndex < outputRefs.length; handleIndex++) {
				const targetNodeName = outputRefs[handleIndex];
				sourceHandleDict[sourceNode.data.content][targetNodeName] = handleIndex;
			}
			return;
		}
		/** If outputRefs is a dictionary, use the medium information to map the handles to the right handle */
		if (typeof outputRefs !== 'object') return;
		for (const [mediumVarName, targetNodeName] of Object.entries(outputRefs)) {
			const handleIndex = sourceNode.data.handleMediumDict.source.findIndex((e) => e === mediumVarName);
			sourceHandleDict[sourceNode.data.content][targetNodeName] = handleIndex;
		}
		componentData.output_refs = Object.values(outputRefs);
	});
	return sourceHandleDict;
}
