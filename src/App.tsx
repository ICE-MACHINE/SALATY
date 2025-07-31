import './App.css'
import ModeProvider from './contexts/Mode/ModeProvider.tsx';
import Header from './components/Header';
import Salat from "./components/Salat.tsx";
import About from "./components/Aboutt.tsx";
import { Routes, Route, Navigate} from "react-router-dom";
import Quoran from "./components/Quoran.tsx";
import useMode from "./contexts/Mode/UseMode.tsx";
import WidthProvider from './contexts/Width/WidthProvider.tsx';
import useWidth from "./contexts/Width/UseWidth.tsx";
import MarkedSoraProvider from './contexts/MarkedSora/MarkedSoraProvider.tsx';
function App() {
  return (
    <ModeProvider>
      <WidthProvider>
        <MarkedSoraProvider>
          <InnerApp />
        </MarkedSoraProvider>
      </WidthProvider>
    </ModeProvider>
  )
}
function InnerApp(){
  const { mode } = useMode();
  const { width } = useWidth();
  const isMobile = width < 700; // Adjust the breakpoint as needed
  return (
    <div className={mode === 'dark' ? 'App dark-mode' : 'App light-mode'}>
      <Header />
      <div className={isMobile ? 'container mobile-container' : 'container desktop-container'}>
      <Routes>
        <Route path="/" element={<Salat />} />
        <Route path="/about" element={<About />} />
        <Route path="/Quoran" element={<Quoran />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
    </div>
  );
}
export default App
