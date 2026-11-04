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
	data.parameter_study = {
		parameters: {},
		sensitivity_analysis: exportMenu(parameterStudyMenus, 'sensitivity_analysis'),
		optimisation: exportMenu(parameterStudyMenus, 'optimisation'),
		parameter_variation: exportMenu(parameterStudyMenus, 'parameter_variation'),
	};
	data.parameter_study.optimisation.refinement = exportMenu(parameterStudyMenus, 'refinement_optimisation');

	const parameters = data.parameter_study!.parameters!;
	parameterStudies.forEach((study) => {
		const nodeName = getNodeNameFromID(study.nodeId, nodes);
		if (!(nodeName in parameters)) parameters[nodeName] = {};
		console.assert(
			!(study.resieName in parameters[nodeName]),
			`Parameter Study list contains the same parameter multiple times: ${study.resieName} on component ${nodeName}`
		);
		parameters[nodeName][study.resieName] = addNodeInputsToObject(study.inputs, [], []);
	});

	exportObjectiveParams(data, objectiveParams);

	function exportMenu(parameterStudyMenus: ResieParameterMenuInfo[], key: string) {
		const menu = parameterStudyMenus.find((e) => e.exportKey === key);
		console.assert(menu !== undefined, `Parameter Study Menu key ${key} was not found`);
		return addNodeInputsToObject(menu!.inputs, [], []);
	}
}
