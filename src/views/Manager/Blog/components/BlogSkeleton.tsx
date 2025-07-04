// src/views/Manager/Blog/components/BlogSkeleton.tsx
import { Box, Grid, Skeleton, Stack } from '@mui/material';

const BlogSkeleton = () => {
  return (
    <Grid container spacing={3}>
      {Array.from(new Array(6)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Box>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 4 }} />
            <Skeleton variant="text" sx={{ fontSize: '1.25rem', mt: 1 }} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
            <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'space-around' }}>
              <Skeleton variant="rounded" width={120} height={40} />
              <Skeleton variant="rounded" width={120} height={40} />
            </Stack>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default BlogSkeleton;