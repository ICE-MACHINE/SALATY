import { createContext } from "react";
import type { MarkedSoraInterface } from "./MarkedSoraInterface.tsx";

 const MarkedSoraContext = createContext<MarkedSoraInterface>({
  markedSora: -1,
  setMarkedSora: () => {},
});

export default MarkedSoraContext;