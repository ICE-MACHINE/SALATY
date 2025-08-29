import type { Ayah } from "./AyahType.tsx";
export type Sora={
   number: number;
   name: string;
   englishName?: string;
   englishNameTranslation?: string;
   revelationType?: string;
   numberOfAyahs?: number;
   ayahs: Ayah[];
}

