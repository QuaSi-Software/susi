import type { Dispatch, SetStateAction } from 'react';
import {
	showEconomicParameters,
	showEmissionsParameters,
	type ResieParameterMenuInfo,
} from '../../Sidebar/ResieParameters/ResieParameterMenuInfo';
import { deepCloneNodes, type SusiNode } from './SusiNode';

function economicAndEmissionsInputsValid(node: SusiNode, resieParameterMenus: ResieParameterMenuInfo[]): boolean {
	const hasValidEconomicParameters =
		!showEconomicParameters(resieParameterMenus) || node.data.economicInputs.every((input) => input.isValid());
	const hasValidEmissionsParameters =
		!showEmissionsParameters(resieParameterMenus) || node.data.emissionsInputs.every((input) => input.isValid());
	return hasValidEconomicParameters && hasValidEmissionsParameters;
}

export function checkEconomicAndEmissionsNodeValidInputs(
	setNodes: Dispatch<SetStateAction<SusiNode[]>>,
	resieParameterMenus: ResieParameterMenuInfo[]
) {
	setNodes((nodes) => {
		const newNodes = deepCloneNodes(nodes);
		newNodes.forEach((node) => {
			checkNodeValidInputs(node, resieParameterMenus);
		});
		return newNodes;
	});
}

/** Check all if all inputs in node are valid and assign node.data.hasValidInputs  */
export function checkNodeValidInputs(node: SusiNode, resieParameterMenus: ResieParameterMenuInfo[]): void {
	console.assert(
		node.data.nodeInputs !== undefined,
		`Trying to access node inputs of group node: ${node.data.label}`
	);
	const hasValidInputs = node.data.nodeInputs!.every((input) => input.isValid());
	const hasValidControlModules = node.data.controlModules.every((m) => {
		return m.parameters.every((input) => input.isValid());
	});
	const hasValidControlParameters = node.data.controlParameters?.inputs.every((input) => input.isValid()) ?? true;

	/** check economic and emisions parameters */
	const validEconAndEmissionsInputs =
		resieParameterMenus === null || economicAndEmissionsInputsValid(node, resieParameterMenus);

	node.data.hasValidInputs =
		hasValidInputs && hasValidControlModules && hasValidControlParameters && validEconAndEmissionsInputs;
}
