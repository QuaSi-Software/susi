import {
	importInputMenu,
	importResieParameterMenuInfo,
	type ResieParameterMenuInfo,
} from '../Sidebar/ResieParameters/ResieParameterMenuInfo';
import { getComponentTypes } from './getComponentTypes';
import type { ApiCategory, ApiComponent, ApiReturn } from './ApiData';
import type { Dispatch, SetStateAction } from 'react';
import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import type { NodeType } from '../NodeDataStructures/Nodes/SusiNodeTypes';
import { getInputObjectFromAPIParameter } from './ImportInputObjects';
import type { ControlModule } from '../Reactflow-Components/ContextMenus/ControlModules/ControlModulesMenu';
import { defaultDateFormat } from '../Reactflow-Components/CustomInputWidgets/DateParsing';
import type { InputObject } from '../Reactflow-Components/CustomInputWidgets/InputObject';

export function processApiReturn(
	data: ApiReturn,
	mediums: Medium[],
	setComponentTypes: Dispatch<SetStateAction<Record<string, NodeType> | null>>,
	setComponentCategories: Dispatch<SetStateAction<ApiCategory[]>>,
	setResieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>,
	setParameterStudyMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>,
	setParameterStudy: Dispatch<SetStateAction<InputObject[]>>,
	setControlParameters: Dispatch<SetStateAction<ResieParameterMenuInfo | null>>,
	setControlModules: Dispatch<SetStateAction<ControlModule[]>>,
	setResieVersion: Dispatch<SetStateAction<string | undefined>>
) {
	setResieVersion(data.resie_version);
	const apiComponents: Record<string, ApiComponent> = data.components.types;
	const componentTypes: Record<string, NodeType> = getComponentTypes(
		apiComponents,
		data.components.type_categories,
		mediums
	);
	setComponentTypes(componentTypes);
	setComponentCategories(data.components.type_categories);
	/** Control parameters */
	setControlParameters(
		importResieParameterMenuInfo(
			data.components.control_categories,
			data.components.control,
			'Control Parameters',
			'control_parameters'
		)
	);
	/** Control modules */
	const controlModules: ControlModule[] = [];
	for (const [controlModuleName, parameters] of Object.entries(data.components.control_modules)) {
		const inputObjects = Object.entries(parameters).map(([key, value]) =>
			getInputObjectFromAPIParameter(key, value, [])
		);
		controlModules.push({ title: controlModuleName, parameters: inputObjects });
	}
	setControlModules(controlModules);
	/** io settings and sim params */
	data.general.simulation['start_end_unit'].default = defaultDateFormat;
	setResieParameterMenus([
		importResieParameterMenuInfo(
			data.general.io_categories,
			data.general.io_settings,
			'IO Settings',
			'io_settings'
		),
		importResieParameterMenuInfo(
			data.general.simulation_categories,
			data.general.simulation,
			'Simulation Parameters',
			'simulation_parameters'
		),
		importResieParameterMenuInfo(
			data.general.economic_categories,
			data.general.economic,
			'Economic Settings',
			'economic_parameters'
		),
		importResieParameterMenuInfo(
			data.general.emissions_categories,
			data.general.emissions,
			'Emissions',
			'emissions_parameters'
		),
	]);

	setParameterStudyMenus([
		importInputMenu(
			data.general.parameter_study_optimisation,
			'Parameter Study Optimisation',
			'parameter_study_optimisation'
		),
		importInputMenu(data.general.parameter_variation, 'Parameter Variation', 'parameter_variation'),
		importInputMenu(data.general.refinement_optimisation, 'Refinement Optimisation', 'refinement_optimisation'),
		importInputMenu(data.general.sensitivity_analysis, 'Sensitivity Analysis', 'sensitivity_analysis'),
	]);
	setParameterStudy(importInputMenu(data.general.parameter_study, '', '').inputs);
}
