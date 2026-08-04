import {
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

export function processApiReturn(
	data: ApiReturn,
	mediums: Medium[],
	setComponentTypes: Dispatch<SetStateAction<Record<string, NodeType> | null>>,
	setComponentCategories: Dispatch<SetStateAction<ApiCategory[]>>,
	setResieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>,
	setControlParameters: Dispatch<SetStateAction<ResieParameterMenuInfo | null>>,
	setControlModules: Dispatch<SetStateAction<ControlModule[]>>
) {
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
			'economic'
		),
		importResieParameterMenuInfo(
			data.general.emissions_categories,
			data.general.emissions,
			'Emissions',
			'emissions'
		),
	]);
}
