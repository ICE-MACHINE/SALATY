import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { LocationState, SalatData, PrayerTiming } from "../types";

export interface RemindersConfig {
  morningAdhkar: boolean;
  eveningAdhkar: boolean;
  postPrayerAdhkar: boolean;
  randomTasbeeh: boolean;
  quranReminders: boolean;
  prayFajr: boolean;
  prayDhuhr: boolean;
  prayAsr: boolean;
  prayMaghrib: boolean;
  prayIsha: boolean;
}

interface AppContextType {
  mode: "light" | "dark";
  toggleMode: () => void;
  location: LocationState;
  setLocation: (lat: number, lng: number, placeName?: string) => void;
  searchLocation: (query: string) => Promise<boolean>;
  salatData: SalatData | null;
  isLoadingSalat: boolean;
  completedPrayers: Record<string, boolean>; // prayerName -> completed today
  togglePrayerCompleted: (name: string) => void;
  markedSurah: number | null; // saved surah number (1-114)
  setMarkedSurah: (num: number | null) => void;
  qiblaAngle: number; // mathematical Qibla angle
  activeTab: "salat" | "quran" | "adhkar" | "location" | "settings";
  setActiveTab: (tab: "salat" | "quran" | "adhkar" | "location" | "settings") => void;
  playCounterSound: () => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
  toast: { title: string; message: string; type: "info" | "success" } | null;
  setToast: (toast: { title: string; message: string; type: "info" | "success" } | null) => void;
  requestNotificationPermission: () => Promise<boolean>;
  remindersConfig: RemindersConfig;
  updateReminderConfig: (key: keyof RemindersConfig, val: boolean) => void;
  playSpiritualSound: () => void;
  quranFont: string;
  setQuranFont: (font: string) => void;
  comfortReading: boolean;
  setComfortReading: (val: boolean) => void;
  quranBrightness: number;
  setQuranBrightness: (val: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Math constant for Kaaba location in Makkah
const KAABA_LAT = 21.4225241;
const KAABA_LNG = 39.8261818;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

// Calculate Qibla direction based on latitude and longitude
const calculateQibla = (lat: number, lng: number): number => {
  const phi1 = toRadians(lat);
  const phi2 = toRadians(KAABA_LAT);
  const deltaLng = toRadians(KAABA_LNG - lng);

  const y = Math.sin(deltaLng);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLng);
  
  let qibla = toDegrees(Math.atan2(y, x));
  return (qibla + 360) % 360;
};

// Web Audio API custom synthesizer for the adhkar counter sound
const synthClickSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime); // high pure click frequency
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    console.error("Audio synth error:", err);
  }
};

// Web Audio API custom synthesizer for the dynamic masjid-style prayer notification chime
const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Play a gentle elegant dual-frequency masjid-style chime
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };
    
    // Chime chords: E5 then A5
    playTone(659.25, now, 1.2); // E5
    playTone(880.00, now + 0.25, 1.5); // A5
  } catch (err) {
    console.error("Audio Notification error:", err);
  }
};

