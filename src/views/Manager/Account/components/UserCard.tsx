import React from "react";
import { Box, Card, CardContent, Typography, Avatar, Button } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';

interface UserCardProps {
    name: string;
    email: string;
    password: string;
    avatarUrl: string;
}

const UserCard: React.FC<UserCardProps> = ({ name, email, password, avatarUrl }) => {
    return (
        <Card sx={{ position: 'relative', width: 240, m: 1, borderRadius: '15px' }}>
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <CircleIcon color="success" fontSize="small" />
            </Box>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar src={avatarUrl} sx={{ width: 64, height: 64, mb: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">{name}</Typography>
                <Typography variant="body2">Email: {email}</Typography>
                <Typography variant="body2">Pass: {password}</Typography>
                <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                    <Button variant="outlined" sx={{ color: '#1C1A1B', border: '1px solid #1C1A1B'}} size="small">Chỉnh sửa</Button>
                    <Button variant="outlined" sx={{ color: '#1C1A1B', border: '1px solid #1C1A1B'}} size="small">Xóa tài khoản</Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCard;