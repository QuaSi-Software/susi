import type { Medium } from '../../../NodeDataStructures/Mediums/Medium';
import type { InputObject } from '../../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { ResieParameterMenuInfo } from '../../ResieParameters/ResieParameterMenuInfo';
import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import type { ControlModule } from '../../../Reactflow-Components/ContextMenus/ControlModules/ControlModulesMenu';
import _ from 'lodash';
import type { ImportData } from '../ExportDataStrucures';
import type { Dispatch, SetStateAction } from 'react';
import type { ParameterStudy } from '../../ParameterStudyModal/ParameterStudyModal';
import { ComponentInputType, getInputs } from '../../../NodeDataStructures/Nodes/ComponentInputTypes';

export function setImportedValues(
	inputs: InputObject[],
	importedValues: Record<string, any>,
	mediums: Medium[],
	startEndUnit: string
) {
	for (const nodeInput of inputs) {
		const value = importedValues[nodeInput.resieName];
		if (value !== undefined) {
			nodeInput.setValueOnImport(value, mediums, startEndUnit);
			nodeInput.isIncluded = true;
		} else {
			nodeInput.isIncluded = false;
		}
	}
	for (const nodeInput of inputs) {
		nodeInput.checkInputValid(inputs);
	}
}

export function setResieParametersMenusFromImport(
	menus: ResieParameterMenuInfo[],
	menuKey: string,
	importedValues: Record<string, any>,
	startEndUnit: string,
	logError: (message: string) => void
): ResieParameterMenuInfo[] {
	const menu = menus.find((e: ResieParameterMenuInfo) => e.exportKey === menuKey);
	menu!.inputs.forEach((input) => {
		const importedValue = importedValues[input.resieName];
		if (importedValue === undefined) {
			input.isIncluded = false;
		} else {
			input.setValueOnImport(importedValue, [], startEndUnit, logError);
			input.isIncluded = true;
		}
	});
	return menus;
}

export function setControlModules(
	importModules: Record<string, any>[],
	node: SusiNode,
	controlModules: ControlModule[],
	logError: (message: string) => void
) {
	const nodeControlModules: ControlModule[] = [];
	importModules.forEach((dict) => {
		const controlModule = _.cloneDeep(controlModules.find((e) => e.title === dict.name));
		if (!controlModule) {
			logError(`Could not find control module with name ${dict.name}`);
			return;
		}
		controlModule.key = `${controlModule.title}_${nodeControlModules.length}`;
		controlModule.parameters.forEach((input) => {
			if (dict[input.resieName]) {
				input.setValueOnImport(dict[input.resieName], [], '', logError);
				input.isIncluded = true;
			}
		});
		controlModule.parameters.forEach((input) => {
			input.checkInputValid(controlModule.parameters);
		});
		nodeControlModules.push(controlModule);
	});
	node.data.controlModules = nodeControlModules;
}

export function importParameterStudies(
	data: ImportData,
	nodes: SusiNode[],
	setParameterStudyMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>,
	parameterStudyOptions: InputObject[],
	setParameterStudies: Dispatch<SetStateAction<ParameterStudy[]>>,
	startEndUnit: string,
	logError: (message: string) => void
) {
	if (data.parameter_study) {
		setParameterStudyMenus((parameterStudyMenus) => {
			/** import parameter study menus */
			setResieParametersMenusFromImport(
				parameterStudyMenus,
				'parameter_study',
				data.parameter_study!,
				startEndUnit,
				logError
			);
			if (data.parameter_study?.parameter_variation)
				setResieParametersMenusFromImport(
					parameterStudyMenus,
					'parameter_variation',
					data.parameter_study?.parameter_variation,
					startEndUnit,
					logError
				);
			if (data.parameter_study?.sensitivity_analysis)
				setResieParametersMenusFromImport(
					parameterStudyMenus,
					'sensitivity_analysis',
					data.parameter_study?.sensitivity_analysis,
					startEndUnit,
					logError
				);
			if (data.parameter_study?.optimisation) {
				setResieParametersMenusFromImport(
					parameterStudyMenus,
					'optimisation',
					data.parameter_study?.optimisation,
					startEndUnit,
					logError
				);
				if (data.parameter_study.optimisation.refinement) {
					setResieParametersMenusFromImport(
						parameterStudyMenus,
						'refinement_optimisation',
						data.parameter_study?.optimisation.refinement,
						startEndUnit,
						logError
					);
				}
			}
			return parameterStudyMenus;
		});
	}
	if (data.parameter_study?.parameters) {
		const parameterStudies: ParameterStudy[] = [];
		for (const [nodeName, nodeParameterStudyDict] of Object.entries(data.parameter_study.parameters)) {
			const node = nodes.find((e) => e.data.content === nodeName);
			if (!node) {
				logError(`Parameter Study with unknown node name: ${nodeName}`);
				continue;
			}

			for (const [resieName, parameterStudyDict] of Object.entries(nodeParameterStudyDict)) {
				const nodeInput = getInputs(ComponentInputType.PARAMETER, node);
				if (!nodeInput) {
					logError(
						`Invalid Parameter Study: The input ${resieName} does not exist on the component ${nodeName}.`
					);
					continue;
				}
				const inputs = _.cloneDeep(parameterStudyOptions);
				setImportedValues(inputs, parameterStudyDict, [], startEndUnit);
				const parameterStudy: ParameterStudy = {
					inputs,
					inputType: ComponentInputType.PARAMETER,
					nodeId: node!.id,
					resieName,
				};
				parameterStudies.push(parameterStudy);
			}
		}
		setParameterStudies(parameterStudies);
	}
}
