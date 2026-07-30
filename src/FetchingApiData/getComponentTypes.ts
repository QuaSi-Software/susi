import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import { getUndefinedMedium } from '../NodeDataStructures/Mediums/MediumUtils';
import { InputObjectType } from '../Reactflow-Components/CustomInputWidgets/InputObject';
import type { ApiCategory, ApiComponent } from './ApiData';
import { type NodeType } from '../NodeDataStructures/Nodes/SusiNodeTypes';
import { checkParametersAndCategoriesMatch, getInputObjectFromAPIParameter } from './ImportInputObjects';

export function getComponentTypes(
	apiComponents: Record<string, ApiComponent>,
	typeCategories: ApiCategory[],
	mediums: Medium[]
): Record<string, NodeType> {
	const nodeTypes: Record<string, NodeType> = {};
	for (const [componentType, component] of Object.entries(apiComponents)) {
		const nodeInputs = [];
		for (const [nodeInputName, inputAttributes] of Object.entries(component.parameters)) {
			const newInput = getInputObjectFromAPIParameter(nodeInputName, inputAttributes);
			if (newInput.type === InputObjectType.MEDIUM) {
				const medium = mediums.find((m) => m.name === newInput.value);
				newInput.value = medium !== undefined ? medium!.key : getUndefinedMedium().key;
			}
			nodeInputs.push(newInput);
		}
		checkParametersAndCategoriesMatch(nodeInputs, component.param_categories, componentType);
		const economic = Object.entries(component.economic).map(([inputName, attributes]) =>
			getInputObjectFromAPIParameter(inputName, attributes)
		);
		const emissions = Object.entries(component.emissions).map(([inputName, attributes]) =>
			getInputObjectFromAPIParameter(inputName, attributes)
		);

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
			inputCategories: component.param_categories,
			economic: economic,
			emissions: emissions,
		};
		nodeTypes[nodeType.type_name] = nodeType;
	}
	return nodeTypes;
}
