
type ModeType = "light" | "dark";

interface ModeContextType {
  mode: ModeType;
  toggleMode: () => void;
}

export type { ModeContextType };