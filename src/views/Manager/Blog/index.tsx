// src/views/Manager/Blog/index.tsx
import { FC, useState } from "react";
import {
  Box,
  Grid,
  Pagination,
  Typography,
  DialogActions,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import Page from "@/components/Page";
import BlogToolbar from "./components/BlogToolbar";
import useNotification from "@/hooks/useNotification";
import BlogSkeleton from "./components/BlogSkeleton";
import BlogPostCard from "./components/BlogPostCard";
import { useAppSelector } from "@/store";
import CreatePostCard from "./components/CreatePostCard";
import { getPosts, reviewPost } from "@/services/post-service";
import ConfirmDialog from "@/components/ConfirmDialog";

const ManagementBlog: FC = () => {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const [dialog, setDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject' | null;
    postId: number | null;
  }>({ open: false, type: null, postId: null });

  const [rejectionReason, setRejectionReason] = useState('');

  const [currentPostId, setCurrentPostId] = useState<number | null>(null);

  const { profile } = useAppSelector((state) => state.auth);
  const notify = useNotification();
  const queryClient = useQueryClient();

  // === 2. DATA FETCHING VỚI useQuery ===
  const { data, isLoading } = useQuery({
    queryKey: ['posts', filterStatus, page],
    queryFn: () => {
      const authorId = profile?.role === 'employee' ? profile.id : undefined;
      const limit = profile?.role === 'employee' ? 5 : 6;
      return getPosts({ page, limit, status: filterStatus, authorId });
    },
    placeholderData: keepPreviousData
  });

  // Lấy dữ liệu đã được tính toán từ `data`
  const posts = data?.data?.posts || [];
  const totalPages = data?.data?.totalPages || 0;

  // === 3. DATA MUTATIONS VỚI useMutation ===
  const reviewMutation = useMutation({
    mutationFn: (variables: { postId: number; status: 'approved' | 'rejected'; reason?: string }) =>
      reviewPost(variables.postId, { status: variables.status, rejectionReason: variables.reason }),
    onSuccess: (data, variables) => {
      const successMessage = variables.status === 'approved'
        ? `Đã chấp nhận bài viết #${variables.postId}`
        : `Đã từ chối bài viết #${variables.postId}`;
      notify({ severity: 'success', message: successMessage });
      // Làm mới lại tất cả các query có key bắt đầu bằng ['posts']
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      notify({ severity: 'error', message: error.message || 'Thao tác thất bại' });
    }
  });

  // === 4. EVENT HANDLERS (Chỉ gọi `mutate`) ===
  const handleApprove = (postId: number) => {
    setDialog({ open: true, type: 'approve', postId });
  };

  const handleReject = (postId: number) => {
    setRejectionReason('');
    setDialog({ open: true, type: 'reject', postId });
  };

  const handleCloseDialog = () => {
    setDialog({ open: false, type: null, postId: null });
  };

  const handleConfirmAction = () => {
    if (!dialog.postId) return;

    if (dialog.type === 'approve') {
      reviewMutation.mutate({ postId: dialog.postId, status: 'approved' });
    }
    else if (dialog.type === 'reject') {
      if (!rejectionReason.trim()) {
        notify({ severity: 'warning', message: 'Vui lòng nhập lý do từ chối.' });
        return;
      }
      reviewMutation.mutate({ postId: dialog.postId, status: 'rejected', reason: rejectionReason });
    }
    handleCloseDialog();
  };


  return (
    <Page title="Quản lý bài viết">
      <BlogToolbar
        onFilterChange={(status) => {
          setFilterStatus(status);
          setPage(1);
        }}
        onSearch={(term) => console.log('Searching for:', term)}
      />

      {isLoading && posts.length === 0 ? (
        <BlogSkeleton />
      ) : (
        <Grid container spacing={3}>
          {profile?.role === 'employee' && <Grid item xs={12} sm={6} md={4}><CreatePostCard /></Grid>}

          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <BlogPostCard
                post={post}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </Grid>
          ))}

          {/* Hiển thị thông báo nếu không có bài viết nào */}
          {!isLoading && posts.length === 0 && (
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
              <Typography>Không có bài viết nào phù hợp.</Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* Chỉ hiển thị pagination nếu có nhiều hơn 1 trang */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <ConfirmDialog
        open={dialog.open}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAction}
        isSubmitting={reviewMutation.isPending}

        // Tùy chỉnh props dựa trên loại dialog
        title={dialog.type === 'approve' ? 'Xác nhận duyệt bài viết' : 'Lý do từ chối'}
        content={dialog.type === 'approve' ? 'Bạn có chắc chắn muốn chấp nhận bài viết này không?' : undefined}
        confirmText={dialog.type === 'approve' ? 'Xác nhận' : 'Gửi báo cáo'}
        confirmColor={dialog.type === 'approve' ? 'primary' : 'error'}

        // Props chỉ dành cho dialog từ chối
        requiresInput={dialog.type === 'reject'}
        inputLabel="Nhập lý do"
        inputValue={rejectionReason}
        onInputChange={setRejectionReason}
      />
    </Page>
  );
}

export default ManagementBlog;