import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import { getUndefinedMedium } from '../NodeDataStructures/Mediums/MediumUtils';
import { InputObject, InputObjectType } from '../Reactflow-Components/CustomInputWidgets/InputObject';
import { importConditional } from '../Reactflow-Components/CustomInputWidgets/Validation/Conditionals';
import { importValidation } from '../Reactflow-Components/CustomInputWidgets/Validation/Validation';

export interface APIComponentInput {
	conditionals: string[][];
	default: any;
	description: string;
	display_name: string;
	json_type: string;
	required: false;
	type: string;
	unit: string;
	options: string[];
	validations: Array<Array<string | number>>;
}

function getNodeInputType(inputName: string, apiInput: APIComponentInput) {
	/** Dropdown and multiselect */
	if (apiInput.options && apiInput.options.length > 0) {
		if (Array.isArray(apiInput.default)) return InputObjectType.MULTISELECT;
		else return InputObjectType.DROPDOWN;
	}
	/** Mediums */
	if (inputName === 'medium') return InputObjectType.MEDIUM;
	const varNameParts = inputName.split('_');
	const l = varNameParts.length;
	if (l >= 3 && varNameParts[0] === 'm' && (varNameParts[l - 1] === 'in' || varNameParts[l - 1] === 'out'))
		return InputObjectType.MEDIUM;
	/** Primitives */
	switch (apiInput.json_type) {
		case 'string':
			return InputObjectType.STRING;
		case 'number':
			return InputObjectType.FLOAT;
		case 'integer':
			return InputObjectType.INT;
		case 'boolean':
			return InputObjectType.BOOLEAN;
		case 'array':
			if (apiInput.type === 'Vector{String}') return InputObjectType.VECTOR_STRING;
			else if (apiInput.type === 'Vector{Float64}' || apiInput.type === 'Vector{Union{Nothing, Float64}}')
				return InputObjectType.VECTOR_FLOAT;
	}
	console.error(`Node Input value ${inputName} has unsupported type: ${apiInput.json_type} \n`, apiInput);
	return InputObjectType.UNSET;
}

function getNodeInputFromAPIComponentInput(inputName: string, apiInput: APIComponentInput) {
	if (inputName === 'power_losses_factor') {
		console.log('problem child');
	}
	if (Array.isArray(apiInput.default) && apiInput.default.length > 0 && apiInput.default[0] === null)
		apiInput.default = null;
	return new InputObject({
		type: getNodeInputType(inputName, apiInput),
		resieName: inputName,
		displayName: apiInput.display_name,
		value: apiInput.default,
		tooltip: apiInput.description,
		unit: apiInput.unit,
		isRequired: apiInput.required,
		dropdownOptions: apiInput.options,
		dropdownOptionDisplayNames: apiInput.options,
		validations: apiInput.validations === undefined ? [] : apiInput.validations.map((x) => importValidation(x)),
		conditionals: apiInput.conditionals === undefined ? [] : apiInput.conditionals.map((x) => importConditional(x)),
	});
}

export function getComponentInputs(
	apiComponents: Record<string, Record<string, APIComponentInput>>,
	mediums: Medium[]
): Record<string, InputObject[]> {
	const componentInputs: Record<string, InputObject[]> = {};
	for (const [componentType, inputList] of Object.entries(apiComponents)) {
		const nodeInputs = [];
		for (const [nodeInputName, inputAttributes] of Object.entries(inputList)) {
			const newInput = getNodeInputFromAPIComponentInput(nodeInputName, inputAttributes);
			if (newInput.type === InputObjectType.MEDIUM) {
				const medium = mediums.find((m) => m.name === newInput.value);
				newInput.value = medium !== undefined ? medium!.key : getUndefinedMedium().key;
			}
			nodeInputs.push(newInput);
		}
		componentInputs[componentType.toLowerCase()] = nodeInputs;
	}
	return componentInputs;
}
