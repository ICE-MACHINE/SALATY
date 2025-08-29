import Grid from '@mui/material/Grid';
import useMode from "../contexts/Mode/UseMode";
import useWidth from "../contexts/Width/UseWidth.tsx";
import EditIcon from '@mui/icons-material/Edit';
import EditModal from "./HandelEdit";
import { useState, useEffect } from 'react';
import { getBackgroundColor, getTextColor } from '../styles/colors';
import useMissedSalat from "../functions/missedSalat"; // adjust path if you placed it elsewhere
import useLocation from '../contexts/Location/UseLocation.tsx';
export default function Salat(){
    const { mode } = useMode();
    const { width } = useWidth();
    const isMobile = width < 700;
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [salat,setSalat] = useState<"fajr" | "dhuhr" | "asr" | "maghrib" | "ishaa">("fajr");
    const [time, setTime] = useState(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            .replace('AM', 'ص')
            .replace('PM', 'م')
    );
    const { place } = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(
                new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    .replace('AM', 'ص')
                    .replace('PM', 'م')
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const salatStyle={
        padding: '10px',
        borderRadius: '20px',
        width: '80%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        color: getTextColor(mode),
        background: getBackgroundColor(mode),

    }
    const hStyle: React.CSSProperties = {
        padding: '0',
        margin: '0',
        textAlign: 'center' as const,
        fontSize: isMobile ? '1em' : '1.2em',

    }
    const cardStyle: React.CSSProperties = {
        minWidth: '30%',
        width: isMobile ? '100%' : '50%',
        height: '100%',
        display: 'flex',
        padding:"5px",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: getBackgroundColor(mode),
        color: getTextColor(mode),
        borderRadius: '10px',
    }
    // given you have the time string (e.g. "04:30")
    const isFajrMissed = useMissedSalat("04:30");
    return(
   <div style={{ width: '100vw',height:"calc(100vh - 60px)",overflowY:"auto" }}>
      <Grid container spacing={2} mb={3} p={3} sx={{color:getTextColor(mode)}}>

        <Grid size={isMobile? 12 : 6}
         sx={{
            display: 'flex', justifyContent: 'start', alignItems: 'end'
       }}
        >
            <div style={cardStyle}>
                <h4 style={hStyle}  >
                     الجمعة
                     <span style={{ fontSize: isMobile?'0.8em':"1em",  }}>  01/01/2026</span>  
                     </h4>
                <h5 style={hStyle}>    01/01/1147</h5>
            </div>
        </Grid>

       <Grid size={isMobile ? 12 : 6}
       sx={{
            display: 'flex', justifyContent: 'end', alignItems: 'end'
       }}
       >
        <div style={cardStyle}>
            <h4 style={hStyle}>
                  مدينة {place}
            </h4>
            <h5 style={hStyle}>
            {time}
            </h5>
        </div>
       </Grid>
      
       
      
      </Grid>
        <Grid sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }} container spacing={2}>
            <Grid 
             sx={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center" ,
                opacity: isFajrMissed? "0.7":"1"
                }} size={10}>
                <div style={salatStyle} >
                    <h4 style={hStyle}>الفجر</h4>
                    <h5 style={hStyle}>04:30</h5>
                    <EditIcon onClick={() =>{ 
                        setSalat("fajr");
                        setOpen(true)
                       } } style={{ cursor: 'pointer', color: getTextColor(mode) }} />
                    
                </div>
            </Grid>
            <Grid sx={{display:"flex",justifyContent:"center",alignItems:"center" }} size={10}>
                <div style={salatStyle}>
                    <h4 style={hStyle}>الظهر</h4>
                    <h5 style={hStyle}>12:00</h5>
                    <EditIcon onClick={() => {
                        setSalat("dhuhr");
                        setOpen(true);
                    }} style={{ cursor: 'pointer', color: getTextColor(mode) }} />

                </div>
            </Grid>
            <Grid sx={{display:"flex",justifyContent:"center",alignItems:"center" }} size={10}>
                <div style={salatStyle}>
                    <h4 style={hStyle}>العصر</h4>
                    <h5 style={hStyle}>15:30</h5>
                    <EditIcon onClick={() => {
                        setSalat("asr");
                        setOpen(true);
                    }} style={{ cursor: 'pointer', color: getTextColor(mode) }} />
                </div>
            </Grid>
            <Grid  sx={{display:"flex",justifyContent:"center",alignItems:"center" }} size={10}>
                <div style={salatStyle}>
                    <h4 style={hStyle}>المغرب</h4>
                    <h5 style={hStyle}>18:00</h5>
                    <EditIcon onClick={() => {
                        setSalat("maghrib");
                        setOpen(true);
                    }} style={{ cursor: 'pointer', color: getTextColor(mode) }} />

                </div>
            </Grid>
            <Grid sx={{display:"flex",justifyContent:"center",alignItems:"center" }} size={10}>
                <div style={salatStyle}>
                    <h4 style={hStyle}>العشاء</h4>
                    <h5 style={hStyle}>19:30</h5>
                    <EditIcon onClick={() => {
                        setSalat("ishaa");
                        setOpen(true);
                    }} style={{ cursor: 'pointer', color: getTextColor(mode) }} />
                </div>
            </Grid>
        </Grid>
        <EditModal salat={salat} open={open} handleClose={handleClose} />
    </div>
    )
}