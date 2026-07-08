import { InputObject } from '../Reactflow-Components/CustomInputWidgets/InputObject';
import { importConditional } from '../Reactflow-Components/CustomInputWidgets/Validation/Conditionals';
import { importValidation } from '../Reactflow-Components/CustomInputWidgets/Validation/NumberValidation';
import type { ApiCategory, APIParameter } from './ApiData';

export function getInputObjectFromAPIParameter(inputName: string, apiInput: APIParameter) {
	if (Array.isArray(apiInput.default) && apiInput.default.length > 0 && apiInput.default[0] === null)
		apiInput.default = null;
	const input = new InputObject(
		{
			type: apiInput.widget_type, //getNodeInputType(inputName, apiInput),
			resieName: inputName,
			displayName: apiInput.display_name,
			value: apiInput.default,
			tooltip: apiInput.description,
			unit: apiInput.unit,
			isRequired: apiInput.required,
			dropdownOptions: apiInput.options,
			dropdownOptionDisplayNames: apiInput.options,
			validations: apiInput.validations === undefined ? [] : apiInput.validations.map((x) => importValidation(x)),
			conditionals:
				apiInput.conditionals === undefined ? [] : apiInput.conditionals.map((x) => importConditional(x)),
		},
		true
	);
	return input;
}

export function checkParametersAndCategoriesMatch(inputs: InputObject[], categories: ApiCategory[], inputType: string) {
	/** Check every input is in a category --> if not, add a category Other at the end and add it there */
	inputs.forEach((input) => {
		const category = categories.find((category) => category.parameters?.includes(input.resieName));
		if (category === undefined) {
			console.warn(`Input ${input.resieName} in ${inputType} is not included in any category.`);
			let otherCategory = categories.find((category) => category.heading === 'Other');
			if (otherCategory === undefined) {
				otherCategory = {
					heading: 'Other',
					index: categories.length,
					parameters: [],
					types: [],
				};
				categories.push(otherCategory);
			}
			otherCategory.parameters?.push(input.resieName);
			otherCategory.types?.push(input.resieName);
		}
	});
	/** Check no category is listed twice */
	const categoryNames = categories.map((category) => category.heading);
	categoryNames.forEach((categoryName) => {
		const numInArray = categoryNames.filter((e) => e === categoryName).length;
		if (numInArray > 1) console.warn(`${inputType} has category ${categoryName} ${numInArray} times`);
	});
	/** Check no category includes an input name that isn't in inputs */
	categories.forEach((category) => {
		const parameters = category.parameters !== undefined ? category.parameters : category.types;
		parameters!.forEach((paramName) => {
			const input = inputs.find((input) => input.resieName === paramName);
			if (input === undefined) {
				console.warn(
					`${inputType} has input ${paramName} in category ${category.heading}, but it is not in the parameter list`
				);
			}
		});
	});
}
