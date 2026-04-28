import { createMedium, type Medium } from '../../NodeDataStructures/Medium';
import type { SusiNode } from '../../NodeDataStructures/SusiNode';
import type { SusiEdge } from '../../NodeDataStructures/SusiEdge';
import type { SusiNodeData } from '../../NodeDataStructures/SusiNodeData';

const HandleType = {
	source: 'source',
	target: 'target',
} as const;

type HandleType = (typeof HandleType)[keyof typeof HandleType];

const getUndefinedMedium = () => {
	return createMedium('UNDEFINED', '#ffffff', 'UNDEFINED');
};

const getDefaultMediums = () => {
	return [
		getUndefinedMedium(),
		createMedium('m_e_ac_230v', '#ffee00', 'm_e_ac_230v_DEFAULT_KEY'),
		createMedium('m_h_w_lt1', '#ff6c6c', 'm_h_w_lt1_DEFAULT_KEY'),
		createMedium('m_h_w_ht1', '#940000', 'm_h_w_ht1_DEFAULT_KEY'),
		createMedium('m_c_g_h2', '#00d346', 'm_c_g_h2_DEFAULT_KEY'),
		createMedium('m_c_g_o2', '#ff0000', 'm_c_g_o2_DEFAULT_KEY'),
		createMedium('m_c_g_natgas', '#6e00d4', 'm_c_g_natgas_DEFAULT_KEY'),
	];
};

/**
 * Check if two mediums are defined and the same
 * @param {string} m1 the key of the medium to check
 * @param {string} m2 the key of the medium to check
 * @returns {bool} whether the mediums are defined and the same
 */
function mediumsMatch(m1: string, m2: string) {
	return m1 !== getUndefinedMedium().key && m1 === m2;
}

/**
 * Get the key of the medium associated with a specific handle on a node
 * @param {string} handleName the name of the handle
 * @param {Object} nodeData node.data for our node
 * @returns {Object} the key of the medium associated with this handle
 */
function getMediumKey(handleName: string, nodeData: SusiNodeData) {
	let splitName = handleName.split('-');
	const sourceOrTarget = splitName[0] as HandleType;
	const handleIndex = parseInt(splitName[1], 10);
	// get the variable name for the medium that sets this handle's color
	let mediumPerHandle = nodeData.handleMediumDict[sourceOrTarget];
	let variableName = mediumPerHandle[handleIndex];
	// find the medium that is set in this variable
	let mediumNodeInput = nodeData.nodeInputs.find((x) => x.resieName === variableName);
	return mediumNodeInput!.value;
}

/**
 * Get the medium for the handle on a node
 * @param {string} handleName the name of the handle e.g. target-1 or source-2
 * @param {Object} nodeData node.data of some node, so we can get its resie_data
 * @param {List[Object]} mediums A list of the mediums
 * @returns {Object} the medium Objects with {key, name, color}
 */
function getMedium(handleName: string, nodeData: SusiNodeData, mediums: Medium[]) {
	let key = getMediumKey(handleName, nodeData);
	let medium = mediums.find((x) => x.key === key);
	return medium;
}

/**
 * find all edges, whose medium is controlled by the variable with name var_name on the given node
 * @param {List[Object]} edges a list of all existing edges
 * @param {Object} node the node, whose medium was changed
 * @param {string} mediumVarName the name of the medium variable that was changed
 * @returns {List[string]} a list of all the edge IDs that need to be deleted as a result of the medium change
 */
function getEdgesWithMediumMismatch(edges: SusiEdge[], node: SusiNode, mediumVarName: string) {
	// find all edges connected to this medium variables
	let handleMediumDict = node.data.handleMediumDict;
	let sourceEdgesToDelete = getEdgesToDelete(edges, node.id, mediumVarName, HandleType.source);
	let targetEdgesToDelete = getEdgesToDelete(edges, node.id, mediumVarName, HandleType.target);
	// get just the edge IDs
	const edgeIDs: string[] = [];
	sourceEdgesToDelete.concat(targetEdgesToDelete).forEach((e) => {
		edgeIDs.push(e.id);
	});
	return edgeIDs;

	/**
	 * Get a List of all edge objects that are on the handle controlled by this medium variable
	 * @param {List[Object]} _edges a list of all the edges in the scene
	 * @param {string} _nodeID the id of the node that's being edited
	 * @param {string} _mediumVarName the name of the medium variable, whose value was just changed
	 * @param {string} handleType 'source' or 'target'
	 * @returns {List[Object]} List of all edge objects that are on the handle controlled by this medium variable
	 */
	function getEdgesToDelete(_edges: SusiEdge[], _nodeID: string, _mediumVarName: string, handleType: HandleType) {
		let listOfEdgesToDelete: SusiEdge[] = [];
		//get the list of variable names
		let mediumVarNames = handleMediumDict[handleType];
		// multiple edges are possible for the bus node
		for (let handleIndex = 0; handleIndex < mediumVarNames.length; handleIndex++) {
			if (mediumVarNames[handleIndex] !== _mediumVarName) continue;
			let handleID = handleType + '-' + handleIndex;
			// find edges that connect to this handle on this node
			let edgesOnHandle = _edges.filter((e) => {
				return (
					e[handleType] === _nodeID &&
					e[handleType == HandleType.source ? 'sourceHandle' : 'targetHandle'] === handleID
				);
			});
			listOfEdgesToDelete = listOfEdgesToDelete.concat(edgesOnHandle);
		}
		return listOfEdgesToDelete;
	}
}

const getRandomColor = () => {
	return `#${Math.floor(Math.random() * 0x1000000)
		.toString(16)
		.padStart(6, '0')}`;
};

export {
	getDefaultMediums,
	getMedium,
	getMediumKey,
	mediumsMatch,
	getEdgesWithMediumMismatch,
	getRandomColor,
	getUndefinedMedium,
};
