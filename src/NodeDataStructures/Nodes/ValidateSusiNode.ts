import {
	showEconomicParameters,
	showEmissionsParameters,
	type ResieParameterMenuInfo,
} from '../../Sidebar/ResieParameters/ResieParameterMenuInfo';
import type { SusiNode } from './SusiNode';

/** Check all if all inputs in node are valid and assign node.data.hasValidInputs  */
export function checkNodeValidInputs(node: SusiNode, resieParameterMenus: ResieParameterMenuInfo[] | null) {
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
	let hasValidEconomicParameters = true;
	let hasValidEmissionsParameters = true;
	if (resieParameterMenus) {
		hasValidEconomicParameters =
			!showEconomicParameters(resieParameterMenus) || node.data.economicInputs.every((input) => input.isValid());
		hasValidEmissionsParameters =
			!showEmissionsParameters(resieParameterMenus) ||
			node.data.emissionsInputs.every((input) => input.isValid());
	}

	node.data.hasValidInputs =
		hasValidInputs &&
		hasValidControlModules &&
		hasValidControlParameters &&
		hasValidEconomicParameters &&
		hasValidEmissionsParameters;
}
