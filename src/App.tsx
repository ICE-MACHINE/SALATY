import './App.css'
import ModeProvider from './contexts/Mode/ModeProvider.tsx';
import Header from './components/Header';
import Salat from "./components/Salat.tsx";
import About from "./components/Aboutt.tsx";
import { Routes, Route, Navigate} from "react-router-dom";
import Quoran from "./components/Quoran.tsx";
function App() {
  return (
    <ModeProvider>
   <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Salat />} />
        <Route path="/about" element={<About />} />
        <Route path="/Quoran" element={<Quoran />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
    </ModeProvider>
  )
}

export default App
