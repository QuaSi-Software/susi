import { createContext } from 'react';
import type { Medium } from '../NodeDataStructures/Medium';
import type { ErrorMessage } from './Errors/ErrorMessage';

interface AppContextType {
	mediums: Medium[];
	setMediums: (mediums: Medium[]) => void;
	setErrorMessages: (messages: ErrorMessage[]) => void;
}
export const AppContext = createContext<AppContextType | null>(null);
