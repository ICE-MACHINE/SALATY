export interface Salat {
    salatName: string;
    salatTime: string; // Format: "HH:mm"
    missed: boolean;
    additionMin: number;
    finalSalatTime: () => string;
}

export interface Prayers {
    todayTimings: Salat[];
    todayDate: {
    hijri: string;
    gregorian: string;
        day: string;
    }
}