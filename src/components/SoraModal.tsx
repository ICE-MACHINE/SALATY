import React from 'react';
import useMode from '../contexts/Mode/UseMode.tsx';
import data from '../json/Quran.json';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import type { Sora } from '../Types/SoraType.tsx';
import type { Ayah } from '../Types/AyahType.tsx';
import { getBackgroundColor, getTextColor, getModalBackgroundColor } from '../styles/colors';

interface SoraModalProps {
  index: number;
    handleClose: () => void;
    open: boolean;
}
export default function SoraModal({open=false,index=0, handleClose}: SoraModalProps) {
    const { mode } = useMode();

    if (index < 0 || index >= data.data.surahs.length) {
        return null;
    }

    const sora: Sora = {
      number: data.data.surahs[index].number,
      name: data.data.surahs[index].name,
      ayahs: data.data.surahs[index].ayahs as Ayah[],
    };
    const soraStyle: React.CSSProperties = {
        padding: '20px',
        borderRadius: '20px',
        width: '80%',
        maxHeight:"calc(100vh - 15%)",
        overflow:"auto",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: getBackgroundColor(mode),
        color: getTextColor(mode),
        flexDirection: 'column',
        textAlign: 'center' as const,
        position: 'absolute',
        top:"20px",
        left:"calc(10% - 20px)",
    };
    
    return (
         <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

              >
                <Box sx={soraStyle} style={{
                  backgroundColor: getModalBackgroundColor(mode),
                  color: getTextColor(mode),
                  direction: 'rtl'
                }}>
                  <Typography id="modal-modal-title" variant="h4" component="h4" style={{fontFamily: 'salatyFont'}} gutterBottom>
                  {sora.number} - {sora.name} 
                  </Typography>
                  {
                   (index !== 8 && index !== 0) && (
                        <Typography id="modal-modal-description" sx={{ mt: 2, fontFamily: 'salatyFont', fontSize: '22px',display: 'inline-block', alignSelf: 'center' }}>
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
                    {sora.ayahs.map((ayah: Ayah, ayahIndex: number) => (
                      <React.Fragment key={ayahIndex}>
                        <span style={{
                          fontFamily: 'salatyFont',
                          fontSize:"20px",
                          color: getTextColor(mode)
                        }}>
                          {ayah.text}
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
                            border: `2px solid ${getTextColor(mode)}`,
                            margin: '0 8px',
                            padding:"5px 0 0 0 ",
                            fontSize: '19px',
                            fontWeight: 'bold',
                            backgroundColor:"transparent",
                        }}
                        >{ayah.numberInSurah}</span>
                        {ayahIndex < sora.ayahs.length - 1 && ' '}
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              </Modal>
    );
}