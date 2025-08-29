import {useState,useEffect } from 'react';
import WidthContext from './WidthContext.tsx';
const WidthProvider = ({ children }: { children: React.ReactNode }) => {
    const [width, setWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <WidthContext.Provider value={{ width, setWidth }}>
            {children}
        </WidthContext.Provider>
    );
};

export default WidthProvider;
