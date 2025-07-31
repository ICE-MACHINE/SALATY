import MarkedSoraContext from "./MarkedSoraContext";
import type { MarkedSoraInterface } from "./MarkedSoraInterface";
import { useContext } from "react";
export default function useMarkedSora(): MarkedSoraInterface {
    const context = useContext(MarkedSoraContext);
    if (!context) {
        throw new Error("useMarkedSora must be used within a MarkedSoraProvider");
    }
    return context;
}