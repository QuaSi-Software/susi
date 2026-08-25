import { createMedium, type Medium } from './Medium';
import type { SusiNode } from '../Nodes/SusiNode';
import type { SusiNodeData } from '../Nodes/SusiNodeData';
import type { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { HandleType } from '../Edges/getEdgesToDelete';

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

function setMediumOfHandle(mediumKey: string, handleName: string, node: SusiNode) {
	const splitName = handleName.split('-');
	const sourceOrTarget = splitName[0] as HandleType;
	const handleIndex = parseInt(splitName[1], 10);
	// get the variable name for the medium that sets this handle's color
	const mediumPerHandle = node.data.handleMediumDict[sourceOrTarget];
	const variableName = mediumPerHandle[handleIndex];
	const nodeInput = node.data.nodeInputs.find((input) => input.resieName === variableName);
	console.assert(
		nodeInput !== undefined,
		`Node input ${variableName} does not exist even though it is in the handleMediumDict`
	);
	if (nodeInput) nodeInput.value = mediumKey;
}

/**
 * Get the node input of the medium associated with a specific handle on a node
 * @param {string} handleName the name of the handle
 * @param {Object} nodeData node.data for our node
 * @returns {Object} the node input of the medium associated with this handle
 */
function getMediumNodeInput(handleName: string, nodeData: SusiNodeData): InputObject {
	const splitName = handleName.split('-');
	const sourceOrTarget = splitName[0] as HandleType;
	const handleIndex = parseInt(splitName[1], 10);
	// get the variable name for the medium that sets this handle's color
	const mediumPerHandle = nodeData.handleMediumDict[sourceOrTarget];
	const variableName = mediumPerHandle[handleIndex];
	// find the medium that is set in this variable
	const mediumNodeInput = nodeData.nodeInputs.find((x) => x.resieName === variableName);
	return mediumNodeInput!;
}

/**
 * Get the key of the medium associated with a specific handle on a node
 * @param {string} handleName the name of the handle
 * @param {Object} nodeData node.data for our node
 * @returns {Object} the key of the medium associated with this handle
 */
function getMediumKey(handleName: string, nodeData: SusiNodeData) {
	return getMediumNodeInput(handleName, nodeData).value;
}

const getRandomColor = () => {
	return `#${Math.floor(Math.random() * 0x1000000)
		.toString(16)
		.padStart(6, '0')}`;
};

const checkForDuplicateNames = (mediums: Medium[]) => {
	const duplicateNameMediums = mediums.filter((m1) => {
		return mediums.find((m2) => m2.key !== m1.key && m2.name === m1.name);
	});
	mediums.forEach((m) => {
		m.valid = true;
	});
	duplicateNameMediums.forEach((m) => {
		m.valid = false;
	});
};

export {
	getDefaultMediums,
	getMediumKey,
	mediumsMatch,
	getRandomColor,
	getUndefinedMedium,
	checkForDuplicateNames,
	setMediumOfHandle,
	getMediumNodeInput,
};
