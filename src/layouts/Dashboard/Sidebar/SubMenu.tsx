import Menu from '@mui/material/Menu';
import type { FC, PropsWithChildren } from 'react';

interface Props {
  anchor: HTMLElement | null;
  open: boolean;
  handleClose: () => void;
}

const SubMenu: FC<PropsWithChildren<Props>> = (props) => {
  const { open, anchor, handleClose, children } = props;

  return (
    <Menu
      anchorEl={anchor}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { ml: 2, px: 1, bgcolor: '#fff' } }}
    >
      {children}
    </Menu>
  );
};

export default SubMenu;
