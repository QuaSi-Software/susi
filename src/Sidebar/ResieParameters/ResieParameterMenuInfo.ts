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
	checkParametersAndCategoriesMatch(inputs, categories, menuName);
	return {
		title: menuName,
		inputs,
		categories,
		exportKey,
	};
}