// Web Audio API custom synthesizer for the quiet and relaxing spiritual notifications
const playSpiritualSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Very soft, ambient chime, starting with low pass filter to make it warm and comfortable
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, now);
    filter.connect(ctx.destination);

    const playTone = (freq: number, start: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      
      osc.connect(gain);
      gain.connect(filter);
      osc.start(start);
      osc.stop(start + duration);
    };

    // Soft major triad arpeggio: C5 -> E5 -> G5 -> C6 (pure, calm chime chords)
    playTone(523.25, now, 1.5, 0.08); // C5
    playTone(659.25, now + 0.15, 1.5, 0.08); // E5
    playTone(783.99, now + 0.3, 1.5, 0.08); // G5
    playTone(1046.50, now + 0.45, 1.8, 0.06); // C6
  } catch (err) {
    console.error("Spiritual Audio Notification error:", err);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("salaty_mode");
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  const [location, setLocationState] = useState<LocationState>(() => {
    const lat = localStorage.getItem("salaty_lat");
    const lng = localStorage.getItem("salaty_lng");
    const place = localStorage.getItem("salaty_place");
    return {
      lat: lat ? Number(lat) : 36.7525, // default Algiers
      lng: lng ? Number(lng) : 3.042,
      place: place || "الجزائر العاصمة, الجزائر",
    };
  });

  const [salatData, setSalatData] = useState<SalatData | null>(null);
  const [isLoadingSalat, setIsLoadingSalat] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"salat" | "quran" | "adhkar" | "location" | "settings">("salat");

  // Track completed prayers
  const [completedPrayers, setCompletedPrayers] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("salaty_completed_prayers");
    const savedDate = localStorage.getItem("salaty_completed_date");
    const today = new Date().toDateString();
    
    if (saved && savedDate === today) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  // Bookmarked Surah
  const [markedSurah, setMarkedSurahState] = useState<number | null>(() => {
    const saved = localStorage.getItem("salaty_marked_surah");
    return saved ? Number(saved) : null;
  });

  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem("salaty_notifications_enabled");
    return saved === "true"; // default to false so they opt-in with system permission
  });

  const [toast, setToast] = useState<{ title: string; message: string; type: "info" | "success" } | null>(null);

  const [remindedPrayers, setRemindedPrayers] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("salaty_reminded_prayers");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const remindedRef = useRef<string>("");
  const notificationsEnabledRef = useRef(notificationsEnabled);
  const remindedPrayersRef = useRef(remindedPrayers);

  useEffect(() => {
    notificationsEnabledRef.current = notificationsEnabled;
  }, [notificationsEnabled]);

  useEffect(() => {
    remindedPrayersRef.current = remindedPrayers;
  }, [remindedPrayers]);

  const [remindersConfig, setRemindersConfig] = useState<RemindersConfig>(() => {
    const saved = localStorage.getItem("salaty_reminders_config");
    const defaults = {
      morningAdhkar: true,
      eveningAdhkar: true,
      postPrayerAdhkar: true,
      randomTasbeeh: true,
      quranReminders: true,
      prayFajr: true,
      prayDhuhr: true,
      prayAsr: true,
      prayMaghrib: true,
      prayIsha: true,
    };
    if (saved) {
      try {
        return { ...defaults, ...JSON.parse(saved) };
      } catch {
        // fallback
      }
    }
    return defaults;
  });

  const [triggeredReminders, setTriggeredReminders] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("salaty_triggered_reminders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const [quranFont, setQuranFontState] = useState<string>(() => {
    return localStorage.getItem("salaty_quran_font") || "amiri";
  });

  const [comfortReading, setComfortReadingState] = useState<boolean>(() => {
    return localStorage.getItem("salaty_comfort_reading") === "true";
  });

  const [quranBrightness, setQuranBrightnessState] = useState<number>(() => {
    const saved = localStorage.getItem("salaty_quran_brightness");
    return saved ? Number(saved) : 100;
  });

  const setQuranFont = (font: string) => {
    setQuranFontState(font);
    localStorage.setItem("salaty_quran_font", font);
  };

  const setComfortReading = (val: boolean) => {
    setComfortReadingState(val);
    localStorage.setItem("salaty_comfort_reading", String(val));
  };

  const setQuranBrightness = (val: number) => {
    setQuranBrightnessState(val);
    localStorage.setItem("salaty_quran_brightness", String(val));
  };

  const updateReminderConfig = (key: keyof RemindersConfig, val: boolean) => {
    setRemindersConfig((prev) => {
      const updated = { ...prev, [key]: val };
      localStorage.setItem("salaty_reminders_config", JSON.stringify(updated));
      return updated;
    });
  };

  const remindersConfigRef = useRef(remindersConfig);
  const triggeredRemindersRef = useRef(triggeredReminders);

  useEffect(() => {
    remindersConfigRef.current = remindersConfig;
  }, [remindersConfig]);

  useEffect(() => {
    triggeredRemindersRef.current = triggeredReminders;
  }, [triggeredReminders]);

  const setNotificationsEnabled = (val: boolean) => {
    setNotificationsEnabledState(val);
    localStorage.setItem("salaty_notifications_enabled", String(val));
    if (val && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch {
      return false;
    }
  };

  const [qiblaAngle, setQiblaAngle] = useState<number>(() => calculateQibla(location.lat, location.lng));

  const salatRawRef = useRef<any>(null);

  // Sync mode with class list
  useEffect(() => {
    const root = window.document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("salaty_mode", mode);
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  const setMarkedSurah = (num: number | null) => {
    setMarkedSurahState(num);
    if (num === null) {
      localStorage.removeItem("salaty_marked_surah");
    } else {
      localStorage.setItem("salaty_marked_surah", String(num));
    }
  };

  // Set location and geocode place if not provided
  const setLocation = (lat: number, lng: number, placeName?: string) => {
    setIsLoadingSalat(true);
    setQiblaAngle(calculateQibla(lat, lng));
    
    if (placeName) {
      const newState = { lat, lng, place: placeName };
      setLocationState(newState);
      localStorage.setItem("salaty_lat", String(lat));
      localStorage.setItem("salaty_lng", String(lng));
      localStorage.setItem("salaty_place", placeName);
    } else {
      // Reverse geocode to get city name in Arabic
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`, {
        headers: { "User-Agent": "SalatyPrayerApp/1.0" },
      })
        .then((res) => res.json())
        .then((data) => {
          const address = data.address || {};
          const city = address.city || address.town || address.village || address.state || "موقع مخصص";
          const country = address.country || "";
          const name = `${city}${country ? "، " + country : ""}`;
          
          const newState = { lat, lng, place: name };
          setLocationState(newState);
          localStorage.setItem("salaty_lat", String(lat));
          localStorage.setItem("salaty_lng", String(lng));
          localStorage.setItem("salaty_place", name);
        })
        .catch(() => {
          const name = `موقع: ${lat.toFixed(3)}، ${lng.toFixed(3)}`;
          const newState = { lat, lng, place: name };
          setLocationState(newState);
          localStorage.setItem("salaty_lat", String(lat));
          localStorage.setItem("salaty_lng", String(lng));
          localStorage.setItem("salaty_place", name);
        });
    }
  };

  // Search location
  const searchLocation = async (query: string): Promise<boolean> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&accept-language=ar&limit=1`, {
        headers: { "User-Agent": "SalatyPrayerApp/1.0" },
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const item = data[0];
        const lat = Number(item.lat);
        const lng = Number(item.lon);
        setLocation(lat, lng, item.display_name);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Location search error:", error);
      return false;
    }
  };

  // Fetch timings from Aladhan API
  useEffect(() => {
    let isMounted = true;
    const fetchTimings = async () => {
      try {
        setIsLoadingSalat(true);
        const url = `https://api.aladhan.com/v1/timings?latitude=${location.lat}&longitude=${location.lng}&method=19`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch timings");
        const json = await res.json();
        
        if (json.code === 200 && isMounted) {
          salatRawRef.current = json.data;
          updateSalatState();
          setIsLoadingSalat(false);
        }
      } catch (err) {
        console.error("Error fetching prayer times:", err);
        setIsLoadingSalat(false);
      }
    };

    fetchTimings();
    return () => {
      isMounted = false;
    };
  }, [location.lat, location.lng]);

  // Update Completed Prayers checklist and reset on date change
  const togglePrayerCompleted = (name: string) => {
    setCompletedPrayers((prev) => {
      const updated = { ...prev, [name]: !prev[name] };
      localStorage.setItem("salaty_completed_prayers", JSON.stringify(updated));
      localStorage.setItem("salaty_completed_date", new Date().toDateString());
      return updated;
    });
  };

  // Core calculations for Next Prayer countdown
  const updateSalatState = () => {
    if (!salatRawRef.current) return;

    const data = salatRawRef.current;
    const timings = data.timings;
    const date = data.date;

    const prayerIcons: Record<string, string> = {
      Fajr: "Sunrise",
      Sunrise: "Sun",
      Dhuhr: "SunDim",
      Asr: "Compass",
      Maghrib: "Sunset",
      Isha: "Moon",
    };

    const prayerArabicNames: Record<string, string> = {
      Fajr: "الفجر",
      Sunrise: "الشروق",
      Dhuhr: "الظهر",
      Asr: "العصر",
      Maghrib: "المغرب",
      Isha: "العشاء",
    };

    const prayerOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    
    const todayTimings: PrayerTiming[] = prayerOrder.map((key) => {
      const timeStr = timings[key].split(" ")[0]; // Strip timezone offset if any
      const [hours, minutes] = timeStr.split(":").map(Number);
      
      const now = new Date();
      const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
      const missed = now.getTime() > prayerDate.getTime();

      return {
        name: key,
        arabicName: prayerArabicNames[key],
        time: timeStr,
        icon: prayerIcons[key] || "Clock",
        missed,
      };
    });

    // Calculate dynamic countdown to Next Prayer
    const now = new Date();
    let nextIndex = -1;
    let nextPrayerDate = new Date();
    let prevPrayerDate = new Date();
    
    // Find next prayer today
    for (let i = 0; i < prayerOrder.length; i++) {
      const key = prayerOrder[i];
      const [h, m] = timings[key].split(" ")[0].split(":").map(Number);
      const pDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
      
      if (pDate.getTime() > now.getTime()) {
        nextIndex = i;
        nextPrayerDate = pDate;
        
        // Find previous prayer date
        if (i > 0) {
          const prevKey = prayerOrder[i - 1];
          const [ph, pm] = timings[prevKey].split(" ")[0].split(":").map(Number);
          prevPrayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ph, pm, 0);
        } else {
          // Previous was Isha yesterday
          const prevKey = "Isha";
          const [ph, pm] = timings[prevKey].split(" ")[0].split(":").map(Number);
          prevPrayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, ph, pm, 0);
        }
        break;
      }
    }

    // If all prayers today have passed, next is Fajr tomorrow
    if (nextIndex === -1) {
      const fajrKey = "Fajr";
      const [h, m] = timings[fajrKey].split(" ")[0].split(":").map(Number);
      nextPrayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, h, m, 0);
      nextIndex = 0; // Fajr
      
      // Previous was Isha today
      const ishaKey = "Isha";
      const [ph, pm] = timings[ishaKey].split(" ")[0].split(":").map(Number);
      prevPrayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ph, pm, 0);
    }

    const nextName = prayerOrder[nextIndex];
    const totalDuration = nextPrayerDate.getTime() - prevPrayerDate.getTime();
    const elapsed = now.getTime() - prevPrayerDate.getTime();
    const percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

    // Format remaining time
    const diffMs = nextPrayerDate.getTime() - now.getTime();
    const hoursRem = Math.floor(diffMs / (1000 * 60 * 60));
    const minsRem = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secsRem = Math.floor((diffMs % (1000 * 60)) / 1000);

    const pad = (n: number) => String(n).padStart(2, "0");
    const timeRemaining = `${pad(hoursRem)}:${pad(minsRem)}:${pad(secsRem)}`;

    const gregorianMonthsArabic: Record<number, string> = {
      1: "يناير",
      2: "فبراير",
      3: "مارس",
      4: "أبريل",
      5: "مايو",
      6: "يونيو",
      7: "يوليو",
      8: "أغسطس",
      9: "سبتمبر",
      10: "أكتوبر",
      11: "نوفمبر",
      12: "ديسمبر"
    };
    const gregMonthNum = Number(date.gregorian.month.number);
    const gregMonthAr = gregorianMonthsArabic[gregMonthNum] || date.gregorian.month.en || "";

    // Trigger notification 5 minutes before the next prayer
    if (nextName !== "Sunrise") {
      const configKey = `pray${nextName}` as keyof RemindersConfig;
      const isPrayerReminderEnabled = remindersConfigRef.current[configKey] !== false;

      if (isPrayerReminderEnabled) {
        const diffMs = nextPrayerDate.getTime() - now.getTime();
        const fiveMinsMs = 5 * 60 * 1000;
        
        if (diffMs > 0 && diffMs <= fiveMinsMs) {
          const prayerKey = `${nextName}_${nextPrayerDate.toDateString()}`;
          
          if (remindedRef.current !== prayerKey) {
            remindedRef.current = prayerKey;
            
            const updated = { ...remindedPrayersRef.current, [nextName]: nextPrayerDate.toDateString() };
            setRemindedPrayers(updated);
            localStorage.setItem("salaty_reminded_prayers", JSON.stringify(updated));
            
            if (notificationsEnabledRef.current) {
              const arabicName = prayerArabicNames[nextName];
              const timeStr = timings[nextName].split(" ")[0];
              
              // Play custom masjid chime
              playNotificationSound();
              
              // Set visually stunning in-app toast
              setToast({
                title: `اقترب موعد صلاة ${arabicName}`,
                message: `متبقي 5 دقائق لرفع الأذان (${timeStr})، تهيأ للصلاة جزاك الله خيراً.`,
                type: "success"
              });
              
              // Trigger browser system Notification if supported and granted
              if ("Notification" in window && Notification.permission === "granted") {
                try {
                  new Notification(`اقترب موعد صلاة ${arabicName} - صلاتي`, {
                    body: `متبقي 5 دقائق على صلاة ${arabicName} (${timeStr})`,
                    icon: "/favicon.ico",
                    dir: "rtl"
                  });
                } catch (e) {
                  console.error("Native notification failed:", e);
                }
              }
            }
          }
        }
      }
    }

    // --- CUSTOM SPIRITUAL REMINDERS ENGINE ---
    const todayStr = now.toDateString();

    const triggerReminder = (key: string, title: string, message: string) => {
      // Check if already triggered today
      if (triggeredRemindersRef.current[key] === todayStr) return;

      const updated = { ...triggeredRemindersRef.current, [key]: todayStr };
      setTriggeredReminders(updated);
      localStorage.setItem("salaty_triggered_reminders", JSON.stringify(updated));

      if (notificationsEnabledRef.current) {
        // Play calm, comforting spiritual chime
        playSpiritualSound();

        setToast({
          title,
          message,
          type: "success"
        });

        if ("Notification" in window && Notification.permission === "granted") {
          try {
            new Notification(`${title} - صلاتي`, {
              body: message,
              icon: "/favicon.ico",
              dir: "rtl"
            });
          } catch (e) {
            console.error("Spiritual native notification failed:", e);
          }
        }
      }
    };

    const getPrayerDate = (pName: string) => {
      if (!timings[pName]) return null;
      const timeStr = timings[pName].split(" ")[0];
      const [hours, minutes] = timeStr.split(":").map(Number);
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    };

    const fajrDate = getPrayerDate("Fajr");
    const sunriseDate = getPrayerDate("Sunrise");
    const dhuhrDate = getPrayerDate("Dhuhr");
    const asrDate = getPrayerDate("Asr");
    const maghribDate = getPrayerDate("Maghrib");
    const ishaDate = getPrayerDate("Isha");

    // 1. Morning Adhkar: 20 minutes after Sunrise
    if (remindersConfigRef.current.morningAdhkar && sunriseDate) {
      const targetTime = sunriseDate.getTime() + 20 * 60 * 1000;
      if (now.getTime() >= targetTime && now.getTime() <= targetTime + 15 * 60 * 1000) {
        triggerReminder("morningAdhkar", "🌅 موعد أذكار الصباح", "حان الآن وقت أذكار الصباح، نوّر بها يومك وجدد بها إيمانك جزاك الله خيراً.");
      }
    }

    // 2. Evening Adhkar: 25 minutes after Asr
    if (remindersConfigRef.current.eveningAdhkar && asrDate) {
      const targetTime = asrDate.getTime() + 25 * 60 * 1000;
      if (now.getTime() >= targetTime && now.getTime() <= targetTime + 15 * 60 * 1000) {
        triggerReminder("eveningAdhkar", "🌇 موعد أذكار المساء", "حان الآن وقت أذكار المساء، حصّن بها نفسك واختم بها يومك.");
      }
    }

    // 3. Post-Prayer Adhkar (Fajr, Dhuhr, Asr, Isha: 25 mins, Maghrib: 15 mins)
    if (remindersConfigRef.current.postPrayerAdhkar) {
      if (fajrDate) {
        const targetTime = fajrDate.getTime() + 25 * 60 * 1000;
        if (now.getTime() >= targetTime && now.getTime() <= targetTime + 15 * 60 * 1000) {
          triggerReminder("postPrayer_Fajr", "📿 أذكار بعد الصلاة", "مضى 25 دقيقة على صلاة الصبح، هل قرأت أذكار بعد الصلاة؟");
        }
      }
      if (dhuhrDate) {
        const targetTime = dhuhrDate.getTime() + 25 * 60 * 1000;
        if (now.getTime() >= targetTime && now.getTime() <= targetTime + 15 * 60 * 1000) {
          triggerReminder("postPrayer_Dhuhr", "📿 أذكار بعد الصلاة", "مضى 25 دقيقة على صلاة الظهر، رطب لسانك بأذكار بعد الصلاة جزاك الله خيراً.");
        }
      }
      if (asrDate) {
        const targetTime = asrDate.getTime() + 25 * 60 * 1000;
        if (now.getTime() >= targetTime && now.getTime() <= targetTime + 15 * 60 * 1000) {
          triggerReminder("postPrayer_Asr", "📿 أذكار بعد الصلاة", "مضى 25 دقيقة على صلاة العصر، استثمر وقتك وعطر لسانك بذكر الله.");
        }
      }
      if (maghribDate) {
        const targetTime = maghribDate.getTime() + 15 * 60 * 1000;
        if (now.getTime() >= targetTime && now.getTime() <= targetTime + 15 * 60 * 1000) {
          triggerReminder("postPrayer_Maghrib", "📿 أذكار بعد الصلاة", "مضى 15 دقيقة على صلاة المغرب، تذكير مبارك بأذكار بعد الصلاة.");
        }
      }
      if (ishaDate) {
        const targetTime = ishaDate.getTime() + 25 * 60 * 1000;
        if (now.getTime() >= targetTime && now.getTime() <= targetTime + 15 * 60 * 1000) {
          triggerReminder("postPrayer_Isha", "📿 أذكار بعد الصلاة", "مضى 25 دقيقة على صلاة العشاء، لا تنسَ أذكار بعد الصلاة قبل نومك.");
        }
      }
    }

    // 4. Quran Reading Reminders
    if (remindersConfigRef.current.quranReminders) {
      // 10:00 AM
      const morningQuran = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0);
      if (now.getTime() >= morningQuran.getTime() && now.getTime() <= morningQuran.getTime() + 15 * 60 * 1000) {
        triggerReminder("quranMorning", "📖 ورد القرآن الكريم", "تذكير بقراءة الورد اليومي من القرآن الكريم. رتّل كلام ربك ونوّر قلبك.");
      }
      // 9:30 PM
      const nightQuran = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 30, 0);
      if (now.getTime() >= nightQuran.getTime() && now.getTime() <= nightQuran.getTime() + 15 * 60 * 1000) {
        triggerReminder("quranNight", "📖 ورد القرآن الكريم", "تذكير بختم يومك بآيات من الذكر الحكيم وسورة الملك المنجية.");
      }
    }

    // 5. General Tasbeeh & Dhikr (At spread times, with daily variation)
    if (remindersConfigRef.current.randomTasbeeh) {
      const generalTasbeehs = [
        "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ 🌸",
        "لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ العَلِيِّ العَظِيمِ ✨",
        "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ 💚",
        "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ 🌿",
        "لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ ☀️",
        "سُبْحَانَ اللهِ، وَالْحَمْدُ للهِ، وَلَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ 💫",
        "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ 🛡️",
        "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ 🤲"
      ];
      const times = [
        { h: 11, m: 15, id: "tasbeeh_1" },
        { h: 14, m: 30, id: "tasbeeh_2" },
        { h: 17, m: 45, id: "tasbeeh_3" },
        { h: 20, m: 45, id: "tasbeeh_4" }
      ];
      times.forEach((t) => {
        const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), t.h, t.m, 0);
        if (now.getTime() >= target.getTime() && now.getTime() <= target.getTime() + 15 * 60 * 1000) {
          const dhikrIndex = (now.getDate() + t.h) % generalTasbeehs.length;
          const dhikrText = generalTasbeehs[dhikrIndex];
          triggerReminder(t.id, "✨ ذكر وتسبيح", dhikrText);
        }
      });
    }

    setSalatData({
      todayTimings,
      dateHijri: `${date.hijri.day} ${date.hijri.month.ar} ${date.hijri.year} هـ`,
      dateGregorian: `${date.gregorian.day} ${gregMonthAr} ${date.gregorian.year} م`,
      dayArabic: date.hijri.weekday.ar,
      nextPrayer: {
        name: nextName,
        arabicName: prayerArabicNames[nextName],
        timeRemaining,
        percentage,
      },
    });
  };

  // Run dynamic countdown timer every second
  useEffect(() => {
    if (!salatRawRef.current) return;
    const timer = setInterval(() => {
      updateSalatState();
    }, 1000);
    return () => clearInterval(timer);
  }, [salatData === null]);

  return (
    <AppContext.Provider
      value={{
        mode,
        toggleMode,
        location,
        setLocation,
        searchLocation,
        salatData,
        isLoadingSalat,
        completedPrayers,
        togglePrayerCompleted,
        markedSurah,
        setMarkedSurah,
        qiblaAngle,
        activeTab,
        setActiveTab,
        playCounterSound: synthClickSound,
        notificationsEnabled,
        setNotificationsEnabled,
        toast,
        setToast,
        requestNotificationPermission,
        remindersConfig,
        updateReminderConfig,
        playSpiritualSound,
        quranFont,
        setQuranFont,
        comfortReading,
        setComfortReading,
        quranBrightness,
        setQuranBrightness,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
