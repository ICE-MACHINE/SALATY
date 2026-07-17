import React, { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Sparkles, Navigation } from "lucide-react";

export const QiblaCompass: React.FC = () => {
  const { qiblaAngle, location } = useApp();
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [simulatedHeading, setSimulatedHeading] = useState<number>(0);
  const [hasSensor, setHasSensor] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Listen to device orientation (mobile compass sensor)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading is a non-standard property supported by Safari iOS
      const heading = (e as any).webkitCompassHeading || e.alpha;
      if (heading !== undefined && heading !== null) {
        setDeviceHeading(heading);
        setHasSensor(true);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  const currentHeading = deviceHeading !== null ? deviceHeading : simulatedHeading;
  const targetAngle = (qiblaAngle - currentHeading + 360) % 360;
  
  // Alignment threshold (within 5 degrees is considered aligned)
  const isAligned = Math.abs(targetAngle) < 5 || Math.abs(targetAngle - 360) < 5;

  // Handle manual drag rotation for desktop/simulated experience
  const handleDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (hasSensor) return; // ignore manual drag if physical sensors are active
    
    const container = e.currentTarget.getBoundingClientRect();
    const centerX = container.left + container.width / 2;
    const centerY = container.top + container.height / 2;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    let angleDeg = (angleRad * 180) / Math.PI + 90; // offset to top
    if (angleDeg < 0) angleDeg += 360;
    
    setSimulatedHeading(Math.round(angleDeg));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">بوصلة القبلة التفاعلية</h3>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-6 max-w-xs leading-relaxed">
        {hasSensor 
          ? "البوصلة تستخدم مستشعرات جهازك لتحديد اتجاه القبلة بدقة. وجه هاتفك باتجاه الكعبة."
          : "اسحب حلقة البوصلة ودوّرها لتوجيه نفسك. الكعبة المشرفة تقع بزاوية " + Math.round(qiblaAngle) + "° من الشمال."}
      </p>

      {/* Compass Interactive Stage */}
      <div 
        className="relative w-64 h-64 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseMove={(e) => isDragging && handleDrag(e)}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={(e) => handleDrag(e)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* Background glow when aligned */}
        <AnimatePresence>
          {isAligned && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 0.15 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 bg-amber-400 dark:bg-amber-500 rounded-full blur-2xl"
            />
          )}
        </AnimatePresence>

        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-700 flex items-center justify-center">
          <div className="absolute top-2 text-xs font-bold text-rose-500">ش (N)</div>
          <div className="absolute right-2 text-xs font-bold text-slate-400">ق (E)</div>
          <div className="absolute bottom-2 text-xs font-bold text-slate-400">ج (S)</div>
          <div className="absolute left-2 text-xs font-bold text-slate-400">غ (W)</div>
        </div>

        {/* Rotating Compass Face */}
        <motion.div 
          style={{ rotate: -currentHeading }}
          className="w-48 h-48 rounded-full border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center shadow-inner relative"
        >
          {/* Compass ticks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <div 
              key={deg} 
              style={{ transform: `rotate(${deg}deg)` }}
              className="absolute inset-0 p-1 flex justify-center"
            >
              <div className={`w-0.5 rounded ${deg % 90 === 0 ? "h-3 bg-slate-400" : "h-1.5 bg-slate-200 dark:bg-slate-700"}`} />
            </div>
          ))}

          {/* North Needle Indicator */}
          <div className="absolute top-4 w-1 h-6 bg-rose-500 rounded-full" />
        </motion.div>

        {/* Qibla / Kaaba Needle Pointer */}
        <motion.div 
          animate={{ rotate: targetAngle }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {/* Elegant pointing arrow */}
          <div className="relative w-full h-full flex flex-col items-center">
            {/* Kaaba Symbol Icon at the top */}
            <div className="absolute top-8 flex flex-col items-center">
              <div className={`p-1.5 rounded-full shadow-md border ${isAligned ? "bg-amber-400 border-amber-300 text-slate-900 animate-bounce" : "bg-emerald-600 border-emerald-500 text-white"}`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded shadow-sm ${isAligned ? "bg-amber-100 text-amber-800" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                القبلة
              </span>
            </div>

            {/* Pointer Pin */}
            <div className="w-1.5 h-1/3 bg-emerald-500 rounded-full mt-20 shadow-md" />
          </div>
        </motion.div>

        {/* Compass Core Center Pin */}
        <div className="absolute w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-4 border-emerald-500 shadow-md flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        </div>
      </div>

      {/* Alignment status */}
      <div className="mt-6 flex flex-col items-center">
        {isAligned ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-sm bg-amber-50 dark:bg-amber-500/10 px-4 py-1.5 rounded-full"
          >
            <Navigation className="w-4 h-4 rotate-45 fill-current" />
            <span>أنت مواجه للقبلة تماماً!</span>
          </motion.div>
        ) : (
          <div className="text-slate-500 dark:text-slate-400 text-xs flex flex-col items-center gap-1">
            <span>انحراف البوصلة: <strong className="text-slate-700 dark:text-slate-300 font-bold">{Math.round(targetAngle)}°</strong></span>
            {!hasSensor && <span className="text-[10px] text-slate-400">(قم بتدوير الحلقة يدويًا للمحاكاة)</span>}
          </div>
        )}
      </div>
    </div>
  );
};
export default QiblaCompass;
