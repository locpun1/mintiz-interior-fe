import React from "react";
import { Box, Card, CardContent, Typography, Avatar, Button, Tooltip, Stack } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import { UserProfile } from "@/types/user-types";
import { getPathImage } from "@/utils/url";
import avatar from "@/assets/images/users/default-avatar.jpg";

interface UserCardProps {
    userProfile: UserProfile
    handleClick: (id: string | number) => void,
    handleDelete: (id: string | number) => void,
    handleEdit: (id: string | number) => void,
    handleReset: (id: string | number) => void,
    handleActive: (id: string | number) => void,
}

const UserCard: React.FC<UserCardProps> = ({ userProfile,  handleClick, handleDelete, handleEdit, handleReset, handleActive }) => {
    return (
        <Card onClick={() =>  userProfile.id && handleClick(userProfile.id)} sx={{ position: 'relative', borderRadius: '15px', cursor: 'pointer' }}>
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                {userProfile.is_deleted === 0 ? (
                    <Tooltip title="Đang hoạt động">
                        <CircleIcon color="success" fontSize="small" />
                    </Tooltip>
                ): (
                    <Tooltip title="Không hoạt động">
                        <CircleIcon color="error" fontSize="small" />
                    </Tooltip>
                )}
            </Box>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Stack alignItems='center' direction='column'>
                    <Avatar src={userProfile.avatar_url ? getPathImage(userProfile.avatar_url) : avatar} sx={{ width: 70, height: 70, borderRadius: '50%' }} />
                    <Typography variant="subtitle1" fontWeight="bold">{userProfile.fullName}</Typography>
                </Stack>
                <Typography sx={{ wordBreak: 'break-all' }} variant="body2">Username: {userProfile.username || '-'}</Typography>
                <Typography variant="body2">Số điện thoại: {userProfile.phone_number || '-'}</Typography>
                <Box sx={{ display: 'flex', mt: 1, gap: 1, justifyContent:'center' }}>
                    <Button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            userProfile.id && handleEdit(userProfile.id);
                        }} 
                        disabled={userProfile.is_deleted === 1} variant="outlined" sx={{ color: '#1C1A1B', border: '1px solid #1C1A1B'}} size="small"
                    >
                        Sửa
                    </Button>
                    <Button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            userProfile.id && handleReset(userProfile.id);
                        }} 
                        disabled={userProfile.is_deleted === 1} variant="outlined" sx={{ color: '#1C1A1B', border: '1px solid #1C1A1B'}} size="small"
                    >
                        Reset
                    </Button>
                    <Button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            userProfile.id && handleDelete(userProfile.id)
                        }} 
                        disabled={userProfile.is_deleted === 1} variant="outlined" sx={{ color: '#1C1A1B', border: '1px solid #1C1A1B'}} size="small"
                    >
                        Xóa
                    </Button>
                    {userProfile.is_deleted === 1 && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                userProfile.id && handleActive(userProfile.id)
                            }}
                            variant="outlined" sx={{ color: '#1C1A1B', border: '1px solid #1C1A1B'}} size="small"
                        >
                            Khôi phục
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCard;