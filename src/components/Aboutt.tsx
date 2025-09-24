import { Box, Typography, Card, Grid } from '@mui/material';
import useMode from '../contexts/Mode/UseMode';
import useWidth from '../contexts/Width/UseWidth';
import { getBackgroundColor, getTextColor } from '../styles/colors';
import { Link } from "react-router-dom";
import Adhkar from '../json/Adhkar.json';
import { getTitleInArabic } from '../functions/getAdhkar';
export default function About() {
    const { mode } = useMode();
    const { width } = useWidth();
    const isMobile = width < 700; 
    return (
        <Box fontFamily={'salatyFont' } m="20px">
            <Card sx={{ bgcolor: getBackgroundColor(mode), color: getTextColor(mode), p: 1, mb: 2 }}>
                <Typography variant="h4"  sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                }}>
                    اﻷذكار
                    </Typography>
                    </Card>
            <Box sx={{
                height: 'calc(100vh - 190px)',
                overflowY: 'auto',
                p: 1,
            }}
            >
               <Grid container spacing={2}>
                {Adhkar.map((sectionObj, index) => {
                    const sectionKey = Object.keys(sectionObj)[0] as keyof typeof sectionObj;
                    const sectionInArabic = getTitleInArabic(sectionKey);
                    return (
                        <Grid size={isMobile? 12 : 6} key={index}>
                            <Link to={`/about/${sectionKey}`}>
                            <Card 
                                sx={{ 
                                    bgcolor: getBackgroundColor(mode),
                                    color: getTextColor(mode),
                                    p: 2,
                                }}
                                >
                                <Typography variant='body1'>
                                    {sectionInArabic}
                                </Typography>
                                </Card>
                        </Link>
                        </Grid>
                    )
                })}
               </Grid>
            </Box>
        </Box>
    )
}