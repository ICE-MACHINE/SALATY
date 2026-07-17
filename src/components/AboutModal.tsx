import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Code2, Globe, Github } from "lucide-react";
import { SalatyLogo } from "./Header";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          {/* Modal Panel Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-sm relative overflow-hidden z-10 space-y-4 text-center"
          >
            {/* Top decorative circle glow */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

            <button 
              onClick={onClose}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Icon / Logo Emblem */}
            <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white mt-4 relative">
              <SalatyLogo className="w-10 h-10 text-white" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
            </div>

            {/* App title */}
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">صلاتي &bull; SALATY</h2>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">بوابة العبادة اليومية المتكاملة</p>
            </div>

            {/* App description in Arabic */}
            <div className="text-slate-500 dark:text-slate-300 text-xs leading-relaxed space-y-2 py-2 border-y border-slate-100 dark:border-slate-700/50">
              <p>
                شكراً لوضع ثقتك في تطبيق <strong>صلاتي</strong>. لقد تم تطوير هذا الإصدار الجديد لتقديم تجربة مستخدم سريعة، تفاعلية، متوافقة كلياً مع معايير الويب الحديثة والأجهزة الذكية.
              </p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                ساهم في نشر الموقع لتكون صدقة جارية لك ولنا إن شاء الله.
              </p>
            </div>

            {/* Architectural Info Credits */}
            <div className="space-y-2 text-right">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">هيكلية التطبيق الحديثة</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl flex items-center gap-1.5 border border-slate-100 dark:border-slate-800/60">
                  <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">React + TS + Vite</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl flex items-center gap-1.5 border border-slate-100 dark:border-slate-800/60">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Tailwind v4 CSS</span>
                </div>
              </div>
            </div>

            {/* Heartcrafted Footer credits */}
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-2">
              <span>صُنع بحب وعناية فائقة</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>لأمتنا الإسلامية</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;
