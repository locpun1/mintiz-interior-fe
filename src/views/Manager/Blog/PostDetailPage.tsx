// src/views/Manager/Blog/PostDetailPage.tsx
import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, Paper, CircularProgress, Button as MuiButton, Chip, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Page from '@/components/Page';
import { getPostById, publishPost, reviewPost } from '@/services/post-service';
import useNotification from '@/hooks/useNotification';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import useAuth from '@/hooks/useAuth';

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
};

const getStatusInfo = (status: 'pending' | 'approved' | 'rejected') => {
  switch (status) {
    case 'approved': return { label: 'Đã duyệt', color: 'success' as const };
    case 'rejected': return { label: 'Bị từ chối', color: 'error' as const };
    case 'pending': default: return { label: 'Chờ duyệt', color: 'warning' as const };
  }
};

const PostDetailPage: FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const notify = useNotification();
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const [dialog, setDialog] = useState<{ open: boolean; type: 'approve' | 'reject' | 'publish' | null }>({ open: false, type: null }); 
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: postResponse, isLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(Number(postId)),
    enabled: !!postId,
  });

  const post = postResponse?.data;

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

  const publishMutation = useMutation({
    mutationFn: (variables: { isPublished: boolean }) => publishPost(Number(postId), { publish: variables.isPublished }),
    onSuccess: (data, variables) => {
      const successMessage = variables.isPublished ? 'Đã đăng tải bài viết' : 'Đã hủy đăng bài viết';
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

  const isAdmin = profile?.role === 'admin';
  const isEmployee = profile?.role === 'employee';

  const canAdminReview = isAdmin && post.status === 'pending';
  const canEmployeePublish = isEmployee && post.status === 'approved';
  const canEmployeeEdit = isEmployee && (post.status === 'pending' || post.status === 'rejected');

  const statusInfo = getStatusInfo(post.status);

  const handleOpenDialog = (type: 'approve' | 'reject' | 'publish') => {
    setRejectionReason('');
    setDialog({ open: true, type });
  };

  const handleEdit = () => {
    navigate(`/manage/blog/edit/${postId}`);
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
    } else if (dialog.type === 'publish') {
      publishMutation.mutate({ isPublished: !post.isPublished });
    }
  };

  return (
    <Page title={`Chi tiết: ${post?.title}`}>
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
          <Chip label={post?.category || ''} sx={{ color: "#171717", fontSize: '16px', fontWeight: '700' }} size="small" />
          <Typography variant="body2" color="text.secondary">
            {formatDate(post?.createdAt)}
          </Typography>
        </Stack>

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {post?.title}
        </Typography>

        {post?.imageUrl && (
          <Box
            component="img"
            src={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`}
            alt={post.title}
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
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />
        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
          {/* Nút chỉ dành cho ADMIN */}
          {canAdminReview && (
            <>
              <Button handleFunt={() => handleOpenDialog('approve')}>Chấp nhận</Button>
              <Button handleFunt={() => handleOpenDialog('reject')}>Từ chối</Button>
            </>
          )}

          {/* Nút chỉ dành cho EMPLOYEE */}
          {canEmployeePublish && (
            <Button
              customVariant="primary"
              handleFunt={() => handleOpenDialog('publish')}
            >
              {post.isPublished ? 'Hủy Đăng' : 'Đăng Tải'}
            </Button>
          )}

          {canEmployeeEdit && (
            <Button
              customVariant="secondary"
              handleFunt={handleEdit}
            >
              Chỉnh Sửa
            </Button>
          )}
        </Stack>
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