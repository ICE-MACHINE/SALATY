import React, { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { adhkarData } from "../data/adhkar";
import { DhikrItem, AdhkarCategory } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sun, 
  Moon, 
  Bed, 
  Heart, 
  Home, 
  Compass, 
  Award, 
  ChevronLeft, 
  RotateCcw, 
  Check, 
  Plus, 
  CheckCircle,
  HelpCircle
} from "lucide-react";


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 22
    }
  }
};

export const AdhkarTab: React.FC = () => {
  const { playCounterSound } = useApp();
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);
  const [categoriesState, setCategoriesState] = useState<AdhkarCategory[]>(adhkarData);

  // Load saved counts on component mount
  useEffect(() => {
    const saved = localStorage.getItem("salaty_adhkar_counts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Map saved counts to existing data structure safely
        const restored = adhkarData.map(cat => {
          const savedCat = parsed.find((s: any) => s.key === cat.key);
          if (savedCat) {
            return {
              ...cat,
              items: cat.items.map(item => {
                const savedItem = savedCat.items.find((si: any) => si.id === item.id);
                return savedItem ? { ...item, count: savedItem.count } : item;
              })
            };
          }
          return cat;
        });
        setCategoriesState(restored);
      } catch (err) {
        console.error("Error restoring adhkar counts:", err);
      }
    }
  }, []);

  // Save counts to LocalStorage when changed
  const saveCounts = (updated: AdhkarCategory[]) => {
    setCategoriesState(updated);
    localStorage.setItem("salaty_adhkar_counts", JSON.stringify(updated));
  };

  const getCategoryIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "Sun": return <Sun className={className} />;
      case "Moon": return <Moon className={className} />;
      case "Bed": return <Bed className={className} />;
      case "Heart": return <Heart className={className} />;
      case "Home": return <Home className={className} />;
      case "Compass": return <Compass className={className} />;
      case "Award": return <Award className={className} />;
      default: return <HelpCircle className={className} />;
    }
  };

  const activeCategory = categoriesState.find(c => c.key === activeCategoryKey);

  // Handle single Dhikr tap decrementing
  const handleDhikrTap = (itemId: number) => {
    if (!activeCategoryKey) return;
    
    playCounterSound();

    const updated = categoriesState.map(cat => {
      if (cat.key === activeCategoryKey) {
        return {
          ...cat,
          items: cat.items.map(item => {
            if (item.id === itemId && item.count > 0) {
              // Trigger lightweight haptic feedback if mobile
              if (window.navigator.vibrate) {
                window.navigator.vibrate(10);
              }
              return { ...item, count: item.count - 1 };
            }
            return item;
          })
        };
      }
      return cat;
    });

    saveCounts(updated);
  };

  // Reset a single category
  const resetCategory = (key: string) => {
    const updated = categoriesState.map(cat => {
      if (cat.key === key) {
        // Find original reference in original adhkarData to pull targets
        const original = adhkarData.find(o => o.key === key);
        if (original) {
          return {
            ...cat,
            items: cat.items.map(item => {
              const originalItem = original.items.find(oItem => oItem.id === item.id);
              return { ...item, count: originalItem ? originalItem.targetCount : item.targetCount };
            })
          };
        }
      }
      return cat;
    });
    saveCounts(updated);
  };

  // Compute category details
  const getCategoryProgress = (cat: AdhkarCategory) => {
    const total = cat.items.reduce((acc, curr) => acc + curr.targetCount, 0);
    const remaining = cat.items.reduce((acc, curr) => acc + curr.count, 0);
    const completed = total - remaining;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    const completedItems = cat.items.filter(item => item.count === 0).length;
    
    return {
      percentage,
      totalItems: cat.items.length,
      completedItems
    };
  };

  return (
    <div className="space-y-6 w-full mx-auto" dir="rtl">
      <AnimatePresence mode="wait">
        {activeCategoryKey === null ? (
          // VIEW 1: Categories Index Grid
          <motion.div
            key="categories-index"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="space-y-4"
          >
            <div className="px-1 flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400">تصنيفات الأذكار</h4>
              <span className="text-[10px] text-slate-400">اختر ورداً للمواظبة اليومية</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoriesState.map((category) => {
                const progress = getCategoryProgress(category);
                const isCompleted = progress.percentage === 100;
                
                return (
                  <motion.div
                    key={category.key}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, x: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setActiveCategoryKey(category.key)}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5 flex-1 pr-1">
                      {/* Icon */}
                      <div className={`p-3 rounded-2xl ${
                        isCompleted 
                          ? "bg-emerald-500 text-white" 
                          : "bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500"
                      }`}>
                        {getCategoryIcon(category.icon, "w-6 h-6")}
                      </div>

                      {/* Info & Progress */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                            {category.title}
                          </h4>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            {progress.completedItems} / {progress.totalItems}
                          </span>
                        </div>

                        {/* Custom Progress Bar */}
                        <div className="relative w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.percentage}%` }}
                            className={`h-full rounded-full ${
                              isCompleted ? "bg-emerald-500" : "bg-emerald-400 dark:bg-emerald-500/80"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <ChevronLeft className="w-5 h-5 text-slate-400 mr-2" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          // VIEW 2: Supplications detail list
          <motion.div
            key="category-detail-view"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="space-y-4 max-w-3xl mx-auto"
          >
            {/* Category Header Controls */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 rounded-2xl p-3.5 shadow-md border border-slate-100 dark:border-slate-700/50">
              <button 
                onClick={() => setActiveCategoryKey(null)}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs"
              >
                <ChevronLeft className="w-5 h-5 rotate-180" />
                <span>العودة للتصنيفات</span>
              </button>

              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                {activeCategory?.title}
              </h3>

              <button
                onClick={() => resetCategory(activeCategoryKey)}
                className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                title="إعادة ضبط عدادات القسم"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal Categories Navigation Strip */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 px-0.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 dir-rtl">
                {categoriesState.map((cat) => {
                  const isSelected = cat.key === activeCategoryKey;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => {
                        if (cat.key !== activeCategoryKey) {
                          playCounterSound();
                          setActiveCategoryKey(cat.key);
                        }
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors relative cursor-pointer select-none outline-none z-10 ${
                        isSelected
                          ? "text-white font-extrabold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {getCategoryIcon(cat.icon, `w-4.5 h-4.5 transition-colors duration-200 ${isSelected ? "text-white" : "text-slate-400 dark:text-slate-500"}`)}
                      <span>{cat.title}</span>
                      {isSelected && (
                        <motion.div
                          layoutId="activeAdhkarTabBg"
                          className="absolute inset-0 bg-emerald-500 rounded-xl shadow-md shadow-emerald-500/10 -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of Supplication Items */}
            <motion.div 
              key={activeCategoryKey}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3 max-h-[calc(100vh-270px)] overflow-y-auto pr-0.5"
            >
              {activeCategory?.items.map((item) => {
                const isFinished = item.count === 0;
                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileTap={!isFinished ? { scale: 0.99 } : {}}
                    onClick={() => !isFinished && handleDhikrTap(item.id)}
                    className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border transition-all select-none relative overflow-hidden ${
                      isFinished 
                        ? "border-emerald-100 dark:border-emerald-950 bg-slate-50/50 dark:bg-slate-900/30 opacity-70"
                        : "border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 cursor-pointer"
                    }`}
                  >
                    {/* Item Text in elegant Amiri style */}
                    <p className="font-serif text-lg text-slate-800 dark:text-slate-200 text-justify leading-loose mb-4">
                      {item.text}
                    </p>

                    {/* Footer Row: Actions & Counts */}
                    <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-700/50 pt-3">
                      <span className="text-[10px] text-slate-400">
                        {isFinished ? "اكتمل الورد" : "اضغط على البطاقة للتسبيح"}
                      </span>

                      {/* Circle count display badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          {item.targetCount - item.count} / {item.targetCount}
                        </span>

                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all ${
                          isFinished
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                        }`}>
                          {isFinished ? <Check className="w-4 h-4 stroke-[3]" /> : item.count}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdhkarTab;
