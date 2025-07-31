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
import data from '../json/Quran.json';
import SoraModal from './SoraModal.tsx';
import type { Sora } from "../Types/SoraType.tsx";
import { getBackgroundColor, getTextColor, colors } from '../styles/colors';
import useMarkedSora from '../contexts/MarkedSora/UseMarkedSora.tsx';
const sowar:string[] = data.data.surahs.map((sora:Sora)=>{
  return sora.name;
})

export default function Quoran() {
  const { markedSora, setMarkedSora } = useMarkedSora();
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
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          bgcolor: getBackgroundColor(mode),
            color: getTextColor(mode),
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
            {markedSora !== -1 ? `الذهاب إلى سورة ${sowar[markedSora]}` : "لا توجد سورة محفوظة"}
          </Typography>
        </Container>
      </Box>

      <Container
        sx={{
            pt:1,
          pb: 4,
          mt:"60px",
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
                  borderRadius: '20px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: getBackgroundColor(mode),
                  color: getTextColor(mode),
                  fontSize: '1.7rem',
                  textAlign: 'center',
                  position:"relative",
                }}
              >
                <Typography
                  sx={{ 
                    width: '10%',
                    padding:1,
                    position:"absolute",
                    top:0,
                    right:0 ,
                    borderRadius: '0 20px 20px 0',
                  }}
                  variant="h6"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  component="div"
                  bgcolor={mode === 'dark' ? '#444' : '#ddd'}
                >
                  {index + 1}
                </Typography>
                <Typography
                  sx={{ width: '80%',padding:1, fontFamily: 'salatyFont',marginRight:"10%", cursor: 'pointer' }}
                  display="flex"
                  justifyContent="center"
                  variant="h6"
                  component="div"
                  onClick={() => {
                    handleOpenSoraModal(index);
                  }}
                >
                  {item}
                </Typography>
               

                <BookmarkIcon
                  sx={{
                    fontSize: '2rem',
                    cursor: 'pointer',
                    padding:1,
                    color: markedSora === index ? colors.primary : getTextColor(mode),
                    '&:hover': {
                      color: colors.primary,
                    },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                    color: markedSora === index ? colors.primary : getTextColor(mode),
                  },
                  }}
                  onClick={(e) => {
                    ((e.currentTarget as unknown) as HTMLElement).blur();
                    setMarkedSora((prevMarkedSora) => {
                      return prevMarkedSora === index ? -1 : index;
                    });
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
