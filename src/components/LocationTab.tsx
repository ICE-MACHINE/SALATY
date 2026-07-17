import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import MapComponent from "./Map";
import QiblaCompass from "./Compass";
import { motion } from "motion/react";
import { Search, MapPin, Compass, HelpCircle, X, Loader2 } from "lucide-react";

export const LocationTab: React.FC = () => {
  const { location, searchLocation } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchStatus, setSearchStatus] = useState<"idle" | "error" | "success">("idle");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchStatus("idle");
    
    const success = await searchLocation(searchQuery.trim());
    setIsSearching(false);
    
    if (success) {
      setSearchStatus("success");
      setSearchQuery("");
    } else {
      setSearchStatus("error");
    }
  };

  return (
    <div className="space-y-6 w-full mx-auto" dir="rtl">
      {/* Search Bar Block */}
      <div className="space-y-2">
        <form 
          onSubmit={handleSearch}
          className="bg-white dark:bg-slate-800 rounded-2xl p-1.5 shadow-md border border-slate-100 dark:border-slate-700/50 flex items-center gap-2"
        >
          <div className="p-2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مدينة (مثلاً: مكة، القاهرة)..."
            className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 dark:text-slate-100 pr-1 placeholder:text-slate-400 py-1.5"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            {isSearching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>بحث</span>
            )}
          </button>
        </form>

        {searchStatus === "error" && (
          <p className="text-[10px] text-rose-500 font-bold px-2">عذراً، لم نتمكن من العثور على موقع بهذا الاسم. يرجى محاولة كتابة اسم أوضح.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Map Segment Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-xl border border-slate-100 dark:border-slate-700/50 space-y-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">حدد موقعك على الخريطة</h3>
              </div>
              <span className="text-[10px] text-slate-400">(اضغط على أي مكان أو اسحب الدبوس)</span>
            </div>

            {/* Map Container View */}
            <div className="w-full h-80 rounded-2xl overflow-hidden shadow-inner">
              <MapComponent />
            </div>

            {/* Current Coordinates Banner */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-100 dark:border-slate-800/40 flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">موقعك الحالي:</span>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 text-left leading-tight truncate max-w-[220px]">
                {location.place}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Qibla compass & instructions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Qibla Direction Compass Widget */}
          <QiblaCompass />

          {/* Help Instructions Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-start gap-3">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 text-slate-500 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">لماذا يحتاج التطبيق لموقعي؟</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                مواقيت الصلاة واتجاه القبلة تعتمد اعتماداً كلياً على موقعك الجغرافي (خطوط الطول والعرض). تحديد الموقع بدقة يضمن صحة مواقيت فجر وعشاء وظهر صلواتك واتجاه الكعبة المشرفة. يتم حفظ الموقع محلياً على جهازك فقط.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTab;
