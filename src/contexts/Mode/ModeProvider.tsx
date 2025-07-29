import ModeContext from "./ModeContext.tsx";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
type ModeType = 'light' | 'dark';
export default function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ModeType>(() => {
    return (localStorage.getItem("mode") as ModeType) || "light";
  });

  useEffect(() => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}