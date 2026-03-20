import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { NodeType } from './Nodes/SusiNodeTypes';

const DnDContext = createContext<[NodeType | null, (type: NodeType | null) => void]>([null, () => {}]);

export const DnDProvider = ({ children }: { children: ReactNode }) => {
	const [type, setType] = useState<NodeType | null>(null);

	return <DnDContext.Provider value={[type, setType]}>{children}</DnDContext.Provider>;
};

export default DnDContext;

/**
 * Return the Drag and Drop Context
 */
export const useDnD = () => {
	return useContext(DnDContext);
};
