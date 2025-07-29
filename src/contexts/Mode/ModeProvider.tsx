import ModeContext from "./ModeContext.tsx";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

export default function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState(()=>{
    return localStorage.getItem("mode") || "light";
  });

  useEffect(() => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode) {
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