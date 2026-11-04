import { ComponentInputType } from '../../../NodeDataStructures/Nodes/ComponentInputTypes';
import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import { exportObjectiveParams, ObjectiveParamOption } from '../../ParameterStudyModal/ObjectiveParams';
import type { ParameterStudy } from '../../ParameterStudyModal/ParameterStudyModal';
import type { ResieParameterMenuInfo } from '../../ResieParameters/ResieParameterMenuInfo';
import type { ImportData } from '../ExportDataStrucures';
import { addNodeInputsToObject, getNodeNameFromID } from './ExportInputs';

/** Add the parameter study data to the export dictionary */
export function exportParameterStudy(
	data: ImportData,
	nodes: SusiNode[],
	parameterStudies: ParameterStudy[],
	parameterStudyMenus: ResieParameterMenuInfo[],
	objectiveParams: ObjectiveParamOption[]
) {
	/** Export the parameter study inputs that aren't dependent on the components */
	data.parameter_study = {
		parameters: {},
		sensitivity_analysis: exportMenu(parameterStudyMenus, 'sensitivity_analysis'),
		optimisation: exportMenu(parameterStudyMenus, 'optimisation'),
		parameter_variation: exportMenu(parameterStudyMenus, 'parameter_variation'),
	};
	data.parameter_study.optimisation.refinement = exportMenu(parameterStudyMenus, 'refinement_optimisation');

	/** export the parameter studies for each component input */
	const parameters = data.parameter_study!.parameters!;
	parameterStudies.forEach((study) => {
		const nodeName = getNodeNameFromID(study.nodeId, nodes);
		if (!(nodeName in parameters)) parameters[nodeName] = {};
		console.assert(
			!(study.resieName in parameters[nodeName]),
			`Parameter Study list contains the same parameter multiple times: ${study.resieName} on component ${nodeName}`
		);
		/** For nested parameters (economic and emissions), change the export key */
		let parameterExportName = study.resieName;
		if (study.inputType === ComponentInputType.ECONOMIC)
			parameterExportName = `economic_parameters.${study.resieName}`;
		if (study.inputType === ComponentInputType.EMISSIONS)
			parameterExportName = `emissions_parameters.${study.resieName}`;
		parameters[nodeName][parameterExportName] = addNodeInputsToObject(study.inputs, [], []);
	});

	exportObjectiveParams(data, objectiveParams);

	function exportMenu(parameterStudyMenus: ResieParameterMenuInfo[], key: string) {
		const menu = parameterStudyMenus.find((e) => e.exportKey === key);
		console.assert(menu !== undefined, `Parameter Study Menu key ${key} was not found`);
		return addNodeInputsToObject(menu!.inputs, [], []);
	}
}
