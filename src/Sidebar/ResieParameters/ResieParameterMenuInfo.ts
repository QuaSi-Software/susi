import type { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { ApiCategory, APIParameter } from '../../FetchingApiData/ApiData';
import {
	checkParametersAndCategoriesMatch,
	getInputObjectFromAPIParameter,
} from '../../FetchingApiData/ImportInputObjects';

export interface ResieParameterMenuInfo {
	title: string;
	exportKey: string;
	inputs: InputObject[];
	categories: ApiCategory[];
}

export function importResieParameterMenuInfo(
	categories: ApiCategory[],
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
	categories.forEach((category) => {
		if (!category.parameters && category.types) {
			category.parameters = category.types;
		}
	});
	checkParametersAndCategoriesMatch(inputs, categories, menuName);
	return {
		title: menuName,
		inputs,
		categories,
		exportKey,
	};
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
	return getResieParameter(resieParameterMenus, 'economic', 'calculate_economy');
}
export function showEmissionsParameters(resieParameterMenus: ResieParameterMenuInfo[]) {
	return getResieParameter(resieParameterMenus, 'emissions', 'calculate_emissions');
}
