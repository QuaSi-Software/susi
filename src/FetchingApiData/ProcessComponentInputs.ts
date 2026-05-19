import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import { getUndefinedMedium } from '../NodeDataStructures/Mediums/MediumUtils';
import { InputObject, InputObjectType } from '../NodeDataStructures/Nodes/NodeInput';

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
	if (Array.isArray(apiInput.default) && apiInput.default.length > 0 && apiInput.default[0] === null)
		apiInput.default = null;
	return new InputObject(
		getNodeInputType(inputName, apiInput),
		inputName,
		apiInput.display_name,
		apiInput.default,
		apiInput.description,
		true,
		apiInput.required,
		apiInput.options,
		apiInput.options
	);
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
