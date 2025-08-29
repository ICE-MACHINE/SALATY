import { createContext } from 'react';
import type { LocationInterface } from './LocationInterface';

const LocationContext = createContext<LocationInterface | null>(null);

export default LocationContext;