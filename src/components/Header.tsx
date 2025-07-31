import "./Header.css";
import useMode from "../contexts/Mode/UseMode";
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import About from "./About.tsx";
import useWidth from "../contexts/Width/UseWidth";
import MenuIcon from '@mui/icons-material/Menu';
import ToggleModeButton from "./ToggleModeButton.tsx";
import CloseIcon from '@mui/icons-material/Close';
export default function Header() {
    const { mode } = useMode();
    const { width } = useWidth();
    const isMobile = width < 700; // Adjust the breakpoint as needed
    const [openMenu, setOpenMenu] = useState(false);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpenMenu(false);
            }
        };

        if (openMenu) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [openMenu]);
    return (
        <>
            {!isMobile ? (
                <header className={mode === "dark" ? "darkHeader desktop" : "lightHeader desktop"}>
                    <About open={open} handleClose={handleClose} />
                    <h1 onClick={handleOpen}>صلواتي</h1>
                    <ul >
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
                   <ToggleModeButton/>
                </header>
            ) : (
                <header className={mode === "dark" ? "darkHeader mobile" : "lightHeader mobile"}>
                    <About open={open} handleClose={handleClose} />
                   {!openMenu&&<MenuIcon onClick={() => setOpenMenu(true)} style={{ cursor: 'pointer', fontSize: '2rem' }}/>}
                   <nav>
                    {openMenu && (
                        <>
                            <div 
                                className={`mobile-menu-overlay ${openMenu ? 'show' : ''}`}
                                onClick={() => setOpenMenu(false)}
                            />
                            <div className={`mobile-menu ${mode === 'dark' ? 'dark' : 'light'} ${openMenu ? 'open' : ''}`}>
                                <button onClick={() => setOpenMenu(false)} className="close-menu">
                                    <CloseIcon style={{ fontSize: '2rem' }} />
                                </button>
                              <div style={{paddingTop:"20px", width:"100%",display:"flex",justifyContent:"space-around",alignItems:"center"}}>
                                  <h1 style={{display:"inline"}} onClick={() => {
                                    handleOpen();
                                    setOpenMenu(false);
                                }}>صلواتي</h1>
                                   <button onClick={() => {
                                    setOpenMenu(false);
                                }}>
                                  <ToggleModeButton />
                                </button>
                               
                              </div>
                                <ul >
                                    <li>
                                        <NavLink 
                                            to="/" 
                                            className={({ isActive }) => isActive ? "link active" : "link"}
                                            onClick={() => setOpenMenu(false)}
                                        >
                                            الصلاة
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/Quoran" 
                                            className={({ isActive }) => isActive ? "link active" : "link"}
                                            onClick={() => setOpenMenu(false)}
                                        >
                                            القرآن
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/about" 
                                            className={({ isActive }) => isActive ? "link active" : "link"}
                                            onClick={() => setOpenMenu(false)}
                                        >
                                            الأذكار
                                        </NavLink>
                                    </li>
                                </ul>
                              
                            </div>
                        </>
                    )}
                   </nav>
                    <ul style={{minWidth:"80%"}}>
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
                </header>
            )}
        </>
    );
}