import { createContext } from "react";
import type { Prayers } from "./SalatInterface.ts";

const SalatContext = createContext<Prayers | null>(null);

export default SalatContext;
