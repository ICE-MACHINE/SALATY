import Grid from '@mui/material/Grid';
import useMode from "../contexts/Mode/UseMode";
import EditIcon from '@mui/icons-material/Edit';
import EditModal from "./HandelEdit";
import { useState, useEffect } from 'react';
export default function Salat(){
    const { mode } = useMode();
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [salat,setSalat] = useState<"fajr" | "dhuhr" | "asr" | "maghrib" | "ishaa">("fajr");
    const [time, setTime] = useState(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            .replace('AM', 'ص')
            .replace('PM', 'م')
    );

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
        backgroundColor: mode === 'dark' ? '#3335' : '#eee5',
        color: mode === 'dark' ? '#fff' : '#000',
    }
    const hStyle: React.CSSProperties = {
        padding: '0',
        margin: '0',
        textAlign: 'center' as const,
    }
    return(
   <div style={{ width: '100vw',height:"calc(100vh - 60px)",marginTop:"60px" }}>
      <Grid container spacing={2} mb={3} p={3}>
    
        <Grid size={4}>
            <div>
                <h2>التوقيت الميلادي</h2>
                <h3>01/01/2026</h3>
            </div>
        </Grid>
       
       <Grid size={4}>
        <div>
            <h2>
                مواقيت الصلاة لمدينة الرياض
            </h2>
            <h3>
            {time}
            </h3>
        </div>
       </Grid>
        <Grid size={4}>
            <div>
                <h2>التوقيت الهجري</h2>
                <h3>01/01/2026</h3>
            </div>
        </Grid>
       
      
      </Grid>
        <Grid sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }} container spacing={2}>
            <Grid  sx={{display:"flex",justifyContent:"center",alignItems:"center" }} size={10}>
                <div style={salatStyle}>
                    <h2 style={hStyle}>الفجر</h2>
                    <h3 style={hStyle}>04:30</h3>
                    <EditIcon onClick={() =>{ 
                        setSalat("fajr");
                        setOpen(true)
                       } } style={{ cursor: 'pointer', color: mode === 'dark' ? '#fff' : '#000' }} />
                    
                </div>
            </Grid>
            <Grid sx={{display:"flex",justifyContent:"center",alignItems:"center" }} size={10}>
                <div style={salatStyle}>
                    <h2 style={hStyle}>الظهر</h2>
                    <h3 style={hStyle}>12:00</h3>
                    <EditIcon onClick={() => {
                        setSalat("dhuhr");
                        setOpen(true);
                    }} style={{ cursor: 'pointer', color: mode === 'dark' ? '#fff' : '#000' }} />

                </div>
            </Grid>
            <Grid sx={{display:"flex",justifyContent:"center",alignItems:"center" }} size={10}>
                <div style={salatStyle}>
                    <h2 style={hStyle}>العصر</h2>
                    <h3 style={hStyle}>15:30</h3>
                    <EditIcon onClick={() => {
                        setSalat("asr");
                        setOpen(true);
                    }} style={{ cursor: 'pointer', color: mode === 'dark' ? '#fff' : '#000' }} />
                </div>
            </Grid>
            <Grid  sx={{display:"flex",justifyContent:"center",alignItems:"center" }} size={10}>
                <div style={salatStyle}>
                    <h2 style={hStyle}>المغرب</h2>
                    <h3 style={hStyle}>18:00</h3>
                    <EditIcon onClick={() => {
                        setSalat("maghrib");
                        setOpen(true);
                    }} style={{ cursor: 'pointer', color: mode === 'dark' ? '#fff' : '#000' }} />

                </div>
            </Grid>
            <Grid sx={{display:"flex",justifyContent:"center",alignItems:"center" }} size={10}>
                <div style={salatStyle}>
                    <h2 style={hStyle}>العشاء</h2>
                    <h3 style={hStyle}>19:30</h3>
                    <EditIcon onClick={() => {
                        setSalat("ishaa");
                        setOpen(true);
                    }} style={{ cursor: 'pointer', color: mode === 'dark' ? '#fff' : '#000' }} />
                </div>
            </Grid>
        </Grid>
        <EditModal salat={salat} open={open} handleClose={handleClose} />
    </div>
    )
}