export interface MarkedSoraInterface {
    markedSora: number;
    setMarkedSora: (value: number | ((prev: number) => number)) => void;
}