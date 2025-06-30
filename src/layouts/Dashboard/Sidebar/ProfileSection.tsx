// src/layouts/Dashboard/Sidebar/ProfileSection.tsx
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '@/store';
import { Skeleton } from '@mui/material';
import avatar1 from '@/assets/images/users/avatar-1.png';

const ProfileSection = () => {
  const { profile, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized || !profile) {
    return (
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Skeleton variant="circular" width={80} height={80} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="80%" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Avatar
        alt={profile.fullName}
        src={profile.avatarUrl || avatar1} 
        sx={{
          width: 80,
          height: 80,
          mx: 'auto',
          mb: 1,     
          border: '2px solid',
          borderColor: 'divider',
          borderRadius:'50%'
        }}
      />
      <Typography variant="h6" component="div">
        {profile.fullName}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
        {profile.role}
      </Typography>
    </Box>
  );
};

export default ProfileSection;