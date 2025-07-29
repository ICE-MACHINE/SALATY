import { useEffect, useState, useRef } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import useMode from '../contexts/Mode/UseMode.tsx';
import data from '../json/UthmanicWarsh1 Ver05.json';
import type { Sora } from '../Types/SoraType.tsx';
import SoraModal from './SoraModal.tsx';

interface SoraItem {
  sora: string;
}
const sowar: SoraItem[] = data.sowar.map((item: Sora) => ({
  sora: item.sora,
}));

export default function Quoran() {
  const [markedSora, setMarkedSora] = useState<number>(-1);
  const [openSoraModal, setOpenSoraModal] = useState<boolean>(false);
  const [clikcedSora, setClickedSora] = useState<number>(-1);
  const handleCloseSoraModal = () => {
    setOpenSoraModal(false);
    setClickedSora(-1);
  };
  const handleOpenSoraModal = (index:number) => {
    setOpenSoraModal(true);
    setClickedSora(index);
  };
  const [openSnack,setOpenSnack] = useState<boolean>(false);
  const soraRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { mode } = useMode();
  function goToMarkedSora(){
    if (markedSora !== -1 && soraRefs.current[markedSora]) {
      soraRefs.current[markedSora]?.scrollIntoView({ behavior: 'smooth' });
    }
    else{
      setOpenSnack(true);
    }
  }
  useEffect(() => {
    if (soraRefs.current[0]) {
      soraRefs.current[0]?.scrollIntoView({ behavior: 'smooth' });
    }
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
          <Typography sx={{fontFamily:"salatyFont"}} variant="h4" align="center" gutterBottom>
            قائمة السور
          </Typography>
         <Typography
            sx={{fontFamily:"salatyFont", cursor:"pointer"}}
            variant="h6"
            onClick={goToMarkedSora}
          >
            {markedSora !== -1 ? `الذهاب إلى سورة ${sowar[markedSora].sora}` : "لا توجد سورة محفوظة"}
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
              alignItems="center"
              ref={el => {
                soraRefs.current[index] = el;
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: '20px',
                  width: '100%',
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
                  sx={{ width: '80%', fontFamily: 'salatyFont', cursor: 'pointer' }}
                  display="flex"
                  justifyContent="center"
                  variant="h6"
                  component="div"
                  onClick={() => {
                    handleOpenSoraModal(index);
                  }}
                >
                  {item.sora}
                </Typography>
               

                <BookmarkIcon
                  sx={{
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: markedSora === index ? "#007bff" : mode === 'dark' ? '#fff' : '#000',
                    '&:hover': {
                      color:"#007bff",
                    },
                  }}
                  onClick={() => {
                    setMarkedSora((prev)=> prev === index ? -1 : index);
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    
    <Snackbar
      open={ openSnack }
      autoHideDuration={4000}
      onClose={() => setMarkedSora(-1)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="warning" onClose={() => setOpenSnack(false)} sx={{ width: '100%' }}>
        لا توجد سورة محفوظة للانتقال إليها.
      </Alert>
    </Snackbar>
    
      <SoraModal
        index={clikcedSora}
        handleClose={handleCloseSoraModal}
        open={openSoraModal && clikcedSora >= 0}
      />
    
    </>
  );
}
