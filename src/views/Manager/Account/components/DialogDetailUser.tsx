import DialogComponent from "@/components/DialogComponent";
import { UserProfile } from "@/types/user-types";
import { getPathImage } from "@/utils/url";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import avatar from "@/assets/images/users/default-avatar.jpg"
import { getRoleLabel } from "@/utils/labelEnToVi";

interface DialogDetailUserProps{
    open: boolean,
    onClose: () => void;
    userDetail: UserProfile;
}

const DialogDetailUser: React.FC<DialogDetailUserProps> = ({ open, onClose, userDetail}) => {
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={onClose}
            isActiveFooter={false}
        >
            <Box p={2} width={{ xs: '100%', md: 350}} display='flex' flexDirection='column'>
                <Stack flexGrow={1} display='flex' justifyContent='center' alignItems='center' sx={{ my: 2}}>
                    <Avatar
                        src={userDetail.avatar_url ? getPathImage(userDetail.avatar_url) : avatar}
                        sx={{ width: '150px', height: '150px', mb: 2, bgcolor: 'grey.600', borderRadius:'50%', boxShadow: 4 }}
                    />
                </Stack>
                <Stack spacing={1} sx={{ my: 1}}>
                    <Typography variant="body2" fontWeight={500}>Tên đầy đủ:</Typography>
                    <Typography variant="body2">{userDetail.fullName || '-'}</Typography>
                </Stack>
                <Stack spacing={1} sx={{ mb: 1}}>
                    <Typography variant="body2" fontWeight={500}>Tên hiển thị:</Typography>
                    <Typography variant="body2">{userDetail.username || '-'}</Typography>
                </Stack>
                <Stack direction='row' sx={{ mb: 1}}>
                    <Typography variant="body2" fontWeight={500}>Email:</Typography>
                    <Typography variant="body2">{userDetail.email || '-'}</Typography>
                </Stack>
                {/* <Grid size={{ xs: 12}}>
                    <Stack direction='row'>
                        <Typography variant="body2" fontWeight={500}>Mật khẩu:</Typography>
                        <Typography sx={{ wordBreak: "break-all", whiteSpace: 'normal',}} variant="body2">{userDetail.password || '-'}</Typography>
                    </Stack>
                </Grid> */}
                <Stack direction='row' sx={{ mb: 1}}>
                    <Typography variant="body2" fontWeight={500}>Chức vụ:</Typography>
                    <Typography variant="body2">{getRoleLabel(userDetail.role) || '-'}</Typography>
                </Stack>
                <Stack direction='row' sx={{ mb: 1}}>
                    <Typography variant="body2" fontWeight={500}>Số điện thoại:</Typography>
                    <Typography variant="body2">{userDetail.phone_number || '-'}</Typography>
                </Stack>
                <Stack direction='row' sx={{ mb: 1}}>
                    <Typography variant="body2" fontWeight={500}>Địa chỉ:</Typography>
                    <Typography variant="body2">{userDetail.address || '-'}</Typography>
                </Stack>
            </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        sx={{ width: '100px', color: '#1C1A1B', border: '1px solid #1C1A1B'}}
                        onClick={onClose}
                    >
                        Đóng
                    </Button>
                </Box>
            
        </DialogComponent>
    )
}
export default DialogDetailUser;