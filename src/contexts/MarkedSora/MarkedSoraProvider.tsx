import { useState, useEffect } from "react";
import MarkedSoraContext  from "./MarkedSoraContext.tsx";

const LOCAL_STORAGE_KEY = "markedSoraIndex";

export default function MarkedSoraProvider({ children }: { children: React.ReactNode }) {
    const [markedSora, setMarkedSoraState] = useState<number>(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored !== null ? Number(stored) : -1;
    });

    const setMarkedSora = (value: number | ((prev: number) => number)) => {
        if (typeof value === 'function') {
            setMarkedSoraState(prevState => {
                const newValue = value(prevState);
                return newValue;
            });
        } else {
            setMarkedSoraState(value);
        }
    };

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, String(markedSora));
    }, [markedSora]);

    return (
        <MarkedSoraContext.Provider value={{ markedSora, setMarkedSora }}>
            {children}
        </MarkedSoraContext.Provider>
    );
}