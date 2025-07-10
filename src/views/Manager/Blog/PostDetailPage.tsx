// src/views/Manager/Blog/PostDetailPage.tsx
import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, Paper, CircularProgress, Button as MuiButton, Chip, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Page from '@/components/Page';
import { getPostById, reviewPost } from '@/services/post-service';
import useNotification from '@/hooks/useNotification';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useState } from 'react';
import Button from '@/components/Button/Button';

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
};

const PostDetailPage: FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const notify = useNotification();
  const queryClient = useQueryClient();

  const [dialog, setDialog] = useState<{ open: boolean; type: 'approve' | 'reject' | null }>({ open: false, type: null });
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(Number(postId)),
    enabled: !!postId,
  });

  const reviewMutation = useMutation({
    mutationFn: (variables: { status: 'approved' | 'rejected'; reason?: string }) =>
      reviewPost(Number(postId), { status: variables.status, rejectionReason: variables.reason }),
    onSuccess: (data, variables) => {
      const successMessage = variables.status === 'approved' ? `Đã chấp nhận bài viết` : `Đã từ chối bài viết`;
      notify({ severity: 'success', message: successMessage });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setDialog({ open: false, type: null });
    },
    onError: (error: any) => {
      notify({ severity: 'error', message: error.message || 'Thao tác thất bại' });
    }
  });


  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  if (isError || !post) {
    return <Typography>Không thể tải bài viết hoặc bài viết không tồn tại.</Typography>;
  }

  // Xử lý dialog
  const handleOpenDialog = (type: 'approve' | 'reject') => {
    setRejectionReason('');
    setDialog({ open: true, type });
  };

  const handleConfirmAction = () => {
    if (dialog.type === 'approve') {
      reviewMutation.mutate({ status: 'approved' });
    } else if (dialog.type === 'reject') {
      if (!rejectionReason.trim()) {
        notify({ severity: 'warning', message: 'Vui lòng nhập lý do từ chối.' });
        return;
      }
      reviewMutation.mutate({ status: 'rejected', reason: rejectionReason });
    }
  };

  return (
    <Page title={`Chi tiết: ${post?.data?.title}`}>
      <MuiButton
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 2, textTransform: 'none', background: 'none',
          color: '#171717',
          fontSize: '21px',
          fontWeight: '700'
        }}
      >
        Xem chi tiết bài viết
      </MuiButton>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip label={post?.data?.category || ''} sx={{ color: "#171717", fontSize: '16px', fontWeight: '700' }} size="small" />
          <Typography variant="body2" color="text.secondary">
            {formatDate(post?.data?.createdAt)}
          </Typography>
        </Stack>

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {post?.data?.title}
        </Typography>

        {post?.data?.imageUrl && (
          <Box
            component="img"
            src={`${import.meta.env.VITE_API_BASE_URL}${post.data.imageUrl}`}
            alt={post.data.title}
            sx={{
              width: '100%',
              maxHeight: '500px',
              objectFit: 'cover',
              borderRadius: 2,
              my: 3,
            }}
          />
        )}

        {/* Dùng dangerouslySetInnerHTML để render HTML */}
        <Box
          sx={{
            lineHeight: 1.8,
            '& ul, & ol': { pl: 3 },
            '& p': { mb: 2 },
          }}
          dangerouslySetInnerHTML={{ __html: post?.data?.content }}
        />

        {/* Chỉ hiển thị nút khi bài viết đang chờ duyệt */}
        {post?.data?.status === 'pending' && (
          <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
            <Button
              customVariant="secondary"
              width={135}
              padding='8px 20px'
              borderRadius='16px'
              backgroundColor='#FFFFFF'
              border='2px solid #1C1A1B'
              fontColor='#1C1A1B'
              fontSize='16px'
              fontWeight='500'
              handleFunt={() => handleOpenDialog('approve')}
            >
              Chấp nhận
            </Button>
            <Button
              customVariant="secondary"
              width={135}
              padding='8px 20px'
              borderRadius='16px'
              backgroundColor='#FFFFFF'
              border='2px solid #1C1A1B'
              fontColor='#1C1A1B'
              fontSize='16px'
              fontWeight='500'
              handleFunt={() => handleOpenDialog('reject')}
            >
              Từ chối
            </Button>
          </Stack>
        )}
      </Paper>

      <ConfirmDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, type: null })}
        onConfirm={handleConfirmAction}
        isSubmitting={reviewMutation.isPending}
        title={dialog.type === 'approve' ? 'Xác nhận duyệt bài viết' : 'Lý do từ chối'}
        content={dialog.type === 'approve' ? 'Bạn có chắc chắn muốn chấp nhận bài viết này không?' : undefined}
        confirmText={dialog.type === 'approve' ? 'Xác nhận' : 'Gửi'}
        confirmColor={dialog.type === 'approve' ? 'primary' : 'error'}
        requiresInput={dialog.type === 'reject'}
        inputLabel="Nhập lý do"
        inputValue={rejectionReason}
        onInputChange={setRejectionReason}
      />
    </Page>
  );
};

export default PostDetailPage;