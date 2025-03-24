import CloseIcon from '@mui/icons-material/Close';
import type { AlertProps } from '@mui/material/Alert';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { __DEV__ } from '@/config';
import type { SyntheticEvent } from 'react';
import { createContext, forwardRef, useCallback, useEffect, useState } from 'react';
import type { PickUnion } from '@/types/common';
import type { FCC } from '@/types/react';
import sleep from '@/utils/sleep';
import Slide, { SlideProps } from '@mui/material/Slide';

const AlertMessage = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <Alert ref={ref} {...props} />
));

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction='left' />;
}

interface Settings {
  message: string | null;
  error: string | null;
  severity?: AlertProps['severity'];
  onUndo?: () => Promise<void> | void;
  onForward?: () => Promise<void> | void;
  snackbarProps?: Omit<React.ComponentProps<typeof Snackbar>, 'open' | 'onClose'>;
  alertProps?: Omit<React.ComponentProps<typeof Alert>, 'onClose'>;
}

export type NotificationContextValue = (config: PickUnion<Settings>) => void;

export const NotificationContext = createContext<NotificationContextValue | null>(null);

if (__DEV__) {
  NotificationContext.displayName = 'NotificationContext';
}

const initialSettings: Settings = {
  message: null,
  error: null,
};

const NotificationProvider: FCC = (props) => {
  const { children } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const {
    message,
    error,
    severity = 'success',
    onUndo,
    onForward,
    alertProps,
    snackbarProps,
  } = settings;

  const handleReset = async () => {
    setOpen(false);
  };

  const afterClose = async () => {
    await sleep(350);
    setSettings(initialSettings);
  };

  useEffect(() => {
    if (!open) {
      afterClose();
    }
  }, [open]);

  const handleClose = async (_event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    handleReset();
  };

  const handleUndo = async (_event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    onUndo?.();
    handleReset();
  };

  const handleForward = async (_event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    onForward?.();
    handleReset();
  };

  const setNotification = useCallback((settings: PickUnion<Settings>) => {
    setSettings((state) => ({
      ...state,
      ...settings,
    }));
    setOpen(true);
  }, []);

  return (
    <NotificationContext.Provider value={setNotification}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        {...snackbarProps}
      >
        <AlertMessage
          onClose={handleClose}
          severity={error ? 'error' : severity}
          {...alertProps}
          action={
            <Stack direction='row' spacing={1}>
              {typeof onUndo === 'function' && (
                <Button variant='text' color='inherit' onClick={handleUndo}>
                  Hủy bỏ
                </Button>
              )}
              {typeof onForward === 'function' && (
                <Button variant='text' color='inherit' onClick={handleForward}>
                  Xác nhận
                </Button>
              )}
              <IconButton color='inherit' onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Stack>
          }
        >
          {error || message}
        </AlertMessage>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export { NotificationContext as default, NotificationProvider };
