import { useContext } from "react";
import WidthContext from "./WidthContext.tsx";

const useWidth = () => {
    const context = useContext(WidthContext);
    if (!context) {
        throw new Error("useWidth must be used within a WidthProvider");
    }
    return context;
};
export default useWidth;