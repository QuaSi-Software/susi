import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import { NodeInput, NodeInputType } from '../NodeDataStructures/Nodes/NodeInput';
import { getComponentInputs, type APIComponentInput } from './ProcessComponentInputs';

const exampleInputs = [
	new NodeInput(NodeInputType.STRING, 'example1', 'Example1', 'hello1'),
	new NodeInput(NodeInputType.STRING, 'example2', 'Example2', 'hello2'),
	new NodeInput(NodeInputType.INT, 'example3', 'Example3', 5, '', true, false),
	new NodeInput(NodeInputType.BOOLEAN, 'example4', 'Example4', true, '', true, false),
	new NodeInput(
		NodeInputType.MULTISELECT,
		'example5',
		'Example5',
		['a'],
		'',
		true,
		false,
		['a', 'b', 'c'],
		['A', 'B', 'C']
	),
];

export function fetchComponentInputs(
	setLoadingMessage: (isLoading: string | null) => void,
	mediums: Medium[],
	componentInputsByType: Record<string, NodeInput[]> | null,
	setComponentInputs: Dispatch<SetStateAction<Record<string, NodeInput[]> | null>>,
	setIOSettings: Dispatch<SetStateAction<NodeInput[]>>,
	setSimulationParametersList: Dispatch<SetStateAction<NodeInput[]>>
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
				setIOSettings(exampleInputs);
				setSimulationParametersList(exampleInputs);
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
	componentInputsByType: Record<string, NodeInput[]> | null
): NodeInput[] {
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
