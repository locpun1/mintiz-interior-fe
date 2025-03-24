import type { PaperProps } from '@mui/material/Paper';
import type { PopoverProps } from '@mui/material/Popover';
import Popover from '@mui/material/Popover';
import type {
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react';
import { cloneElement, Fragment, isValidElement, useState } from 'react';

type Trigger = 'click' | 'hover';

interface Props extends Omit<PopoverProps, 'open'> {
  trigger?: Trigger[];
  anchor: ReactElement;
  children: ReactNode;
  PaperProps?: Partial<PaperProps>;
}

const ProPopover = (props: Props) => {
  const { trigger = ['click'], anchor, children, ...rest } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      {isValidElement<HTMLAttributes<HTMLButtonElement>>(anchor)
        ? cloneElement(anchor, {
            onClick: trigger.includes('click') ? handleClick : void 0,
          })
        : null}
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { mt: 1 } }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        {...rest}
      >
        {children}
      </Popover>
    </Fragment>
  );
};

export default ProPopover;
