import { createContext } from 'react';
import type { Medium } from '../NodeDataStructures/Medium';

interface AppContextType {
	mediums: Medium[];
	setMediums: (mediums: Medium[]) => void;
	setErrorMessage: (message: string | null) => void;
}
export const AppContext = createContext<AppContextType | null>(null);
