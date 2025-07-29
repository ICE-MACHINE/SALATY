import "./Header.css";
import useMode from "../contexts/Mode/UseMode";
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import About from "./About.tsx";
export default function Header() {
    const { mode, toggleMode } = useMode();
      const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);

    return (
        
        <header className={mode === "dark" ? "dark-header" : ""}>
            <About open={open} handleClose={handleClose} />
            <h1 onClick={handleOpen}>صلواتي</h1>
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? "link active" : "link"}>الصلاة</NavLink>
                    </li>
                    <li>
                    <NavLink to="/Quoran" className={({ isActive }) => isActive ? "link active" : "link"}>القرآن</NavLink>
                    </li>
                    <li>
                    <NavLink to="/about" className={({ isActive }) => isActive ? "link active" : "link"}>الأذكار</NavLink>
                </li>
            </ul>
            <button onClick={toggleMode}>
                {mode === 'light' ? '🌙' : '☀️'}
            </button>

        </header>
       
        
    );
}