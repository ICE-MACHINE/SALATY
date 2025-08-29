export type Ayah={
    number?: number;
    text: string;
    numberInSurah: number;
    juz?: number;
    manzil?: number;
    page?: number;
    ruku?: number;
    hizbQuarter?: number;
    sajda?: boolean | {
        id: number;
        recommended: boolean;
        obligatory: boolean;
    };
}