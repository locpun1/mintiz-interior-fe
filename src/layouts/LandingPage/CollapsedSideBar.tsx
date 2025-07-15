import Scrollbar from "@/components/Scrollbar";
import { SIDEBAR_WIDTH } from "@/constants/layouts";
import usePrevious from "@/hooks/usePrevious";
import { AccountCircle, Close, Home, Newspaper } from "@mui/icons-material";
import { Avatar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemText, MenuItem, Select, Stack, Typography } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mintz_logo from "@/assets/images/users/mintzdg-logo.png";


export const CollapseContext = createContext<boolean | null>(null);
export const SidebarContext = createContext<boolean | null>(null);

interface CollapsedSideBarProps{
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const CollapsedSideBar = (props: CollapsedSideBarProps) => {
    const { collapsed, onToggleCollapsed} = props;
    const location = useLocation();
    const navigate = useNavigate();


    const menuItems = [
        { label: 'Trang chủ', icon: <Home/>, path: '/home' },
        { label: 'Giới thiệu', icon: <AccountCircle/>, path: '/about-us' },
        { label: 'Tin tức', icon: <Newspaper/>, path: '/news' },
    ];

    return (
        <Drawer anchor="left" open={collapsed} onClose={onToggleCollapsed}>
            <Box
                sx={{
                width: '75vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                        px: 2,
                        py: 1.5,
                        borderBottom: '1px solid #eee',
                    }}
                >
                <IconButton onClick={onToggleCollapsed}>
                    <Close />
                </IconButton>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        px: 2,
                        py: 1.5,
                    }} 
                >
                    <Avatar src={mintz_logo} alt="Logo" sx={{ height: 150, width: 150, bgcolor: 'grey.300', borderRadius: '50%' }} />

                {/* Menu Items */}
                <List sx={{ px: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem
                        key={item.path}
                        onClick={() => {
                            navigate(item.path);
                            onToggleCollapsed();
                        }}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            mb: 1,
                        }}
                        >
                        <ListItemText
                            primary={
                                <Stack direction='row'>
                                    <IconButton>{item.icon}</IconButton>
                                    <Typography
                                        sx={{
                                            fontWeight: isActive ? 600 : 400,
                                            fontSize: '1rem',
                                            borderBottom: isActive ? '2px solid black' : 'none',
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </Stack>
                            }
                            />
                    </ListItem>
                    );
                })}
                </List>
                </Box>
            </Box>
        </Drawer>
    )
}

export default CollapsedSideBar;