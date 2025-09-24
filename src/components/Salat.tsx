import Grid from '@mui/material/Grid';
import useMode from "../contexts/Mode/UseMode";
import useWidth from "../contexts/Width/UseWidth.tsx";
// @ts-ignore: module '@mui/icons-material/Edit' has no declaration file
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from 'react';
import { getBackgroundColor, getTextColor } from '../styles/colors';
import useMissedSalat from "../functions/missedSalat"; // adjust path if you placed it elsewhere
import useLocation from '../contexts/Location/UseLocation.tsx';
import useSalat from "../contexts/Salat/UseSalat";
export default function Salat(){
    const { mode } = useMode();
    const { width } = useWidth();
    const isMobile = width < 700;
    const [time, setTime] = useState(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            .replace('AM', 'ص')
            .replace('PM', 'م')
    );
    const { place } = useLocation();
    const salatData: any = useSalat();

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
        width: '100%',
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
                     {salatData?.todayDate.day || "اليوم"}
                     <span style={{ fontSize: isMobile?'0.8em':"1em",  }}>{salatData?.todayDate.gregorian || "01-01-2000"}</span>  
                     </h4>
                <h5 style={hStyle}>    {salatData?.todayDate.hijri || "01-01-1400"}</h5>
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
                border: useMissedSalat(salatData?.todayTimings.find((s: any) => s.salatName === "Fajr")?.salatTime) ? "none" : "2px solid #4CAF50",
                borderRadius: "20px",
                }} size={10}>
                <div style={salatStyle} >
                    <h4 style={hStyle}>الفجر</h4>
                    <h5 style={hStyle}>{salatData?.todayTimings.find((s: any) => s.salatName === "Fajr")?.salatTime || "04:30"}</h5>
                    
                </div>
            </Grid>
            <Grid 
             sx={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center" ,
                border: useMissedSalat(salatData?.todayTimings.find((s: any) => s.salatName === "Dhuhr")?.salatTime) ? "none" : "2px solid #4CAF50",
                borderRadius: "20px",
                }} 
            size={10}>
                <div style={salatStyle}>
                    <h4 style={hStyle}>الظهر</h4>
                    <h5 style={hStyle}>{salatData?.todayTimings.find((s: any) => s.salatName === "Dhuhr")?.salatTime || "12:55"}</h5>

                </div>
            </Grid>
            <Grid 
             sx={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center" ,
                border: useMissedSalat(salatData?.todayTimings.find((s: any) => s.salatName === "Asr")?.salatTime) ? "none" : "2px solid #4CAF50",
                borderRadius: "20px",
                }} 
            size={10}>
                <div style={salatStyle}>
                    <h4 style={hStyle}>العصر</h4>
                    <h5 style={hStyle}>{salatData?.todayTimings.find((s: any) => s.salatName === "Asr")?.salatTime || "16:30"}</h5>
                   
                </div>
            </Grid>
            <Grid 
             sx={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center" ,
                border: useMissedSalat(salatData?.todayTimings.find((s: any) => s.salatName === "Maghrib")?.salatTime) ? "none" : "2px solid #4CAF50",
                borderRadius: "20px",
                }} 
              size={10}>
                <div style={salatStyle}>
                    <h4 style={hStyle}>المغرب</h4>
                    <h5 style={hStyle}>{salatData?.todayTimings.find((s: any) => s.salatName === "Maghrib")?.salatTime || "19:30"}</h5>
                   

                </div>
            </Grid>
            <Grid
             sx={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center" ,
                border: useMissedSalat(salatData?.todayTimings.find((s: any) => s.salatName === "Isha")?.salatTime) ? "none" : "2px solid #4CAF50",
                borderRadius: "20px",
                }} 
              size={10}>
                <div style={salatStyle}>
                    <h4 style={hStyle}>العشاء</h4>
                  <h5 style={hStyle}>{salatData?.todayTimings.find((s: any) => s.salatName === "Isha")?.salatTime || "21:00"}</h5>
                </div>
            </Grid>
        </Grid>
    </div>
    )
}