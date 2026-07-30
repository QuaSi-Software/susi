import {
	importResieParameterMenuInfo,
	type ResieParameterMenuInfo,
} from '../Sidebar/ResieParameters/ResieParameterMenuInfo';
import { getComponentTypes } from './getComponentTypes';
import type { ApiCategory, ApiComponent, ApiReturn } from './ApiData';
import type { Dispatch, SetStateAction } from 'react';
import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import type { NodeType } from '../NodeDataStructures/Nodes/SusiNodeTypes';

export function processApiReturn(
	data: ApiReturn,
	mediums: Medium[],
	setComponentTypes: Dispatch<SetStateAction<Record<string, NodeType> | null>>,
	setComponentCategories: Dispatch<SetStateAction<ApiCategory[]>>,
	setresieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>
) {
	const apiComponents: Record<string, ApiComponent> = data.components.types;
	const componentTypes: Record<string, NodeType> = getComponentTypes(
		apiComponents,
		data.components.type_categories,
		mediums
	);
	setComponentTypes(componentTypes);
	setComponentCategories(data.components.type_categories);
	/** io settings and sim params */
	setresieParameterMenus([
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
