import Dialog from '@mui/material/Dialog';
import type { DialogProps } from '@mui/material/Dialog';

const DialogContainer = (props: DialogProps) => {
  const { children, open, onClose, ...rest } = props;

  return (
    <Dialog open={open} onClose={onClose} scroll='paper' fullWidth={false} {...rest}>
      {children}
    </Dialog>
  );
};

export default DialogContainer;