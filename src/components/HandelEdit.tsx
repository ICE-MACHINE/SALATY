import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import useMode from './../contexts/Mode/UseMode';

interface AboutProps {
  salat: "fajr" | "dhuhr" | "asr" | "maghrib" | "ishaa";
  open: boolean;
  handleClose: () => void;
}

function translateToArabic(salat: AboutProps["salat"]): string {
  const translations = {
    fajr: "الفجر",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    ishaa: "العشاء"
  };
  return translations[salat];
}

function RoundButton({
  icon,
  onClick,
  disabled,
  color,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color: string;
}) {
  return (
    <Box
      sx={{
        height: 50,
        width: 50,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          minWidth: "100%",
          p: 0,
          color: '#fff',
          backgroundColor: color,
          '&:hover': {
            backgroundColor:
              color === '#4caf50' ? '#388e3c' : '#d32f2f',
          },
        }}
      >
        {icon}
      </Button>
    </Box>
  );
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
  width: 300,
  direction: 'rtl',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: 3,
};

export default function EditModal({ salat, open, handleClose }: AboutProps) {
  const { mode } = useMode();
  const [count, setCount] = useState(0);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={modalStyle}
        style={{
          backgroundColor:
            mode === 'dark'
              ? 'rgba(51, 51, 51, 0.85)'
              : 'rgba(255, 255, 255, 0.9)',
          color: mode === 'dark' ? '#fff' : '#000',
        }}
      >
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ fontWeight: 'bold', fontSize: 20,fontFamily: 'salatyFont' }}
        >
          تعديل وقت {translateToArabic(salat)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <RoundButton
            icon={<RemoveIcon />}
            onClick={() => setCount((prev) => prev - 1)}
            disabled={count === -10}
            color="#f44336"
          />

          <Typography
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#e0e0e0',
              color: '#000',
              fontSize: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: '2px solid #ccc',
              direction:"ltr",
            }}
          >
            {count}
          </Typography>

          <RoundButton
            icon={<AddIcon />}
            onClick={() => setCount((prev) => prev + 1)}
            disabled={count === 10}
            color="#4caf50"
          />
        </Box>
      </Box>
    </Modal>
  );
}
