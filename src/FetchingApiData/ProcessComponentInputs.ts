import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import { getUndefinedMedium } from '../NodeDataStructures/Mediums/MediumUtils';
import { InputObject, InputObjectType } from '../Reactflow-Components/CustomInputWidgets/InputObject';
import { importConditional } from '../Reactflow-Components/CustomInputWidgets/Validation/Conditionals';
import { importValidation } from '../Reactflow-Components/CustomInputWidgets/Validation/NumberValidation';
import type { ApiCategory, ApiComponent, APIParameter } from './ApiData';
import { type NodeType } from '../NodeDataStructures/Nodes/SusiNodeTypes';

function getNodeInputType(inputName: string, apiInput: APIParameter) {
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

function getNodeInputFromAPIComponentInput(inputName: string, apiInput: APIParameter) {
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

export function getComponentTypes(
	apiComponents: Record<string, ApiComponent>,
	typeCategories: ApiCategory[],
	mediums: Medium[]
): Record<string, NodeType> {
	const nodeTypes: Record<string, NodeType> = {};
	for (const [componentType, component] of Object.entries(apiComponents)) {
		const nodeInputs = [];
		for (const [nodeInputName, inputAttributes] of Object.entries(component.parameters)) {
			const newInput = getNodeInputFromAPIComponentInput(nodeInputName, inputAttributes);
			if (newInput.type === InputObjectType.MEDIUM) {
				const medium = mediums.find((m) => m.name === newInput.value);
				newInput.value = medium !== undefined ? medium!.key : getUndefinedMedium().key;
			}
			nodeInputs.push(newInput);
		}

		let category = typeCategories.find((category) => category.types!.includes(componentType));
		console.assert(category !== undefined, `Component ${componentType} is not assigned a category`);
		const nodeType: NodeType = {
			type_name: componentType,
			button_name: component.display_name,
			nr_inputs: component.nr_inputs,
			nr_outputs: component.nr_outputs,
			segment: component.segment,
			category: category !== undefined ? category.heading : 'Other',
			inputs: nodeInputs,
		};
		nodeTypes[nodeType.type_name] = nodeType;
	}
	return nodeTypes;
}
