import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface Medium {
	key: string;
	name: string;
}

interface AppContextType {
	theme: string;
	mediums: Medium[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
	children: ReactNode;
	theme?: string;
	mediums?: Medium[];
}

export const AppProvider = ({ children, theme = 'light', mediums = [] }: AppProviderProps): JSX.Element => {
	return <AppContext.Provider value={{ theme, mediums }}>{children}</AppContext.Provider>;
};

export { AppContext };

export const useAppContext = (): AppContextType => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return context;
};
