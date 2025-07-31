import { createContext } from 'react';

import type { WidthContextType } from './WidthInterface.tsx';

const WidthContext = createContext<WidthContextType | null>(null);
export default WidthContext;