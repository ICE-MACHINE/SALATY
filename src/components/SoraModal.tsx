import React from 'react';
import useMode from '../contexts/Mode/UseMode.tsx';
import data from '../json/UthmanicWarsh1 Ver05.json';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
interface SoraModalProps {
  index: number;
    handleClose: () => void;
    open: boolean;
}
export default function SoraModal({open=false,index=0, handleClose}: SoraModalProps) {
    const { mode } = useMode();
    
    if (index < 0 || index >= data.sowar.length) {
        return null;
    }
    
    const sora = data.sowar[index];
    const soraStyle: React.CSSProperties = {
        padding: '20px',
        borderRadius: '20px',
        width: '80%',
        maxHeight:"calc(100vh - 15%)",
        overflow:"auto",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: mode === 'dark' ? '#3335' : '#eee5',
        color: mode === 'dark' ? '#fff' : '#000',
        flexDirection: 'column',
        textAlign: 'center' as const,
        position: 'absolute',
        top:"5%",
        left:"10%",
    };
    
    return (
         <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

              >
                <Box sx={soraStyle} style={{
                  backgroundColor: mode === 'dark' ? '#333' : '#fff',
                  color: mode === 'dark' ? '#fff' : '#000',
                  direction: 'rtl'
                }}>
                  <Typography id="modal-modal-title" variant="h4" component="h4" style={{fontFamily: 'salatyFont'}} gutterBottom>
                    {sora.sora} 
                  </Typography>
                  {
                    index!==8 && (
                        <Typography id="modal-modal-description" sx={{ mt: 2, fontFamily: 'salatyFont', fontSize: '22px' }}>
                            بِسْمِ اِ۬للَّهِ اِ۬لرَّحْمَٰنِ اِ۬لرَّحِيمِ 
                            </Typography>
                         
                    )
                  }
                  <Box id="modal-modal-description" sx={{ 
                    mt: 2, 
                    lineHeight: 2.8,
                    textAlign: 'right',
                    '& span:not(:last-child)': {
                      marginRight: '8px'
                    }
                  }}>
                    {sora.ayat.map((ayah, index) => (
                      <React.Fragment key={index}>
                        <span style={{
                          fontFamily: 'salatyFont',
                          fontSize:"20px",
                          color: mode === 'dark' ? '#fff' : '#000'
                        }}>
                          {ayah}
                        </span>
                        <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width:"30px",
                            minWidth:"30px",
                            height:"30px",
                            borderRadius:"50%",
                            border:mode==="dark"?"2px solid white":"2px solid black",
                            margin: '0 8px',
                            fontSize: '19px',
                            fontWeight: 'bold',
                            backgroundColor: mode === 'dark' ? '#333' : '#fff'
                        }}
                        >{index+1}</span>
                        {index < sora.ayat.length - 1 && ' '}
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              </Modal>
    );
}