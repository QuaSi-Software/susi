import type { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { ApiCategory, APIParameter } from '../../FetchingApiData/ApiData';
import {
	checkParametersAndCategoriesMatch,
	getInputObjectFromAPIParameter,
} from '../../FetchingApiData/ImportInputObjects';
import type { Dispatch, SetStateAction } from 'react';
import _ from 'lodash';

export interface ResieParameterMenuInfo {
	title: string;
	exportKey: string;
	inputs: InputObject[];
	categories: ApiCategory[];
}

export function importInputMenu(
	parameters: Record<string, APIParameter>,
	menuName: string,
	exportKey: string
): ResieParameterMenuInfo {
	const inputs: InputObject[] = [];
	for (const [paramName, paramObject] of Object.entries(parameters)) {
		const input = getInputObjectFromAPIParameter(paramName, paramObject, []);
		inputs.push(input);
	}
	inputs.forEach((input) => {
		input.checkInputValid(inputs);
	});
	return {
		title: menuName,
		inputs,
		categories: [],
		exportKey,
	};
}

export function importResieParameterMenuInfo(
	categories: ApiCategory[],
	parameters: Record<string, APIParameter>,
	menuName: string,
	exportKey: string
): ResieParameterMenuInfo {
	const menu = importInputMenu(parameters, menuName, exportKey);
	categories.forEach((category) => {
		if (!category.parameters && category.types) {
			category.parameters = category.types;
		}
	});
	checkParametersAndCategoriesMatch(menu.inputs, categories, menuName);
	menu.categories = categories;
	return menu;
}

export function changeInputListElement(
	setter: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>,
	menuTitle: string,
	key: string,
	value: any,
	isIncludedChange: boolean
) {
	setter((menus) => {
		menus = _.cloneDeep(menus);
		const menu = menus.find((e) => e.title === menuTitle);
		const input = menu!.inputs.find((e) => e.resieName === key);
		if (!input) console.error(`Input with key ${key} should not be undefined in list ${menus}`);
		if (isIncludedChange) input!.isIncluded = value;
		else input!.value = value;
		menu!.inputs.forEach((e) => {
			e.checkInputValid(menu!.inputs);
		});
		return menus;
	});
}

/** check value in resie parameter menus */
function getResieParameter(resieParameterMenus: ResieParameterMenuInfo[], menuExportKey: string, inputName: string) {
	const menu = resieParameterMenus.find((e) => e.exportKey === menuExportKey);
	if (!menu) return null;
	const input = menu.inputs.find((e) => e.resieName === inputName);
	if (!input) return null;
	return input.value;
}

export function showEconomicParameters(resieParameterMenus: ResieParameterMenuInfo[]) {
	return getResieParameter(resieParameterMenus, 'economic_parameters', 'calculate_economy');
}
export function showEmissionsParameters(resieParameterMenus: ResieParameterMenuInfo[]) {
	return getResieParameter(resieParameterMenus, 'emissions_parameters', 'calculate_emissions');
}
