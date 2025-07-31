// src/views/Manager/components/PostSummary.tsx
import Button from '@/components/Button/Button';
import { IPost } from '@/types/post';
import { Box, Card, Grid, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import BlogPostCard from '../Blog/components/BlogPostCard';
import { getRoleLabel } from '@/utils/labelEnToVi';
import { IUser } from '@/types/user';

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

interface StatsCardProps{
  user: IUser | null;
  totalPostApproved: number;
  totalPostPending: number
}

const StatsCard = ({ user, totalPostApproved, totalPostPending } : StatsCardProps) => {
  const theme = useTheme();
  return (
    <Card variant="outlined" sx={{
      p: 2,
      borderRadius: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      border: 'none',
      boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
    }}>
      <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
        <Typography variant="body1" fontWeight={500}>{`Họ tên: ${user?.fullName}`}</Typography>
        <Typography variant="body2" color="text.secondary">{`Chức vụ: ${getRoleLabel(user?.role)}`}</Typography>
      </Box>

      <Stack textAlign="center" sx={{ flexDirection: 'column' }}>
        <Box>
          <Typography variant="h2" fontWeight={700} color={theme.palette.warning.main}>{totalPostPending}</Typography>
          <Typography variant="subtitle1">Bài viết chưa được phê duyệt</Typography>
        </Box>
      </Stack>
      <Stack textAlign="center" sx={{ flexDirection: 'column' }}>
        <Box>
          <Typography variant="h2" fontWeight={700} color={theme.palette.success.main}>{totalPostApproved}</Typography>
          <Typography variant="subtitle1">Bài viết đã duyệt thành công</Typography>
        </Box>
      </Stack>  
    </Card>
  );
};

interface PostSummaryProps {
  pendingPosts: IPost[];
  isLoading?: boolean;
  onApprove?: (postId: number) => void;
  onReject?: (postId: number) => void;
  user: IUser | null;
  totalPostApproved: number;
  totalPostPending: number
}

const PostSummary = ({ pendingPosts, isLoading, onApprove, onReject, user, totalPostApproved, totalPostPending }: PostSummaryProps) => {

  if (isLoading) {
    return (
      <Grid container>
        <Grid item xs={12} md={4} lg={3}>
          <Skeleton variant="rounded" height={300} />
        </Grid>
        <Grid item xs={12} md={4} lg={4.5}>
          <Skeleton variant="rounded" height={300} />
        </Grid>
        <Grid item xs={12} md={4} lg={4.5}>
          <Skeleton variant="rounded" height={300} />
        </Grid>
      </Grid>
    );
  }

  if (pendingPosts.length === 0) {
    return <Typography>Không có bài viết nào đang chờ duyệt.</Typography>
  }

  return (
    <Grid sx={{ display: 'flex', gap: '20px' }}>
      <Grid item xs={12} md={4} lg={3}>
        <StatsCard user={user} totalPostApproved={totalPostApproved} totalPostPending={totalPostPending} />
      </Grid>
      <Box sx={{ display: 'flex', gap: '20px' }}>
        {pendingPosts.map((post) => (
          <Grid item xs={12} md={4} key={post.id}>
            <BlogPostCard
              post={post}
              onApprove={onApprove}
              onReject={onReject}
            />
          </Grid>
        ))}
      </Box>
    </Grid>
  );
};


export default PostSummary;