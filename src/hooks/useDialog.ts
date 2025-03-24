import type { DialogContextValue } from '@/contexts/Dialog';
import { DialogContext } from '@/contexts/Dialog';
import { useContext } from 'react';

const useDialog = (): DialogContextValue => {
  const dialogContext = useContext(DialogContext);

  if (!dialogContext) {
    throw new Error('Forgot to wrap component in DialogProvider');
  }

  return dialogContext;
};

export default useDialog;
