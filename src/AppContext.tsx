import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { Medium } from './NodeDataStructures/Mediums/Medium';
import type { ErrorMessage } from './Reactflow-Components/Errors/ErrorMessage';
import type { InputObject } from './Reactflow-Components/CustomInputWidgets/InputObject';

interface AppContextType {
	mediums: Medium[];
	setMediums: (mediums: Medium[]) => void;
	setErrorMessages: (messages: ErrorMessage[]) => void;
	setLoadingMessage: (isLoading: string | null) => void;
	getNodeInputs: (componentType: string) => InputObject[];
	setCheckState: Dispatch<SetStateAction<boolean>>;
}
export const AppContext = createContext<AppContextType | null>(null);
