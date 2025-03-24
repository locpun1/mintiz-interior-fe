import { IconButton, Stack } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import * as React from 'react';
import { icons } from './ProButton/ActionIconButton';

interface Props {
  children: React.ReactNode;
  open: boolean;
  setOpen: (value: boolean) => void;
  actionType?: keyof typeof icons;
}

export default function DropdownCustom(props: Props) {
  const { children, open, setOpen, actionType = 'save' } = props;
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const Icon = actionType && icons[actionType];
  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle}>
        {Icon ? <Icon /> : children}
      </IconButton>
      <Popper
        sx={{
          zIndex: 999,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
              border: '1px solid #E6E8F0',
              borderRadius: '5px',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <Stack sx={{ p: 2 }}>{children}</Stack>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
