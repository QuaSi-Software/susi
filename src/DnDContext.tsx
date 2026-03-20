import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

const DnDContext = createContext<[string | null, (type: string | null) => void]>([null, () => {}]);

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<string | null>(null);

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
}

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
}