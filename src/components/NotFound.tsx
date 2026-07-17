import React from "react";
import { motion } from "motion/react";
import { SalatyLogo } from "./Header";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveTab } = useApp();

  const handleReturn = () => {
    setActiveTab("salat");
    navigate("/salat");
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-md mx-auto text-center space-y-6" dir="rtl">
      
      {/* Animated Glowing Logo Wrapper */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 relative"
      >
        <SalatyLogo className="w-14 h-14 text-white" />
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full animate-pulse" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-4xl font-extrabold text-emerald-500 font-mono">404</h2>
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">الصفحة المطلوبة غير موجودة!</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
          عذراً، يبدو أنك وصلت لصفحة غير صحيحة أو تم تعديل الرابط الخاص بها. دعنا نرشدك للعودة إلى الطريق الصحيح.
        </p>
      </div>

      <div className="w-full pt-2">
        <button
          onClick={handleReturn}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          العودة للوحة مواقيت الصلاة
        </button>
      </div>
    </div>
  );
};

export default NotFound;
