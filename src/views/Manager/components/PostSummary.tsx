// src/views/Manager/components/PostSummary.tsx
import { IPost } from '@/types/post';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Skeleton, Stack, Typography, useTheme } from '@mui/material';

const StatsCard = () => {
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
            <Box>
                <Typography variant="body1" fontWeight={500}>Họ tên: Nguyễn Văn Cường</Typography>
                <Typography variant="body2" color="text.secondary">Chức vụ: Quản lý cấp cao</Typography>
            </Box>

            <Stack spacing={2} my={2} textAlign="center">
                <Box>
                    <Typography variant="h2" fontWeight={700} color={theme.palette.warning.main}>05</Typography>
                    <Typography variant="subtitle1">Bài viết chưa được phê duyệt</Typography>
                </Box>
                <Box>
                    <Typography variant="h2" fontWeight={700} color={theme.palette.success.main}>18</Typography>
                    <Typography variant="subtitle1">Bài viết đã duyệt thành công</Typography>
                </Box>
            </Stack>
        </Card>
    );
};

interface PostCardProps {
    post: IPost;
}

// Thẻ bài viết
const PostCard = ({ post }: PostCardProps) => {
    return (
        <Card variant="outlined" sx={{
            borderRadius: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            border: 'none',
            boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
        }}>
            <CardMedia
                component="img"
                height="160"
                image="https://via.placeholder.com/400x200"
                alt={post.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" fontWeight={600}>
                    {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {post.content.substring(0, 100)}...
                    <Typography component="a" href="#" sx={{ textDecoration: 'none' }}>Xem thêm</Typography>
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-around', p: 2 }}>
                <Button variant="contained" color="primary" sx={{ borderRadius: '20px', px: 4 }}>Chấp nhận</Button>
                <Button variant="outlined" color="error" sx={{ borderRadius: '20px', px: 4 }}>Từ chối</Button>
            </CardActions>
        </Card>
    );
};

interface PostSummaryProps {
    pendingPosts: IPost[];
    isLoading?: boolean;
}

const PostSummary = ({ pendingPosts, isLoading }: PostSummaryProps) => {

    if (isLoading) {
        return (
            <Grid container spacing={3}>
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
        <Grid >
            <Grid item xs={12} md={4} lg={3}>
                <StatsCard />
            </Grid>
            {pendingPosts.map((post) => (
                <Grid item xs={12} md={4} key={post.id}>
                    <PostCard post={post} />
                </Grid>
            ))}
        </Grid>
    );
};


export default PostSummary;