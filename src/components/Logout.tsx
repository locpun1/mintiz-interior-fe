import type { SvgIconComponent } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  content: {
    label: string;
    description: string;
    icon: SvgIconComponent;
  };
}

const Logout = (props: Props) => {
  const { open, content, onClose, onSubmit } = props;
  const { label, description, icon: Icon } = content;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit();
      navigate('/auth/login');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth onClose={onClose} scroll="body">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        {<Icon sx={{ fontSize: 70, color: 'text.secondary' }} />}
      </Box>
      <Divider />
      <DialogContent>
        <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
          {description}
        </Typography>
      </DialogContent>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={onClose}
            color="error"
          >
            {t('Hủy bỏ')}
          </Button>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<LogoutIcon />}
            onClick={handleSubmit}
          >
            {label}
          </LoadingButton>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default Logout;
