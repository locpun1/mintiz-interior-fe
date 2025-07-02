import React from "react";
import { Box, Card, CardContent, Typography, Avatar, Button, Tooltip } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import { UserProfile } from "@/types/user-types";
import { getPathImage } from "@/utils/url";
import avatar from "@/assets/images/users/default-avatar.jpg"

interface UserCardProps {
    userProfile: UserProfile
    handleClick: (id: string | number) => void,
    handleDelete: (id: string | number) => void,
    handleEdit: (id: string | number) => void,
}

const UserCard: React.FC<UserCardProps> = ({ userProfile,  handleClick, handleDelete, handleEdit }) => {
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
                <Avatar src={userProfile.avatar_url ? getPathImage(userProfile.avatar_url) : avatar} sx={{ width: 70, height: 70, mb: 1, borderRadius: '50%' }} />
                <Typography variant="subtitle1" fontWeight="bold">{userProfile.fullName}</Typography>
                <Typography variant="body2">Email: {userProfile.email || '-'}</Typography>
                <Typography variant="body2">Số điện thoại: {userProfile.phone_number || '-'}</Typography>
                <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                    <Button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            userProfile.id && handleEdit(userProfile.id);
                        }} 
                        disabled={userProfile.is_deleted === 1} variant="outlined" sx={{ color: '#1C1A1B', border: '1px solid #1C1A1B'}} size="small"
                    >
                        Chỉnh sửa
                    </Button>
                    <Button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            userProfile.id && handleDelete(userProfile.id)
                        }} 
                        disabled={userProfile.is_deleted === 1} variant="outlined" sx={{ color: '#1C1A1B', border: '1px solid #1C1A1B'}} size="small"
                    >
                        Xóa tài khoản
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCard;