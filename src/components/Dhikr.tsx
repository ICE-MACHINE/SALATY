import { useParams } from "react-router-dom";
import { Box, Typography } from '@mui/material'
import { getAdhkar, getTitleInArabic } from "../functions/getAdhkar";
import { getBackgroundColor, getTextColor } from "../styles/colors";
import useMode from "../contexts/Mode/UseMode";
export default function Dhikr() {
    const { mode } = useMode();
    const { section } = useParams<{ section?: string }>();
    if (!section) {
        return <Typography variant="h6" sx={{ color: getTextColor(mode), m: 2 }}>القسم غير موجود</Typography>;
    }
    const sectionKey = section as 'morning' | 'evening' | 'sleep' | 'general' | 'prayer' | 'quran' | 'mosque' | 'travel' | 'education';
    const sectionInArabic = getTitleInArabic(sectionKey);
    const adhkar = getAdhkar(sectionKey);
    return(
        <Box m="20px">
            <Typography 
            sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                m: 2,
                color: getTextColor(mode),
                bgcolor: getBackgroundColor(mode),
                borderRadius: '8px',
                fontFamily: 'salatyFont',
                fontSize: '24px',
                userSelect: 'none',
                p: 1,

            }}
            variant="h4">
                {sectionInArabic}
            </Typography>
            <Box 
                sx={{
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 145px)',
                    
                }}
           >
            {adhkar.map(item => (
                <Box key={item.id} sx={{
                     m: 2,
                    p: 2,
                    bgcolor: getBackgroundColor(mode),
                    color: getTextColor(mode),
                    borderRadius: '8px',
                    fontFamily: 'salatyFont',
                        }}>
                    <Typography variant="body1">{item.text}</Typography>
                </Box>
            ))}
            </Box>
        </Box>
    )
}