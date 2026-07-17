export interface LocationState {
  lat: number;
  lng: number;
  place: string;
}

export interface PrayerTiming {
  name: string;
  arabicName: string;
  time: string; // "HH:mm" format
  icon: string;
  missed: boolean;
}

export interface SalatData {
  todayTimings: PrayerTiming[];
  dateHijri: string;
  dateGregorian: string;
  dayArabic: string;
  nextPrayer: {
    name: string;
    arabicName: string;
    timeRemaining: string; // "HH:MM:SS"
    percentage: number; // 0 to 100 for visual progress ring
  } | null;
}

export interface SurahMetadata {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: "Meccan" | "Medinan";
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  audio?: string;
  text: string;
  numberInSurah: number;
  juz: number;
}

export interface SurahDetail extends SurahMetadata {
  ayahs: Ayah[];
  audioUrl?: string;
}

export interface DhikrItem {
  id: number;
  text: string;
  count: number; // current remaining count
  targetCount: number; // original target (e.g. 3, 33, 100)
}

export interface AdhkarCategory {
  key: string;
  title: string;
  icon: string;
  items: DhikrItem[];
}
