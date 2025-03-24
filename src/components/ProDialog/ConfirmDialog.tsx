import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material/styles';
import { type SvgIconComponent } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContainer from './DialogContainer';
import DialogContent from './DialogContent';
import DialogFooter from './DialogFooter';
import DialogHeader from './DialogHeader';
import Logger from '@/utils/Logger';


interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  onRefresh?: () => void;
  type: 'confirm' | 'delete';
  content: {
    title: string;
    label: string;
    description: string;
    name?: string;
    subdescription?: string;
    headerIcon?: SvgIconComponent;
    submitIcon?: SvgIconComponent;
  };
}

const ConfirmDialog = (props: Props) => {
  const { open, content, onClose, onSubmit, onRefresh, type } = props;
  const { t } = useTranslation('warehouse');
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const { label, title, description,name, subdescription, headerIcon, submitIcon } = content;

  const HeaderIcon = headerIcon ? headerIcon : type === 'confirm' ? CheckIcon : DeleteForeverOutlinedIcon;
  const SubmitIcon = submitIcon ? submitIcon : type === 'confirm' ? CheckIcon : DeleteForeverOutlinedIcon;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit();
    } catch (error) {
      Logger.log(error);
    } finally {
      setLoading(false);
      onRefresh?.();
      onClose();
    }
  };

  return (
    <DialogContainer
      PaperProps={{
        sx: { width: matches ? '100%' : '330px', borderRadius:'6.5px', boxShadow: 3, m: 3 },
      }}
      open={open}
      onClose={onClose}
    > 
    <CloseRoundedIcon sx={{ color: '#918b8b',position: 'absolute', top: 10, right: 10, cursor: 'pointer' }} onClick={onClose} />
      <DialogHeader title={title} icon={HeaderIcon}  />
      <DialogContent sx={{pl:2, pr:2}}>
        <Typography gutterBottom sx={{fontSize: '.9rem', textAlign: 'center'}}>
          {description}<strong> "{name}"</strong>
        </Typography>
        {subdescription && (
          <Typography sx={{fontSize: '.9rem', fontWeight: '600', textAlign: 'center' }}>
            {subdescription}
          </Typography>
        )}
      </DialogContent>
      <DialogFooter >
        <Button
          variant='outlined'
          sx={{
            borderColor: '#121828',
            height: 29,
            fontSize: '.8rem',
            minWidth: 90,
            color: '#121828', // Màu chữ
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
          onClick={onClose}
          fullWidth={matches}
        >
          {t('cancel')}
        </Button>
        <LoadingButton
          loading={loading}
          sx={{
            height: 29,
            fontSize: '.8rem',
            minWidth: 90,
            backgroundColor: type === 'delete' ? '#1976d2' : 'success.main',
            color: type === 'delete' ? 'white' : '', 
            '&:hover': {
              backgroundColor: type === 'delete' ? '#115ba4' : 'success.dark',
              color: type === 'delete' ? 'white' : '', 
            },
          }}
          loadingPosition='start'
          
          onClick={handleSubmit}
          fullWidth={matches}
        >
          {label}
        </LoadingButton>
      </DialogFooter>
    </DialogContainer>
  );
};

export default ConfirmDialog;