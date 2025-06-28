import type { FC, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';

import type { SvgIconComponent } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import type { ListProps } from '@mui/material/List';
import List from '@mui/material/List';
import type { ListItemProps } from '@mui/material/ListItem';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from './Logo';
import type { SectionItem } from './Sections';
import SubMenu from './SubMenu';
import Scrollbar from '@/components/Scrollbar';

import { MINI_SIDEBAR_WIDTH, SIDEBAR_WIDTH } from '@/constants/layouts';
import useDerivedState from '@/hooks/useDerivedState';
import usePrevious from '@/hooks/usePrevious';
import Sections from './Sections';
import type { MouseEvent } from '@/types/react';

export const CollapseContext = createContext<boolean | null>(null);
export const SidebarContext = createContext<boolean | null>(null);

interface Props {
  openSidebar: boolean;
  collapsed: boolean;
  onCloseSidebar: () => void;
  onToggleCollapsed: () => void;
}
const Sidebar = (props: Props) => {
  const { openSidebar, collapsed, onCloseSidebar, onToggleCollapsed } = props;
  const { pathname } = useLocation();
  const sections = Sections(); 
  const theme = useTheme();
  const prevPathName = usePrevious(pathname);

  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    if (prevPathName !== pathname && openSidebar) {
      onCloseSidebar();
    }
  }, [pathname, onCloseSidebar, openSidebar, prevPathName]);

  if (lgUp) {
    return (
      <CollapsibleDrawer
        anchor='left'
        variant='permanent'
        collapsed={collapsed}
        onClose={onToggleCollapsed}
      >
        <SidebarContext.Provider value={openSidebar}>
          <CollapseContext.Provider value={collapsed}>
            <Scrollbar>
              <Box
                sx={{
                  borderBottom: 'thin solid #E6E8F0',
                  height: '64px',
                }}
              >
                <Logo />
              </Box>
              {sections.map((section, i) => (
                <MenuSection key={i} pathname={pathname} {...section} />
              ))}
            </Scrollbar>
          </CollapseContext.Provider>
        </SidebarContext.Provider>
      </CollapsibleDrawer>
    );
  }

  return (
    <Drawer
      anchor='left'
      variant='temporary'
      open={collapsed}
      onClose={onToggleCollapsed}
      sx={{
        zIndex: 999,
      }}
      PaperProps={{ sx: { width: SIDEBAR_WIDTH, bgcolor: '#fff' } }}
    >
      <SidebarContext.Provider value={openSidebar}>
        <CollapseContext.Provider value={false}>
          <Scrollbar sx={{ height: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Logo />
              <IconButton
                onClick={onToggleCollapsed}
                edge='start'
                sx={{
                  color: '#000',
                  borderRadius: '4px',
                  width: '36px',
                  height: '36px',
                  fontSize: '1rem',
                  // backgroundColor: '#f0f0f0',
                  marginRight: '12px',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 1.5 }} />
            {sections.map((section, i) => (
              <MenuSection key={i} pathname={pathname} {...section} />
            ))}
          </Scrollbar>
        </CollapseContext.Provider>
      </SidebarContext.Provider>
    </Drawer>
  );
};

// Menu section
interface MenuSectionProps extends ListProps {
  section: string | null;
  pathname: string;
  items: SectionItem[];
}
const MenuSection: FC<MenuSectionProps> = (props) => {
  const { section, pathname, items, ...rest } = props;

  const collapsed = useContext(CollapseContext);

  return (
    <List
      subheader={
        section &&
        !collapsed && (
          <ListSubheader disableGutters disableSticky sx={{ ml: 3 }}>
            {section}
          </ListSubheader>
        )
      }
      disablePadding
      {...rest}
    >
      <MenuItems items={items} pathname={pathname} level={0} />
    </List>
  );
};

// Menu section items
interface MenuItemsProps {
  items: SectionItem[];
  pathname: string;
  level: number;
}
const MenuItems = (props: MenuItemsProps) => {
  const { items, pathname, level } = props;

  return (
    <List disablePadding>
      {items.reduce<ReactNode[]>((acc, item, i) => {
        const { title, path, children, icon } = item;
        const key = `${title}-${level}-${i}`;
        // const partialMatch = pathname.startsWith(path);
        const exactMatch = pathname === path || pathname.startsWith(`${path}/`);

        if (children) {
          acc.push(
            <MenuItem
              active={exactMatch}
              level={level}
              icon={icon}
              key={key}
              path={path}
              title={title}
              match={exactMatch}
            >
              <MenuItems items={children} pathname={pathname} level={level + 1} />
            </MenuItem>,
          );
        } else {
          acc.push(
            <MenuItem
              active={exactMatch}
              level={level}
              icon={icon}
              key={key}
              path={path}
              title={title}
            />,
          );
        }
        return acc;
      }, [])}
    </List>
  );
};

interface MenuItemProps extends ListItemProps {
  active?: boolean;
  children?: ReactNode;
  chip?: ReactNode;
  level: number;
  icon?: SvgIconComponent;
  info?: () => JSX.Element;
  match?: boolean;
  path?: string;
  title: string;
}
const MenuItem: FC<MenuItemProps> = (props) => {
  const {
    active,
    children,
    chip,
    level,
    icon: Icon,
    info: Info,
    match,
    path,
    title,
    ...other
  } = props;

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [expanded, setExpanded] = useDerivedState<boolean>(Boolean(match));
  const collapsed = useContext(CollapseContext);

  const { pathname } = useLocation();
  const prevPathName = usePrevious(pathname);

  useEffect(() => {
    if (prevPathName !== pathname && collapsed) {
      setAnchor(null);
    }
  }, [pathname, collapsed, prevPathName]);

  const handleToggle = (): void => {
    setExpanded(!expanded);
  };

  const handleOpenSubMenu: MouseEvent = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleCloseSubMenu = () => {
    setAnchor(null);
  };

  let paddingLeft = 8 * 3;

  if (level > 0) {
    paddingLeft = !collapsed ? 32 + 16 * level : 16 * level;
  }

  if (level === 0 && collapsed) {
    return (
      <ListItem
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          height: '53px',
        }}
        {...other}
      >
        <Tooltip title={title} placement='right'>
          <IconButton
            onClick={children ? handleOpenSubMenu : void 0}
            size='medium'
            {...(!children &&
              path && {
                component: RouterLink,
                to: path,
              })}
            sx={{
              color: 'neutral.800',
              '&:hover': {
                bgcolor: alpha('#FFFFFF', 0.08),
              },
              ...(active && {
                color: 'info.main',
                bgcolor: alpha('#FFFFFF', 0.08),
              }),
            }}
          >
            {Info && Icon ? (
              <Badge color='secondary' variant='dot'>
                <Icon />
              </Badge>
            ) : (
              Icon && <Icon />
            )}
          </IconButton>
        </Tooltip>
        <SubMenu anchor={anchor} handleClose={handleCloseSubMenu} open={Boolean(anchor)}>
          {children}
        </SubMenu>
      </ListItem>
    );
  }

  // Branch
  if (children) {
    return (
      <ListItem
        disableGutters
        disablePadding
        sx={{
          display: 'flex',
          flexDirection: 'column',
          ...(level === 0 && {
            px: 1.5,
          }),
        }}
        {...other}
      >
        <Button
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={handleToggle}
          startIcon={Icon && <Icon />}
          variant='text'
          size='medium'
          fullWidth
          sx={{
            color: 'neutral.800',
            p: 1.25,
            pl: `${paddingLeft}px`,
            textAlign: 'left',
            '&:hover': {
              bgcolor: alpha('#FFFFFF', 0.08),
            },
            ...(active && {
              color: 'info.main',
              bgcolor: alpha('#FFFFFF', 0.08),
            }),
          }}
        >
          <ListItemText
            primary={title}
            sx={{
              whiteSpace: 'nowrap',
              '& .MuiTypography-root': {
                fontSize: '14px',
              },
            }}
          />
          {Info && <Info />}
        </Button>
        <Collapse in={expanded} sx={{ mt: 0.5, width: 1 }}>
          {children}
        </Collapse>
      </ListItem>
    );
  }

  // Leaf
  return (
    <ListItem
      disableGutters
      disablePadding
      sx={{
        display: 'flex',
        ...(level === 0 && {
          px: 1.5,
          pb: 0.5,
        }),
      }}
    >
      <Button
        startIcon={Icon && <Icon />}
        endIcon={chip}
        variant='text'
        size='medium'
        fullWidth
        sx={{
          color: 'neutral.800',
          p: 1.25,
          pl: `${paddingLeft}px`,
          '&:hover': {
            bgcolor: alpha('#000', 0.08),
          },
          ...(active && {
            color: 'info.main',
            bgcolor: '#e6f4ff',
          }),
          flexShrink: 0,
        }}
        {...(path && {
          component: RouterLink,
          to: path,
        })}
      >
        <ListItemText
          primary={title}
          sx={{
            '& .MuiTypography-root': {
              whiteSpace: 'nowrap',
              fontSize: '14px',
            },
          }}
        />
        {Info && <Info />}
      </Button>
    </ListItem>
  );
};

const CollapsibleDrawer = styled(Drawer, {
  shouldForwardProp: (prop: string) => !['collapsed'].includes(prop),
})<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  [`& .${drawerClasses.paper}`]: {
    backgroundColor: theme.palette.common.white,
    borderRight: '1px solid #f0f0f0',
    color: theme.palette.common.black,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    width: SIDEBAR_WIDTH,
    ...(collapsed && {
      width: MINI_SIDEBAR_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    ...(!collapsed && {
      width: SIDEBAR_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }),
  },
  ...(collapsed && {
    width: MINI_SIDEBAR_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!collapsed && {
    width: SIDEBAR_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
}));

export default Sidebar;
