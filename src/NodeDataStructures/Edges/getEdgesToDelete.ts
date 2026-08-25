import type { SusiNode } from '../Nodes/SusiNode';
import type { SusiEdge } from './SusiEdge';

const HandleType = {
	source: 'source',
	target: 'target',
} as const;
type HandleType = (typeof HandleType)[keyof typeof HandleType];

function getEdgesOnHandle(_edges: SusiEdge[], nodeID: string, handleType: HandleType, handleIndex: number): SusiEdge[] {
	const handleID = handleType + '-' + handleIndex;
	// find edges that connect to this handle on this node
	const edgesOnHandle = _edges.filter((e) => {
		return (
			e[handleType] === nodeID &&
			e[handleType == HandleType.source ? 'sourceHandle' : 'targetHandle'] === handleID
		);
	});
	return edgesOnHandle;
}

/**
 * find all edges, whose medium is controlled by the variable with name var_name on the given node
 * @param {List[Object]} edges a list of all existing edges
 * @param {Object} node the node, whose medium was changed
 * @param {string} mediumVarName the name of the medium variable that was changed
 * @returns {List[string]} a list of all the edge IDs that need to be deleted as a result of the medium change
 */
function getEdgesWithMediumMismatch(edges: SusiEdge[], node: SusiNode, mediumVarName: string): string[] {
	// find all edges connected to this medium variables
	const handleMediumDict = node.data.handleMediumDict;
	const sourceHandleIndex = handleMediumDict[HandleType.source].findIndex((e) => e === mediumVarName);
	const sourceEdgesToDelete = getEdgesOnHandle(edges, node.id, HandleType.source, sourceHandleIndex);
	const targetHandleIndex = handleMediumDict[HandleType.target].findIndex((e) => e === mediumVarName);
	const targetEdgesToDelete = getEdgesOnHandle(edges, node.id, HandleType.target, targetHandleIndex);
	// get just the edge IDs
	const edgeIDs: string[] = sourceEdgesToDelete.concat(targetEdgesToDelete).map((e) => e.id);
	return edgeIDs;
}

export { HandleType, getEdgesWithMediumMismatch };
