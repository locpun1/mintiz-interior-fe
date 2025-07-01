// src/views/Manager/components/AccountSummary.tsx
import { Avatar, Box, Card, Grid, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IUser } from '@/types/user';

interface AccountCardProps {
    user: IUser;
}

const AccountCard = ({ user }: AccountCardProps) => (
    <Card variant="outlined" sx={{
        borderRadius: 3,
        display: 'flex', gap: 2,
        alignItems: 'center',
        p: 2,
        border: 'none',
        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
    }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: 'action.disabledBackground' }} />
        <Box flexGrow={1}>
            <Box sx={{display:'flex',
                justifyContent:'space-between'
            }}>
                <Typography variant="subtitle1" fontWeight={600}>{user.fullName}</Typography>
                <Stack spacing={0.5} sx={{ display: 'flex' }}>
                    <IconButton size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                </Stack>
            </Box>
            <Typography variant="body2" color="text.secondary">Email: {user.username}</Typography>
            <Typography variant="body2" color="text.secondary">Pass: ********</Typography>
        </Box>

    </Card>
);

interface AccountSummaryProps {
    users: IUser[];
    isLoading?: boolean;
}

const AccountSummary = ({ users, isLoading }: AccountSummaryProps) => {

    if (isLoading) {
        return (
            <Grid container spacing={2}>
                {Array.from(new Array(6)).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Skeleton variant="rounded" height={80} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    // Nếu không có user nào, hiển thị thông báo
    if (users.length === 0) {
        return <Typography>Không có tài khoản nào để hiển thị.</Typography>
    }

    return (
        <Grid container spacing={2}>
            {users.map((user) => (
                <Grid item xs={12} sm={6} md={4} key={user.id}>
                    <AccountCard user={user} />
                </Grid>
            ))}
        </Grid>
    );
};

export default AccountSummary;