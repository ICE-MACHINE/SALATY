import { useEffect, useState, useRef } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import useMode from '../contexts/Mode/UseMode.tsx';
import data from '../json/UthmanicWarsh1 Ver05.json';
import type { Sora } from '../Types/Sora.tsx';

interface SoraItem {
  sora: string;
}

export default function Quoran() {
  const [sowar, setSowar] = useState<SoraItem[]>([]);
  const [notFound, setNotFound] = useState(false);
  const soraRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { mode } = useMode();

  useEffect(() => {
    setSowar(() =>
      data.sowar.map((item: Sora) => ({
        sora: item.sora,
      }))
    );
  }, []);

 

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: "58px",
          left: 0,
          width: '100%',
          bgcolor: mode === 'dark' ? '#2225' : '#fff5',
            color: mode === 'dark' ? '#fff' : '#000',
          zIndex: 1000,
          py: 0,
          boxShadow: 2,
        }}
      >
        <Container 
        sx={{height:"60px",
         display: 'flex',
         justifyContent:"space-around", 
         alignItems: 'center'

         }}>
          <Typography variant="h4" align="center" gutterBottom>
            قائمة السور
          </Typography>
        </Container>
      </Box>

      <Container
        sx={{
            pt:1,
          pb: 4,
          mt:"115px",
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 115px)',
        }}
      >

        <Grid container spacing={2} justifyContent="center">
          {sowar.map((item, index) => (
            <Grid
              size={10}
              key={index}
              display="flex"
              justifyContent="center"
              ref={el => {
                soraRefs.current[index] = el;
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: '20px',
                  width: '80%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: mode === 'dark' ? '#3335' : '#eee5',
                  color: mode === 'dark' ? '#fff' : '#000',
                  fontSize: '1.7rem',
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{ width: '10%' }}
                  variant="h6"
                  display="flex"
                  justifyContent="center"
                  component="div"
                >
                  {index + 1}
                </Typography>
                <Typography
                  sx={{ width: '80%' }}
                  display="flex"
                  justifyContent="center"
                  variant="h6"
                  component="div"
                >
                  {item.sora}
                </Typography>
                <BookmarkIcon
                  sx={{
                    fontSize: '2rem',
                    color: mode === 'dark' ? '#fff' : '#000',
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* تنبيه في حالة عدم العثور على السورة */}
      <Snackbar
        open={notFound}
        autoHideDuration={4000}
        onClose={() => setNotFound(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setNotFound(false)}>
          لم يتم العثور على سورة بهذا الاسم!
        </Alert>
      </Snackbar>
    </>
  );
}
