import { useContext } from "react";
import SalatContext from "./SalatContext";

// Return the context value (may be null while loading). Components should
// handle null values using optional chaining or conditional rendering.
const useSalat = () => {
    return useContext(SalatContext);
};

export default useSalat;
