import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../contexts/AppContext";
import { surahsMetadata } from "../data/surahsMetadata";
import { SurahDetail, Ayah } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sliders, 
  ChevronLeft, 
  Sparkles,
  RefreshCw,
  Eye,
  Sun
} from "lucide-react";

export const QuranTab: React.FC = () => {
  const { 
    markedSurah, 
    setMarkedSurah,
    quranFont,
    comfortReading,
    setComfortReading,
    quranBrightness,
    setQuranBrightness
  } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSurahNumber, setActiveSurahNumber] = useState<number | null>(null);

  const getFontFamilyClass = (fontKey: string) => {
    switch (fontKey) {
      case "amiri":
        return "font-serif";
      case "scheherazade":
        return "font-scheherazade";
      case "cairo":
        return "font-sans";
      default:
        return "font-serif";
    }
  };
  
  // Surah reader states
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(24); // default 24px
  
  // Audio states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filter surahs based on search query (Arabic or English)
  const filteredSurahs = surahsMetadata.filter(surah => 
    surah.name.includes(searchQuery) || 
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load Surah details when a Surah is clicked
  const openSurah = async (number: number) => {
    setActiveSurahNumber(number);
    setIsLoadingDetail(true);
    setSurahDetail(null);
    setIsPlaying(false);
    setAudioProgress(0);

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}/ar.uthmani`);
      const json = await res.json();
      
      if (json.code === 200) {
        const metadata = surahsMetadata.find(s => s.number === number);
        if (metadata) {
          const detail: SurahDetail = {
            ...metadata,
            ayahs: json.data.ayahs,
            // Mishary Rashid Alafasy whole surah recitations
            audioUrl: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${number}.mp3`
          };
          setSurahDetail(detail);
        }
      }
    } catch (err) {
      console.error("Error fetching surah details:", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const closeSurah = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setActiveSurahNumber(null);
    setSurahDetail(null);
    setIsPlaying(false);
  };

  // Manage native audio listeners
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setAudioProgress(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setAudioDuration(audio.duration);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [surahDetail]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error("Audio playback failed:", err));
    }
  };

  // Handle speed and volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = audioSpeed;
    }
  }, [audioSpeed, surahDetail]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted, surahDetail]);

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setAudioProgress(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const formatAudioTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Quick jump bookmarked surah metadata
  const bookmarkedSurahMeta = markedSurah !== null 
    ? surahsMetadata.find(s => s.number === markedSurah) 
    : null;

  return (
    <div className="space-y-1 w-full " dir="rtl">
      <AnimatePresence mode="wait">
        {activeSurahNumber === null ? (
          // VIEW 1: Surah Browser Index
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {/* Quick Bookmark Banner */}
            {bookmarkedSurahMeta && (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                onClick={() => openSurah(bookmarkedSurahMeta.number)}
                className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 rounded-xl text-white">
                    <Bookmark className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs text-amber-800 dark:text-amber-400 font-bold">متابعة القراءة</h4>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      سورة {bookmarkedSurahMeta.name} ({bookmarkedSurahMeta.englishName})
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </motion.div>
            )}

            {/* Search Input bar */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-1.5 shadow-md border border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
              <div className="p-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن سورة بالاسم العربي أو الإنجليزي..."
                className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 dark:text-slate-100 pr-1 placeholder:text-slate-400 py-1.5"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Index Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredSurahs.map((surah) => {
                const isSaved = markedSurah === surah.number;
                return (
                  <motion.div
                    key={surah.number}
                    whileHover={{ x: -2 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all flex items-center justify-between"
                  >
                    {/* Index Badge + Text */}
                    <div 
                      onClick={() => openSurah(surah.number)}
                      className="flex items-center gap-3.5 flex-1 cursor-pointer select-none"
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-900 font-mono font-bold text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                        {surah.number}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{surah.name}</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-normal">
                            {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          {surah.englishName} &bull; {surah.numberOfAyahs} آية
                        </p>
                      </div>
                    </div>

                    {/* Bookmark Icon Button */}
                    <button
                      onClick={() => setMarkedSurah(isSaved ? null : surah.number)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isSaved 
                          ? "bg-amber-500/10 border-amber-300 text-amber-600 dark:text-amber-400" 
                          : "border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      <Bookmark className={`w-4.5 h-4.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </motion.div>
                );
              })}

              {filteredSurahs.length === 0 && (
                <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                  لا توجد نتائج تطابق بحثك.
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          // VIEW 2: Surah Reader Panel
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4 w-full mx-auto"
          >
            {/* Top Reader Action Bar */}
            <div className="flex justify-between  items-center bg-white dark:bg-slate-800 rounded-2xl p-3.5 shadow-md border border-slate-100 dark:border-slate-700/50">
              <button 
                onClick={closeSurah}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs"
              >
                <ChevronLeft className="w-5 h-5 rotate-180" />
                <span>العودة للفهرس</span>
              </button>

              <div className="text-center">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  {surahsMetadata.find(s => s.number === activeSurahNumber)?.name}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {surahsMetadata.find(s => s.number === activeSurahNumber)?.englishName}
                </span>
              </div>

              {/* Bookmark state */}
              <button
                onClick={() => setMarkedSurah(markedSurah === activeSurahNumber ? null : activeSurahNumber)}
                className={`p-2 rounded-xl border ${
                  markedSurah === activeSurahNumber 
                    ? "bg-amber-500/10 border-amber-300 text-amber-600 dark:text-amber-400" 
                    : "border-slate-100 dark:border-slate-700 text-slate-400"
                }`}
              >
                <Bookmark className={`w-4.5 h-4.5 ${markedSurah === activeSurahNumber ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Quran Reader Preferences & Accessibility Panel */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  خيارات القراءة والراحة والخط
                </span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                  {quranFont === "amiri" ? "خط أميري" : quranFont === "scheherazade" ? "خط شهرزاد" : "خط القاهرة"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Control 1: Font Size Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500">حجم الخط</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {fontSize}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="38"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Control 2: Screen Brightness Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-500" />
                      سطوع صفحة القراءة
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {quranBrightness}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={quranBrightness}
                    onChange={(e) => setQuranBrightness(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Control 3: Comfort Reading Mode Toggle */}
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${comfortReading ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-700 dark:text-slate-300">قراءة مريحة</h5>
                      <p className="text-[9px] text-slate-400">تقليل إجهاد العين ليلاً</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setComfortReading(!comfortReading)}
                    className={`w-9 h-5 rounded-full transition-colors relative outline-none cursor-pointer ${
                      comfortReading ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span 
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        comfortReading ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Surah Verses Content Sheet */}
            <div 
              className={`bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 min-h-[400px] overflow-y-auto max-h-[calc(100vh-320px)] relative shadow-inner islamic-pattern transition-all duration-300 ${
                comfortReading ? "bg-amber-50/95 dark:bg-amber-950/20 text-amber-950 dark:text-amber-50" : ""
              }`}
              style={{
                filter: `brightness(${quranBrightness}%) ${comfortReading ? "sepia(0.5) hue-rotate(-10deg) saturate(0.9)" : ""}`
              }}
            >
              {isLoadingDetail && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 z-10 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                  <p className="text-xs text-slate-500 animate-pulse">جاري تحميل الآيات بالرسم العثماني...</p>
                </div>
              )}

              {surahDetail ? (
                <div className="space-y-6 text-right leading-loose">
                  {/* Basmala Banner (except for At-Tawbah and Al-Fatihah, as Basmala is built-in or skipped) */}
                  {activeSurahNumber !== 1 && activeSurahNumber !== 9 && (
                    <div className={`text-center ${getFontFamilyClass(quranFont)} text-2xl text-slate-800 dark:text-slate-100 py-4 border-b border-slate-100 dark:border-slate-800`}>
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                  )}

                  {/* Flowing Verses layout */}
                  <div className="text-justify py-4 ayah-text" style={{ fontSize: `${fontSize}px` }}>
                    {surahDetail.ayahs.map((ayah, index) => {
                      // If Al-Fatihah, we strip the Basmala from verse 1 if it's there
                      let text = ayah.text;
                      if (activeSurahNumber === 1 && index === 0) {
                        // Keep Al-Fatihah 1 intact
                      } else if (index === 0 && text.startsWith("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")) {
                        // Strip Basmala from verse 1 since we already show the banner
                        text = text.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").trim();
                      }

                      return (
                        <React.Fragment key={ayah.number}>
                          <span className={`${getFontFamilyClass(quranFont)} text-slate-800 dark:text-slate-100 tracking-wide select-text`}>
                            {text}
                          </span>
                          {/* Ayah End Badge Circle */}
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs mx-2 bg-emerald-500/5">
                            {ayah.numberInSurah}
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ) : (
                !isLoadingDetail && (
                  <div className="text-center py-20 text-slate-400">
                    عذراً، فشل تحميل محتوى السورة. يرجى التحقق من اتصال الإنترنت.
                  </div>
                )
              )}
            </div>

            {/* Reciter Audio Media Player Container */}
            {surahDetail?.audioUrl && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-xl border border-slate-100 dark:border-slate-700/50 space-y-3">
                <audio ref={audioRef} src={surahDetail.audioUrl} preload="none" />
                
                {/* Audio timeline and duration trackers */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {formatAudioTime(audioProgress)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={audioDuration || 100}
                    value={audioProgress}
                    onChange={handleAudioSeek}
                    className="w-full accent-emerald-500 h-1 bg-slate-100 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {formatAudioTime(audioDuration)}
                  </span>
                </div>

                {/* Media Playback Controls */}
                <div className="flex items-center justify-between">
                  {/* Reciter Name Info */}
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-500">القارئ: مشاري العفاسي</span>
                  </div>

                  {/* Play/Pause Main Button */}
                  <button
                    onClick={togglePlay}
                    className="p-3 bg-emerald-500 hover:bg-emerald-600 rounded-full text-white shadow-md transition-all scale-105 active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  {/* Settings: Audio Speed & Mute */}
                  <div className="flex items-center gap-2">
                    {/* Speech Speed Switcher */}
                    <button
                      onClick={() => {
                        const speeds = [1, 1.25, 1.5, 0.75];
                        const nextIdx = (speeds.indexOf(audioSpeed) + 1) % speeds.length;
                        setAudioSpeed(speeds[nextIdx]);
                      }}
                      className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
                    >
                      {audioSpeed}x
                    </button>

                    {/* Mute toggle */}
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-100 dark:border-slate-800"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuranTab;
