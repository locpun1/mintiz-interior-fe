import { useTranslation } from 'react-i18next';
import type { HTMLAttributes, MouseEvent, ReactElement } from 'react';
import { cloneElement, Fragment, isValidElement, useState } from 'react';

import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { SvgIconComponent } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogContainer from './DialogContainer';
import DialogContent from './DialogContent';
import DialogFooter from './DialogFooter';
import DialogHeader from './DialogHeader';
import Logger from '@/utils/Logger';

interface Props {
  onSubmit: () => Promise<void>;
  onRefresh?: () => void;
  content: {
    title: string;
    label: string;
    description: string;
    subdescription?: string;
    submitIcon?: SvgIconComponent;
  };
  children: ReactElement;
}

const Popconfirm = (props: Props) => {
  const { content, onSubmit, onRefresh, children } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { label, title, description, subdescription, submitIcon: SubmitIcon = CheckIcon } = content;

  const handleClick = (_event: MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit();
    } catch (error) {
      Logger.log(error);
    } finally {
      setLoading(false);
      handleClose();
      onRefresh?.();
    }
  };

  return (
    <Fragment>
      {isValidElement<HTMLAttributes<HTMLButtonElement>>(children)
        ? cloneElement(children, {
            onClick: handleClick,
          })
        : null}
      <DialogContainer open={open} onClose={handleClose} maxWidth='xs'>
        <DialogHeader title={title}>
          <InfoIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
        </DialogHeader>
        <DialogContent>
          <Typography variant='subtitle1' gutterBottom sx={{ textAlign: 'center' }}>
            {description}
          </Typography>
          {subdescription && (
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              {subdescription}
            </Typography>
          )}
        </DialogContent>
        <DialogFooter>
          <Button variant='outlined' startIcon={<CloseIcon />} onClick={handleClose}>
            {t('Hủy bỏ')}
          </Button>
          <LoadingButton
            loading={loading}
            loadingPosition='start'
            startIcon={<SubmitIcon />}
            color='success'
            onClick={handleSubmit}
          >
            {label}
          </LoadingButton>
        </DialogFooter>
      </DialogContainer>
    </Fragment>
  );
};

export default Popconfirm;