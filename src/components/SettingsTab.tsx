import React from "react";
import { useApp, RemindersConfig } from "../contexts/AppContext";
import { 
  Bell, 
  Volume2, 
  Clock, 
  Sun, 
  Moon, 
  BookOpen, 
  Sparkles, 
  Check, 
  Settings,
  Heart,
  HelpCircle,
  Eye
} from "lucide-react";

export const SettingsTab: React.FC = () => {
  const {
    notificationsEnabled,
    setNotificationsEnabled,
    remindersConfig,
    updateReminderConfig,
    playSpiritualSound,
    quranFont,
    setQuranFont,
    mode,
    toggleMode,
    quranBrightness,
    setQuranBrightness,
    comfortReading,
    setComfortReading,
  } = useApp();

  const handleTogglePrayer = (prayerKey: keyof RemindersConfig) => {
    playSpiritualSound();
    updateReminderConfig(prayerKey, !remindersConfig[prayerKey]);
  };

  const prayers = [
    { key: "prayFajr", name: "الفجر", desc: "تنبيه قبل صلاة الفجر بـ 5 دقائق" },
    { key: "prayDhuhr", name: "الظهر", desc: "تنبيه قبل صلاة الظهر بـ 5 دقائق" },
    { key: "prayAsr", name: "العصر", desc: "تنبيه قبل صلاة العصر بـ 5 دقائق" },
    { key: "prayMaghrib", name: "المغرب", desc: "تنبيه قبل صلاة المغرب بـ 5 دقائق" },
    { key: "prayIsha", name: "العشاء", desc: "تنبيه قبل صلاة العشاء بـ 5 دقائق" },
  ] as const;

  const spiritualReminders = [
    { 
      key: "morningAdhkar", 
      title: "أذكار الصباح", 
      desc: "تنبيه بعد شروق الشمس بـ 20 دقيقة لتلاوة الأذكار اليومية", 
      icon: Sun,
      color: "bg-amber-500/10 text-amber-500"
    },
    { 
      key: "eveningAdhkar", 
      title: "أذكار المساء", 
      desc: "تنبيه بعد صلاة العصر بـ 25 دقيقة لحفظ وورد المساء", 
      icon: Moon,
      color: "bg-indigo-500/10 text-indigo-500"
    },
    { 
      key: "postPrayerAdhkar", 
      title: "أذكار بعد الصلاة", 
      desc: "تذكير بقراءة أذكار الصلاة عقب الصلوات المفروضة", 
      icon: Clock,
      color: "bg-teal-500/10 text-teal-500"
    },
    { 
      key: "quranReminders", 
      title: "ورد القرآن الكريم", 
      desc: "تذكير يومي مبارك لقراءة القرآن (10:00 صباحاً و 9:30 مساءً)", 
      icon: BookOpen,
      color: "bg-emerald-500/10 text-emerald-500"
    },
    { 
      key: "randomTasbeeh", 
      title: "أذكار وتسابيح عامة", 
      desc: "تنبيهات عشوائية مفرّقة طوال اليوم بأذكار وأدعية مأثورة", 
      icon: Sparkles,
      color: "bg-rose-500/10 text-rose-500"
    }
  ] as const;

  return (
    <div id="settings-container" className="space-y-6 w-full mx-auto pb-12" dir="rtl">
      
      {/* Title & Header Section */}
      <div className="text-right">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-500 animate-spin-slow" />
          <span>إعدادات التنبيهات</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          قم بتخصيص التنبيهات الصوتية والإشعارات الذكية لمواقيت الصلاة والعبادات اليومية.
        </p>
      </div>

      {/* Main Master Toggle Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/15">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 animate-pulse" />
              <span>نظام الإشعارات الذكي</span>
            </h3>
            <p className="text-xs text-emerald-100 font-medium">
              تفعيل كافة الإشعارات والتنبيهات الصوتية في التطبيق.
            </p>
          </div>
          <button
            onClick={() => {
              playSpiritualSound();
              setNotificationsEnabled(!notificationsEnabled);
            }}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              notificationsEnabled ? "bg-white" : "bg-emerald-700/60"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-emerald-600 shadow-md ring-0 transition duration-200 ease-in-out ${
                notificationsEnabled ? "-translate-x-5 bg-emerald-600" : "translate-x-0 bg-white"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Quran Font Customization Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-md space-y-4 text-right">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>تخصيص خطوط القرآن الكريم</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            اختر الخط العربي المناسب لك لقراءة مريحة وواضحة لآيات الذكر الحكيم في صفحة القرآن الكريم.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "amiri", name: "خط أميري (الأميري)", desc: "خط كلاسيكي وتقليدي فخم", style: "font-serif" },
            { id: "scheherazade", name: "خط شهرزاد (Scheherazade)", desc: "خط نَسْخ واضح وسهل القراءة", style: "font-scheherazade" },
            { id: "cairo", name: "خط القاهرة (Cairo)", desc: "خط حديث وأنيق وعصري", style: "font-sans" },
          ].map((f) => {
            const isSelected = quranFont === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  playSpiritualSound();
                  setQuranFont(f.id);
                }}
                className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between h-28 cursor-pointer relative ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/25 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-50"
                    : "border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div>
                  <h4 className="text-xs font-extrabold">{f.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{f.desc}</p>
                </div>
                {/* Font Demo Preview */}
                <div className={`text-xl font-bold self-end ${f.style} mt-2 text-emerald-600 dark:text-emerald-400`}>
                  الْقُرْآنُ الْكَرِيمُ
                </div>
                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-2 left-2 p-1 bg-emerald-500 rounded-full text-white">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* App Appearance & Reading Comfort Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-md space-y-4 text-right">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>مظهر التطبيق وراحة العين</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            تحكم في نمط الألوان، ومستوى سطوع قراءة آيات الذكر الحكيم، بالإضافة إلى ميزة حماية العين ليلاً. يتم حفظ هذه الخيارات تلقائياً.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Theme Switcher Button Group */}
          <div className="space-y-2 bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">نمط ألوان التطبيق</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (mode !== "light") {
                    playSpiritualSound();
                    toggleMode();
                  }
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  mode === "light"
                    ? "border-amber-500 bg-amber-50/40 text-amber-600 font-extrabold"
                    : "border-slate-250 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>نهاري</span>
              </button>
              <button
                onClick={() => {
                  if (mode !== "dark") {
                    playSpiritualSound();
                    toggleMode();
                  }
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  mode === "dark"
                    ? "border-indigo-500 bg-indigo-950/20 text-indigo-400 font-extrabold"
                    : "border-slate-250 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>ليلي</span>
              </button>
            </div>
          </div>

          {/* Brightness Level Slider */}
          <div className="space-y-2 bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500">سطوع صفحة القراءة</span>
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
              className="w-full accent-emerald-500 h-1.5 bg-slate-150 dark:bg-slate-700 rounded-lg cursor-pointer mt-1"
            />
          </div>

          {/* Comfort Reading Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-850">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${comfortReading ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-slate-700 dark:text-slate-300">وضع القراءة المريحة</h5>
                <p className="text-[9px] text-slate-400">حماية العين باللون الدافئ (Sepia)</p>
              </div>
            </div>
            <button
              onClick={() => {
                playSpiritualSound();
                setComfortReading(!comfortReading);
              }}
              className={`w-9 h-5 rounded-full transition-colors relative outline-none cursor-pointer ${
                comfortReading ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-750"
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

      {notificationsEnabled ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Right Column (larger weight for spiritual/long descriptions) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 2: Spiritual Reminders (Adhkar, Quran, etc.) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-md space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-500" />
                  <span>الأذكار والعبادات اليومية</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  تذكيرات صوتية هادئة مخصصة لحفظ أوقات الأذكار والورد اليومي للقرآن الكريم.
                </p>
              </div>

              <div className="space-y-3">
                {spiritualReminders.map((sr) => {
                  const isEnabled = remindersConfig[sr.key];
                  const IconComponent = sr.icon;
                  return (
                    <div 
                      key={sr.key}
                      className="flex justify-between items-center bg-slate-50/60 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${sr.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{sr.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5">{sr.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTogglePrayer(sr.key)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isEnabled ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isEnabled ? "-translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Left Column (shorter width for timings list & demo play) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Section 1: Prayer warnings (5 mins before each) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-md space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>تنبيهات ما قبل الصلاة (بـ 5 دقائق)</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  تنبيه صوتي هادئ وإشعار قبل دخول وقت كل صلاة لتستعد وتتهيأ لها.
                </p>
              </div>

              <div className="space-y-3">
                {prayers.map((p) => {
                  const isEnabled = remindersConfig[p.key];
                  return (
                    <div 
                      key={p.key}
                      className="flex justify-between items-center bg-slate-50/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{p.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5">{p.desc}</p>
                      </div>
                      <button
                        onClick={() => handleTogglePrayer(p.key)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isEnabled ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isEnabled ? "-translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sound Demo Panel */}
            <div className="bg-slate-100/60 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-150 dark:border-slate-800 flex flex-col justify-between items-center gap-4">
              <div className="flex items-center gap-3 w-full">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">نغمة التنبيه الروحانية</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5">استمع لتجربة نغمة التنبيه الهادئة والمريحة للأعصاب.</p>
                </div>
              </div>
              <button
                onClick={() => playSpiritualSound()}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition-all shadow-sm"
              >
                🔊 تجربة نغمة التنبيه
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
          <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">نظام الإشعارات معطل حالياً</h4>
          <p className="text-xs text-slate-500 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
            قم بتفعيل "نظام الإشعارات الذكي" في الأعلى لتتمكن من ضبط وتخصيص تنبيهات مواقيت الصلاة والأذكار اليومية.
          </p>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
