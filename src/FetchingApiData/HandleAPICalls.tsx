import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import { InputObject } from '../Reactflow-Components/CustomInputWidgets/InputObject';
import { getComponentTypes } from './ProcessComponentInputs';
import _ from 'lodash';
import type { ApiCategory, ApiComponent, ApiReturn } from './ApiData';
import type { NodeType } from '../NodeDataStructures/Nodes/SusiNodeTypes';
import { importMenuInputs, type MenuInputs } from './MenuInputs';

export function fetchComponentInputs(
	setLoadingMessage: (isLoading: string | null) => void,
	mediums: Medium[],
	nodeTypes: Record<string, NodeType> | null,
	setComponentTypes: Dispatch<SetStateAction<Record<string, NodeType> | null>>,
	setComponentCategories: Dispatch<SetStateAction<ApiCategory[]>>,
	setIOSettings: Dispatch<SetStateAction<MenuInputs>>,
	setSimulationParametersList: Dispatch<SetStateAction<MenuInputs>>,
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
				setIOSettings(importMenuInputs(data.general.io_categories, data.general.io_settings, 'IO Settings'));
				setSimulationParametersList(
					importMenuInputs(
						data.general.simulation_categories,
						data.general.simulation,
						'Simulation Parameters'
					)
				);
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
