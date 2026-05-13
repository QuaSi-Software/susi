import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import type { NodeInput } from '../NodeDataStructures/Nodes/NodeInput';
import { getComponentInputs, type APIComponentInput } from './ProcessComponentInputs';

export function fetchComponentInputs(
	setLoadingMessage: (isLoading: string | null) => void,
	mediums: Medium[],
	componentInputsByType: Record<string, NodeInput[]> | null,
	setComponentInputs: Dispatch<SetStateAction<Record<string, NodeInput[]> | null>>
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
