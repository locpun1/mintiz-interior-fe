import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import type { MenuProps } from '@mui/material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import type { MouseEvent } from '@/types/react';

export interface ListItemMenuItem {
  title: string;
  children?: ListItemMenuItem[];
  icon?: ReactNode;
  to?: string;
}

interface ListItemMenuProps extends MenuProps {
  root: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: ListItemMenuItem[];
}
const ListItemMenu = (props: ListItemMenuProps) => {
  const { root, open, onClose, items, ...rest } = props;
  const [selectItem, setSelectItem] = useState<ListItemMenuItem | null>(null);
  const [anchor, setAnchor] = useState<HTMLLIElement | null>(null);

  const handleOpenMenu: MouseEvent<HTMLLIElement> = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
    onClose();
  };

  return (
    <Menu
      open={open}
      anchorEl={root}
      onClose={handleClose}
      PaperProps={{
        sx: { mt: 1, minWidth: 180 },
        elevation: 0,
        variant: 'outlined',
      }}
      {...rest}
    >
      {items.map((item, i) => {
        const { title, children = [], icon, to } = item;
        const hasChildren = children.length > 0;

        return (
          <Box key={i}>
            <MenuItem
              onClick={(e) => {
                if (hasChildren) {
                  handleOpenMenu(e);
                  setSelectItem(item);
                } else {
                  handleClose();
                }
              }}
              sx={{ py: 1.25 }}
              {...(to && {
                component: RouterLink,
                to,
              })}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{title}</ListItemText>
              {hasChildren && (
                <ChevronRightIcon
                  sx={{
                    color: 'text.secondary',
                    fontSize: 'inherit',
                  }}
                />
              )}
            </MenuItem>
          </Box>
        );
      })}
      {selectItem ? (
        <ListItemMenu
          root={anchor}
          open={Boolean(anchor)}
          onClose={handleClose}
          items={selectItem.children ? selectItem.children : []}
          PaperProps={{
            sx: { ml: 1 },
            elevation: 0,
            variant: 'outlined',
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        />
      ) : (
        <Box></Box>
      )}
    </Menu>
  );
};

export default ListItemMenu;
