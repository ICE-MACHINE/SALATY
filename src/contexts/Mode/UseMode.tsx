
import ModeContext from "./ModeContext.tsx";
import { useContext } from "react";
import type { ModeContextType } from "./ModeInterface.tsx";
const useMode: () => ModeContextType = () => {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error("useMode must be used within a ModeProvider");
    }
    return context;
}

export default useMode;