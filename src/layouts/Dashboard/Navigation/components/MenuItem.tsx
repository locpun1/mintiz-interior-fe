import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import type { MouseEvent } from '@/types/react';
import type { ListItemMenuItem } from './ListItemMenu';
import ListItemMenu from './ListItemMenu';

interface MenuListItemProps {
  title: string;
  children?: ListItemMenuItem[];
  to?: string;
}

const MenuItem = (props: MenuListItemProps) => {
  const { title, children = [], to } = props;

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const handleClick: MouseEvent<HTMLDivElement> = (event) => {
    if (!children.length) return;
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <ListItem disablePadding sx={{ width: 'revert', height: 1 }}>
      <ListItemButton
        selected={Boolean(anchor)}
        sx={{ height: 1 }}
        onClick={handleClick}
        {...(to && {
          component: RouterLink,
          to,
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='body2'>{title}</Typography>
          {children.length > 0 && (
            <ExpandMoreIcon
              sx={{
                color: 'text.secondary',
                fontSize: 'inherit',
              }}
            />
          )}
        </Box>
      </ListItemButton>
      <ListItemMenu root={anchor} open={Boolean(anchor)} onClose={handleClose} items={children} />
    </ListItem>
  );
};

export default MenuItem;
