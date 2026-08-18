import { type Dispatch, type SetStateAction } from 'react';
import type { Medium } from '../NodeDataStructures/Mediums/Medium';
import _ from 'lodash';
import type { ApiCategory, ApiReturn } from './ApiData';
import type { NodeType } from '../NodeDataStructures/Nodes/SusiNodeTypes';
import { type ResieParameterMenuInfo } from '../Sidebar/ResieParameters/ResieParameterMenuInfo';
import { processApiReturn } from './processApiData';
import type { ControlModule } from '../Reactflow-Components/ContextMenus/ControlModules/ControlModulesMenu';
import { getEnv } from '../getEnv.ts';

const localResieParameterModules = import.meta.glob('../assets/resie_parameters.json');

const loadLocalFile = async (): Promise<ApiReturn | null> => {
	const loader = localResieParameterModules['../assets/resie_parameters.json'];
	if (!loader) {
		console.debug('Local resie_parameters.json not found, falling back to API');
		return null;
	}
	try {
		const mod = (await loader()) as { default: ApiReturn } | ApiReturn;
		// JSON modules expose the parsed contents on `default`
		const data = (mod as { default?: ApiReturn }).default ?? (mod as ApiReturn);
		return data ?? null;
	} catch (error) {
		console.debug('Failed to load local resie_parameters.json, falling back to API', error);
		return null;
	}
};

interface useFetchDataProps {
	setLoadingMessage: (isLoading: string | null) => void;
	mediums: Medium[];
	componentTypes: Record<string, NodeType> | null;
	setComponentTypes: Dispatch<SetStateAction<Record<string, NodeType> | null>>;
	setComponentCategories: Dispatch<SetStateAction<ApiCategory[]>>;
	setResieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
	setOverlayError: Dispatch<SetStateAction<string | null>>;
	setControlParameters: Dispatch<SetStateAction<ResieParameterMenuInfo | null>>;
	setControlModules: Dispatch<SetStateAction<ControlModule[]>>;
	setResieVersion: Dispatch<SetStateAction<string | undefined>>;
}

export function fetchData({
	setLoadingMessage,
	mediums,
	setComponentTypes,
	setComponentCategories,
	setResieParameterMenus,
	setOverlayError,
	setControlParameters,
	setControlModules,
	setResieVersion,
}: useFetchDataProps) {
	setLoadingMessage('Loading Resie Data');
	loadLocalFile()
		.then((fileData) => {
			if (fileData) {
				return fileData;
			} else {
				return fetch(getEnv('VITE_RESI_DATA_URL')).then((response) => {
					if (!response.ok) {
						console.error(`Status code ${response.status}: ${response.statusText}`);
						setLoadingMessage(null);
						setOverlayError(
							`An unexpected error occured. Please check your internet connection and try again.`
						);
						return null;
					}
					return response.json();
				});
			}
		})
		.then((data: ApiReturn | null) => {
			if (data === null) return;
			processApiReturn(
				data,
				mediums,
				setComponentTypes,
				setComponentCategories,
				setResieParameterMenus,
				setControlParameters,
				setControlModules,
				setResieVersion
			);
			setLoadingMessage(null);
		})
		.catch((error) => {
			console.error('Error:', error);
			setLoadingMessage(null);
			setOverlayError(`An unexpected error occured. Please check your internet connection and try again.`);
		});
}
