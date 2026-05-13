import { createContext } from 'react';
import type { Medium } from './NodeDataStructures/Mediums/Medium';
import type { ErrorMessage } from './Reactflow-Components/Errors/ErrorMessage';
import type { NodeInput } from './NodeDataStructures/Nodes/NodeInput';

interface AppContextType {
	mediums: Medium[];
	setMediums: (mediums: Medium[]) => void;
	setErrorMessages: (messages: ErrorMessage[]) => void;
	setLoadingMessage: (isLoading: string | null) => void;
	getNodeInputs: (componentType: string) => NodeInput[];
}
export const AppContext = createContext<AppContextType | null>(null);
