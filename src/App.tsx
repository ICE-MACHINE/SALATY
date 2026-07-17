import React from "react";
import { AppProvider, useApp } from "./contexts/AppContext";
import Header from "./components/Header";
import SalatTab from "./components/SalatTab";
import QuranTab from "./components/QuranTab";
import AdhkarTab from "./components/AdhkarTab";
import LocationTab from "./components/LocationTab";
import SettingsTab from "./components/SettingsTab";
import NotFound from "./components/NotFound";
import { motion, AnimatePresence } from "motion/react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

const RouteWrapper: React.FC<{
  children: React.ReactNode;
  tabName: string;
}> = ({ children, tabName }) => {
  return (
    <motion.div
      key={tabName}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const MainAppContent: React.FC = () => {
  const { setActiveTab, toast, setToast } = useApp();
  const location = useLocation();

  // تأثير واحد فقط: مزامنة المسار مع الحالة في Context (Route -> State)
  React.useEffect(() => {
    // استخراج اسم التبويب من المسار (تجاهل basename)
    const path =
      location.pathname.replace("/SALATY/", "").replace("/", "") || "salat";
    const validTabs = ["salat", "quran", "adhkar", "location", "settings"];

    if (validTabs.includes(path)) {
      setActiveTab(path as any);
    }
  }, [location.pathname, setActiveTab]);

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 15000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300 relative overflow-hidden">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.95 }}
            className="fixed top-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-emerald-600/95 dark:bg-emerald-700/95 backdrop-blur text-white rounded-2xl shadow-2xl shadow-emerald-500/10 p-5 z-[9999] flex flex-col gap-2 border border-emerald-400/30 font-sans cursor-pointer"
            dir="rtl"
            onClick={() => setToast(null)}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl animate-pulse">
                  🕌
                </div>
                <div>
                  <h4 className="font-bold text-base leading-tight">
                    {toast.title}
                  </h4>
                  <p className="text-xs opacity-90 mt-1 font-medium">
                    {toast.message}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setToast(null);
                }}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          {/* تم ربط Routes بالموقع الحالي لضمان عمل الانتقالات */}
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/salat" replace />} />
            <Route
              path="/salat"
              element={
                <RouteWrapper tabName="salat">
                  <SalatTab />
                </RouteWrapper>
              }
            />
            <Route
              path="/quran"
              element={
                <RouteWrapper tabName="quran">
                  <QuranTab />
                </RouteWrapper>
              }
            />
            <Route
              path="/adhkar"
              element={
                <RouteWrapper tabName="adhkar">
                  <AdhkarTab />
                </RouteWrapper>
              }
            />
            <Route
              path="/location"
              element={
                <RouteWrapper tabName="location">
                  <LocationTab />
                </RouteWrapper>
              }
            />
            <Route
              path="/settings"
              element={
                <RouteWrapper tabName="settings">
                  <SettingsTab />
                </RouteWrapper>
              }
            />
            <Route
              path="*"
              element={
                <RouteWrapper tabName="notfound">
                  <NotFound />
                </RouteWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/SALATY/">
        <MainAppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
