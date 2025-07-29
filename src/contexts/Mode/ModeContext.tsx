
import { createContext } from 'react';
import type { ModeContextType } from './ModeInterface';

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export default ModeContext;