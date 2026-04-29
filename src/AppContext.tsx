import { createContext } from 'react';
import type { Medium } from './NodeDataStructures/Mediums/Medium';
import type { ErrorMessage } from './Reactflow-Components/Errors/ErrorMessage';

interface AppContextType {
	mediums: Medium[];
	setMediums: (mediums: Medium[]) => void;
	setErrorMessages: (messages: ErrorMessage[]) => void;
	setLoadingMessage: (isLoading: string | null) => void;
}
export const AppContext = createContext<AppContextType | null>(null);
