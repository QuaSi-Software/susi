import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import { InputObject, InputObjectType } from '../Reactflow-Components/CustomInputWidgets/InputObject';
import { getComponentInputs, type APIComponentInput } from './ProcessComponentInputs';
import _ from 'lodash';

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
];

export function fetchComponentInputs(
	setLoadingMessage: (isLoading: string | null) => void,
	mediums: Medium[],
	componentInputsByType: Record<string, InputObject[]> | null,
	setComponentInputs: Dispatch<SetStateAction<Record<string, InputObject[]> | null>>,
	setIOSettings: Dispatch<SetStateAction<InputObject[]>>,
	setSimulationParametersList: Dispatch<SetStateAction<InputObject[]>>
) {
	useEffect(() => {
		if (componentInputsByType !== null) {
			return;
		}
		setLoadingMessage('Loading Resie Data...');
		fetch('/parameters')
			.then((response) => response.json())
			.then((data) => {
				const apiComponents: Record<string, Record<string, APIComponentInput>> = data.components;
				const componentInputs = getComponentInputs(apiComponents, mediums);
				setComponentInputs(componentInputs);
				setIOSettings(exampleInputs.map((input) => input.copy()));
				setSimulationParametersList(exampleInputs.map((input) => input.copy()));
				setLoadingMessage(null);
			})
			.catch((error) => {
				console.error('Error:', error);
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
	componentInputsByType: Record<string, InputObject[]> | null
): InputObject[] {
	if (componentInputsByType === null) {
		console.warn("You shouldn't be able to call getNodeInputsFromAPI if componentInputsByType is null");
		return [];
	}
	const nodeInputs = componentInputsByType[componentType.toLowerCase()];
	if (!nodeInputs) {
		console.warn(`Unknown component type: ${componentType}`);
		return [];
	}
	return nodeInputs;
}
