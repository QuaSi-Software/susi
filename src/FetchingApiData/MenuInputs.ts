import type { InputObject } from '../Reactflow-Components/CustomInputWidgets/InputObject';
import type { ApiCategory, APIParameter } from './ApiData';
import { checkParametersAndCategoriesMatch, getInputObjectFromAPIParameter } from './ImportInputObjects';

export interface MenuInputs {
	inputs: InputObject[];
	categories: ApiCategory[];
}

export function importMenuInputs(
	categories: ApiCategory[],
	parameters: Record<string, APIParameter>,
	menuName: string
): MenuInputs {
	const inputs: InputObject[] = [];
	for (const [paramName, paramObject] of Object.entries(parameters)) {
		const input = getInputObjectFromAPIParameter(paramName, paramObject);
		inputs.push(input);
	}
	checkParametersAndCategoriesMatch(inputs, categories, menuName);
	return {
		inputs,
		categories,
	};
}
