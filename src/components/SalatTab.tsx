import React from "react";
import { useApp } from "../contexts/AppContext";
import { motion } from "motion/react";
import { 
  Sun, 
  Sunrise, 
  SunDim, 
  Sunset, 
  Moon, 
  Compass, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  MapPin, 
  Check
} from "lucide-react";

export const SalatTab: React.FC = () => {
  const { 
    salatData, 
    isLoadingSalat, 
    location, 
    completedPrayers, 
    togglePrayerCompleted, 
    playCounterSound,
  } = useApp();

  const getIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "Sunrise": return <Sunrise className={className} />;
      case "Sun": return <Sun className={className} />;
      case "SunDim": return <SunDim className={className} />;
      case "Compass": return <Compass className={className} />;
      case "Sunset": return <Sunset className={className} />;
      case "Moon": return <Moon className={className} />;
      default: return <Clock className={className} />;
    }
  };

  if (isLoadingSalat || !salatData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
        <p className="text-slate-500 dark:text-slate-400 text-sm animate-pulse">جاري تحميل أوقات الصلاة والتقويم...</p>
      </div>
    );
  }

  const { todayTimings, dateHijri, dateGregorian, dayArabic, nextPrayer } = salatData;

  // Calculate overall completed prayers for the daily circular tracker
  const totalPrayersCount = todayTimings.filter(t => t.name !== "Sunrise").length; // Exclude Shuruq from mandatory prayers
  const completedCount = todayTimings
    .filter(t => t.name !== "Sunrise" && completedPrayers[t.name])
    .length;
  const checklistProgress = (completedCount / totalPrayersCount) * 100;

  return (
    <div className="space-y-6 w-full mx-auto" dir="rtl">
      {/* Header Info Banner */}
      <div className="flex justify-between items-center bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
            {location.place}
          </span>
        </div>
        <div className="text-xs font-medium text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{dayArabic}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Countdown + Daily Tracker */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hero Circular Countdown Widget */}
          {nextPrayer && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center relative overflow-hidden">
              {/* Subtle Islamic dome motif background */}
              <div className="absolute inset-x-0 -bottom-10 opacity-5 dark:opacity-10 pointer-events-none flex justify-center">
                <svg width="240" height="120" viewBox="0 0 100 50">
                  <path d="M0,50 Q25,10 50,0 Q75,10 100,50" fill="currentColor" className="text-emerald-600" />
                </svg>
              </div>

              <div className="relative w-48 h-48 flex items-center justify-center mb-4">
                {/* SVG Progress Circle Background */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    className="text-slate-100 dark:text-slate-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="80"
                    className="text-emerald-500 dark:text-emerald-400"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - nextPrayer.percentage / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    transition={{ type: "tween" }}
                  />
                </svg>

                {/* Inner text content */}
                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">الصلاة القادمة</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 my-0.5">{nextPrayer.arabicName}</span>
                  <span className="text-2xl font-mono font-bold text-slate-700 dark:text-slate-200 tracking-wider">
                    {nextPrayer.timeRemaining}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    تبدأ الساعة {todayTimings.find(t => t.name === nextPrayer.name)?.time}
                  </span>
                </div>
              </div>

              {/* Hijri & Gregorian dual dates */}
              <div className="w-full grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-700/50 pt-4 mt-2">
                <div className="text-center border-l border-slate-100 dark:border-slate-700/50 last:border-0">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-0.5">التاريخ الهجري</p>
                  <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200 font-serif leading-none">{dateHijri}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-0.5">التاريخ الميلادي</p>
                  <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200 leading-none">{dateGregorian}</p>
                </div>
              </div>
            </div>
          )}

          {/* Daily Completed Tracker Progress Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md border border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">ورد صلوات اليوم</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                لقد أديت <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{completedCount}</strong> صلوات من أصل <strong className="font-bold">{totalPrayersCount}</strong>
              </p>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="22" strokeWidth="4" stroke="currentColor" className="text-slate-100 dark:text-slate-700" fill="transparent" />
                <circle cx="28" cy="28" r="22" strokeWidth="4" stroke="currentColor" strokeDasharray={2 * Math.PI * 22} strokeDashoffset={2 * Math.PI * 22 * (1 - checklistProgress / 100)} strokeLinecap="round" className="text-emerald-500 dark:text-emerald-400" fill="transparent" />
              </svg>
              <span className="absolute text-xs font-extrabold text-slate-700 dark:text-slate-200">{Math.round(checklistProgress)}%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Timings Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400">مواقيت اليوم</h4>
            <span className="text-[10px] text-slate-400">(اضغط على الصلاة لتسجيل أدائها)</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {todayTimings.map((prayer) => {
              const isNext = nextPrayer?.name === prayer.name;
              const isCompleted = completedPrayers[prayer.name] || false;
              const isMandatory = prayer.name !== "Sunrise";

              return (
                <motion.div
                  key={prayer.name}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    if (isMandatory) {
                      playCounterSound();
                      togglePrayerCompleted(prayer.name);
                    }
                  }}
                  className={`bg-white dark:bg-slate-800 rounded-2xl p-4 border flex items-center justify-between transition-all cursor-pointer shadow-sm relative ${
                    isNext 
                      ? "active-prayer-card border-emerald-500 dark:bg-emerald-500/5" 
                      : isCompleted 
                        ? "border-emerald-100 dark:border-emerald-950/40 bg-slate-50/50 dark:bg-slate-900/30"
                        : "border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600"
                  }`}
                >
                  {/* Right block: Icon + Arabic Name */}
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      isNext 
                        ? "bg-emerald-500 text-white" 
                        : isCompleted 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500"
                    }`}>
                      {getIcon(prayer.icon, "w-5 h-5")}
                    </div>
                    <div>
                      <span className={`font-extrabold text-sm ${isNext ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"}`}>
                        {prayer.arabicName}
                      </span>
                      {isNext && (
                        <span className="mr-2 text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                          الآن
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Left block: Scheduled Time + Tracker Checkbox */}
                  <div className="flex items-center gap-4">
                    <span className="text-base font-mono font-bold text-slate-800 dark:text-slate-100">
                      {prayer.time}
                    </span>

                    {/* Mandatory prayers get a checkbox tracker */}
                    {isMandatory ? (
                      <div 
                        className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                            : "border-slate-300 dark:border-slate-600 hover:border-emerald-500"
                        }`}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    ) : (
                      <div className="w-5.5" /> // spacer for SunRise
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalatTab;
