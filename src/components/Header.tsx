import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import AboutModal from "./AboutModal";
import { motion } from "motion/react";
import {
  Clock,
  BookOpen,
  Heart,
  Compass,
  Sun,
  Moon,
  Info,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
export const SalatyLogo: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Circle Frame Background Glow */}
    <circle cx="50" cy="50" r="44" fill="currentColor" fillOpacity="0.08" />

    {/* Outer Circle Ring */}
    <circle
      cx="50"
      cy="50"
      r="44"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeDasharray="3 3"
    />

    {/* Inner Smooth Circle Ring */}
    <circle
      cx="50"
      cy="50"
      r="39"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.8"
    />

    {/* Mosque Dome Silhouette */}
    <path
      d="M34 50 C34 40 42 36 42 31 C42 26 46 23 50 23 C54 23 58 26 58 31 C58 36 66 40 66 50 Z"
      fill="currentColor"
      fillOpacity="0.85"
    />

    {/* Crescent Moon on top of Dome */}
    <path
      d="M50 10 C53 10 55.5 12.5 55.5 15.5 C55.5 18.5 53 21 50 21 C51.8 20.2 53 18.2 53 15.5 C53 12.8 51.8 10.8 50 10 Z"
      fill="currentColor"
    />
    <line
      x1="50"
      y1="18"
      x2="50"
      y2="23"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Open Quran Book */}
    <path
      d="M50 56 C42 50 32 50 22 56 L22 68 C32 62 42 62 50 68 C58 62 68 62 78 68 L78 56 C68 50 58 50 50 56 Z"
      fill="currentColor"
    />

    {/* Book Pages Highlights / Text Line Accents */}
    <path
      d="M26 59 Q34 56 42 59 M26 63 Q34 60 42 63 M58 59 Q66 56 74 59 M58 63 Q66 60 74 63"
      stroke="var(--color-slate-100, #f8fafc)"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.9"
    />

    {/* Rehal Stand */}
    <path
      d="M44 68 L36 76 M56 68 L64 76"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Header: React.FC = () => {
  const { mode, toggleMode, activeTab } = useApp();
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const tabs = [
    { id: "salat", label: "مواقيت الصلاة", icon: Clock },
    { id: "quran", label: "القرآن الكريم", icon: BookOpen },
    { id: "adhkar", label: "الأذكار والورد", icon: Heart },
    { id: "location", label: "القبلة والموقع", icon: Compass },
    { id: "settings", label: "الاعدادات", icon: Settings },
  ] as const;
  const handleTabClick = (id: string) => {
    navigate(`/${id}`);
  };

  return (
    <>
      {/* 1. DESKTOP HEADER (Hidden on mobile) */}
      <header className="hidden md:block sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <div
            onClick={() => setIsAboutOpen(true)}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <SalatyLogo className="w-6.5 h-6.5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-slate-800 dark:text-slate-100 leading-none">
                صلاتي
              </h1>
              <span className="text-[9px] text-slate-400 font-mono tracking-wider">
                SALATY APP
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-100/50 dark:border-slate-800/40">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-2 cursor-pointer rounded-xl text-xs font-bold flex items-center gap-2 transition-all relative ${
                    isActive
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktop-active-tab-indicator"
                      className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Controls */}
          <div className="flex items-center gap-2.5">
            {/* Mode Switcher */}
            <button
              onClick={toggleMode}
              className="p-2.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-all"
              title={mode === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
            >
              {mode === "dark" ? (
                <Sun className="w-4.5 h-4.5 text-amber-500" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </button>

            {/* About trigger */}
            <button
              onClick={() => setIsAboutOpen(true)}
              className="p-2.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-all"
              title="حول التطبيق"
            >
              <Info className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MOBILE HEADER & BOTTOM NAV BAR (Hidden on desktop) */}
      <div className="md:hidden">
        {/* Top Mini Header Bar */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 h-14 flex items-center justify-between transition-all">
          <div
            onClick={() => setIsAboutOpen(true)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <SalatyLogo className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 font-sans">
              صلاتي
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <button
              onClick={toggleMode}
              className="p-2 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400"
            >
              {mode === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Info trigger */}
            <button
              onClick={() => setIsAboutOpen(true)}
              className="p-2 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Floating Bottom Nav Rail */}
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800/80 px-3 pb-safe-bottom h-16 flex items-center justify-around shadow-lg shadow-slate-900/10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            // Format labels to fit on tiny screens
            const shortLabel =
              tab.id === "salat"
                ? "الصلاة"
                : tab.id === "quran"
                  ? "القرآن"
                  : tab.id === "adhkar"
                    ? "الأذكار"
                    : tab.id === "location"
                      ? "القبلة"
                      : "الإعدادات";

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-tab-dot"
                    className="absolute -top-0 w-5 h-1 bg-emerald-500 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`}
                />
                <span className="text-[10px] leading-none">{shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Shared About Modal Overlays */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};

export default Header;
