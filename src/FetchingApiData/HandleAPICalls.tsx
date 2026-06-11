import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import { InputObject, InputObjectType } from '../Reactflow-Components/CustomInputWidgets/InputObject';
import { getComponentTypes } from './ProcessComponentInputs';
import _ from 'lodash';
import type { ApiCategory, ApiComponent, ApiReturn } from './ApiData';
import type { NodeType } from '../NodeDataStructures/Nodes/SusiNodeTypes';

const exampleInputs: InputObject[] = [
	new InputObject({ type: InputObjectType.STRING, resieName: 'example1', displayName: 'Example1', value: 'hello1' }),
	new InputObject({ type: InputObjectType.STRING, resieName: 'example2', displayName: 'Example2', value: 'hello2' }),
	new InputObject({
		type: InputObjectType.INT,
		resieName: 'example3',
		displayName: 'Example3',
		value: 5,
		isRequired: false,
	}),
	new InputObject({
		type: InputObjectType.FLOAT,
		resieName: 'example7',
		displayName: 'Example7',
		value: 5.87,
		isRequired: false,
	}),
	new InputObject({
		type: InputObjectType.BOOLEAN,
		resieName: 'example4',
		displayName: 'Example4',
		value: true,
		isRequired: false,
	}),
	new InputObject({
		type: InputObjectType.MULTISELECT,
		resieName: 'example5',
		displayName: 'Example5',
		value: ['a'],
		dropdownOptions: ['a', 'b', 'c'],
		dropdownOptionDisplayNames: ['A', 'B', 'C'],
	}),
	new InputObject({
		type: InputObjectType.DATE,
		resieName: 'example8',
		displayName: 'Example8',
		value: '03/03/2003',
	}),
];

export function fetchComponentInputs(
	setLoadingMessage: (isLoading: string | null) => void,
	mediums: Medium[],
	nodeTypes: Record<string, NodeType> | null,
	setComponentTypes: Dispatch<SetStateAction<Record<string, NodeType> | null>>,
	setComponentCategories: Dispatch<SetStateAction<ApiCategory[]>>,
	setIOSettings: Dispatch<SetStateAction<InputObject[]>>,
	setSimulationParametersList: Dispatch<SetStateAction<InputObject[]>>,
	setOverlayError: Dispatch<SetStateAction<string | null>>
) {
	useEffect(() => {
		if (nodeTypes !== null) {
			return;
		}
		setLoadingMessage('Loading Resie Data...');
		fetch('/parameters/susi')
			.then((response) => response.json())
			.then((data: ApiReturn) => {
				const apiComponents: Record<string, ApiComponent> = data.components.types;
				const componentTypes: Record<string, NodeType> = getComponentTypes(
					apiComponents,
					data.components.type_categories,
					mediums
				);
				setComponentTypes(componentTypes);
				setComponentCategories(data.components.type_categories);
				/** io settings and sim params */
				exampleInputs.forEach((input) => {
					input.checkInputValid(exampleInputs);
				});
				setIOSettings(exampleInputs.map((input) => input.copy()));
				setSimulationParametersList(exampleInputs.map((input) => input.copy()));
				setLoadingMessage(null);
			})
			.catch((error) => {
				console.error('Error:', error);
				setLoadingMessage(null);
				setOverlayError(`An unexpected error occured. Please check your internet connection and try again.`);
			});
	});
}

/**
 * Get NodeInput array for a given component type
 * @param componentType The component type (e.g., "Bus", "GridInput", "Storage")
 * @returns Array of NodeInput objects for the component
 */
export function getNodeInputsFromAPI(
	componentType: string,
	componentTypes: Record<string, NodeType> | null
): InputObject[] {
	if (componentTypes === null) {
		console.warn("You shouldn't be able to call getNodeInputsFromAPI if componentInputsByType is null");
		return [];
	}
	const nodeType = componentTypes[componentType];
	const nodeInputs = nodeType?.inputs;
	if (!nodeInputs) {
		console.warn(`Unknown component type: ${componentType}`);
		return [];
	}
	return nodeInputs;
}
