import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import useMode from "./../contexts/Mode/UseMode";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '16px',
  p: 4,
};

interface AboutProps {
  open: boolean;
  handleClose: () => void;
}

export default function About({open, handleClose}: AboutProps) {
  const { mode } = useMode();
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{
          backgroundColor: mode === 'dark' ? '#333' : '#fff',
          color: mode === 'dark' ? '#fff' : '#000',
          direction: 'rtl'
        }}>
          <Typography id="modal-modal-title" variant="h4" component="h4" style={{fontFamily: 'salatyFont'}} gutterBottom>
            حول التطبيق 
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            شكرا لوضع ثقتك في هذا التطبيق, نرجوا أن تستمتع بتجربتك, وأن نكون عند حسن ظنك.
            <br />
            ساهم رجاء في نشر الموقع لتكون صدقة جارية لك ولنا.
            <br />

          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            تواصل مع المطور <a href="https://example.com">the machine developer</a>
            <br />
            تواصل مع المصمم <a href="https://example.com">the machine designer</a>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
