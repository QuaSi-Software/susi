import type { Medium } from './NodeDataStructures/Mediums/Medium';
import { getUndefinedMedium } from './NodeDataStructures/Mediums/MediumUtils';
import { NodeInput, NodeInputType } from './NodeDataStructures/Nodes/NodeInput';

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
		if (Array.isArray(apiInput.default)) return NodeInputType.MULTISELECT;
		else return NodeInputType.DROPDOWN;
	}
	/** Mediums */
	const varNameParts = inputName.split('_');
	if (varNameParts.length === 3 && varNameParts[0] === 'm' && (varNameParts[2] === 'in' || varNameParts[2] === 'out'))
		return NodeInputType.MEDIUM;
	/** Primitives */
	switch (apiInput.json_type) {
		case 'string':
			return NodeInputType.STRING;
		case 'number':
			return NodeInputType.FLOAT;
		case 'integer':
			return NodeInputType.INT;
		case 'boolean':
			return NodeInputType.BOOLEAN;
		case 'array':
			if (apiInput.type === 'Vector{String}') return NodeInputType.VECTOR_STRING;
			else if (apiInput.type === 'Vector{Float64}' || apiInput.type === 'Vector{Union{Nothing, Float64}}')
				return NodeInputType.VECTOR_FLOAT;
	}
	console.error(`Node Input value ${inputName} has unsupported type: ${apiInput.json_type} \n`, apiInput);
	return NodeInputType.UNSET;
}

function getNodeInputFromAPIComponentInput(inputName: string, apiInput: APIComponentInput) {
	if (Array.isArray(apiInput.default) && apiInput.default.length > 0 && apiInput.default[0] === null)
		apiInput.default = null;
	return new NodeInput(
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

export async function getComponentTypes(mediums: Medium[]) {
	return new Promise((resolve, reject) => {
		fetch('/parameters')
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				const apiComponents: Record<string, Record<string, APIComponentInput>> = data.components;
				const componentTypes: Record<string, NodeInput[]> = {};
				for (const [componentType, inputList] of Object.entries(apiComponents)) {
					const nodeInputs = [];
					for (const [nodeInputName, inputAttributes] of Object.entries(inputList)) {
						const newInput = getNodeInputFromAPIComponentInput(nodeInputName, inputAttributes);
						if (newInput.type === NodeInputType.MEDIUM) {
							const medium = mediums.find((m) => m.name === newInput.value);
							newInput.value = medium !== undefined ? medium!.key : getUndefinedMedium().key;
						}
						nodeInputs.push(newInput);
					}
					componentTypes[componentType] = nodeInputs;
				}
				console.log(componentTypes);
				resolve(componentTypes);
			})
			.catch((error) => {
				reject(error);
				console.log('Error:', error);
			});
	});
}
