import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { Medium } from './NodeDataStructures/Mediums/Medium';
import type { ErrorMessage } from './Reactflow-Components/Errors/ErrorMessage';
import type { Locale } from './Sidebar/SettingsMenu';

interface AppContextType {
	mediums: Medium[];
	setMediums: (mediums: Medium[]) => void;
	setErrorMessages: (messages: ErrorMessage[]) => void;
	setLoadingMessage: (isLoading: string | null) => void;
	setCheckState: Dispatch<SetStateAction<boolean>>;
	locale: Locale;
}
export const AppContext = createContext<AppContextType | null>(null);
