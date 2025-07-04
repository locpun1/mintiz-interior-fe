import Page from "@/components/Page";
import InputSearch from "@/components/SearchBar";
import { Box, Stack } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import AccountSummary from "../components/AccountSummary";
import PostSummary from "../components/PostSummary";
import { IPost } from "@/types/post";
import { getUsers } from "@/services/user-service";
import { getPosts, reviewPost } from "@/services/post-service";
import { IUser } from "@/types/user";
import useNotification from "@/hooks/useNotification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "@/components/ConfirmDialog";

const HomeDashboardManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [pendingPosts, setPendingPosts] = useState<IPost[]>([]);
  const [dialog, setDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject' | null;
    postId: number | null;
  }>({ open: false, type: null, postId: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const notify = useNotification();
  const queryClient = useQueryClient();

  const handleSearch = (value: string) => {
    setSearchTerm(value.trim())
  }

  const fetchDashboardData = useCallback(async () => {
    try {
      const [usersResponse, postsResponse] = await Promise.all([
        getUsers({ limit: 6, page: 1, status: 0 }),
        getPosts({ status: 'pending', limit: 2, page: 1 })
      ]);
      setUsers(usersResponse?.data?.users || []);
      setPendingPosts(postsResponse?.data?.posts || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      notify({ severity: 'error', message: 'Tải dữ liệu dashboard thất bại' });
    }
  }, [notify]);
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const reviewMutation = useMutation({
    mutationFn: (variables: { postId: number; status: 'approved' | 'rejected'; reason?: string }) =>
      reviewPost(variables.postId, { status: variables.status, rejectionReason: variables.reason }),
    onSuccess: (data, variables) => {
      const successMessage = variables.status === 'approved'
        ? `Đã chấp nhận bài viết`
        : `Đã từ chối bài viết`;
      notify({ severity: 'success', message: successMessage });

      fetchDashboardData();
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      notify({ severity: 'error', message: error.message || 'Thao tác thất bại' });
    }
  });

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
    <Box>
      <InputSearch
        initialValue={searchTerm}
        placeholder="Tìm kiếm"
        onSearch={handleSearch}
      />
      <Page title="Dashboard">
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <SummaryCard
            title="Quản lý tài khoản"
            seeMoreLink="/manager/account"
          >
            <AccountSummary users={users} />
          </SummaryCard>
          <SummaryCard
            title="Quản lý bài viết"
            seeMoreLink="/manager/blog"
          >
            <PostSummary pendingPosts={pendingPosts}
              onApprove={handleApprove}
              onReject={handleReject} />
          </SummaryCard>
        </Box>
      </Page>
      <ConfirmDialog
        open={dialog.open}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAction}
        isSubmitting={reviewMutation.isPending}
        title={dialog.type === 'approve' ? 'Xác nhận duyệt bài viết' : 'Lý do từ chối'}
        content={dialog.type === 'approve' ? 'Bạn có chắc chắn muốn chấp nhận bài viết này không?' : undefined}
        confirmText={dialog.type === 'approve' ? 'Xác nhận' : 'Gửi báo cáo'}
        confirmColor={dialog.type === 'approve' ? 'primary' : 'error'}
        requiresInput={dialog.type === 'reject'}
        inputLabel="Nhập lý do"
        inputValue={rejectionReason}
        onInputChange={setRejectionReason}
      />
    </Box>
  )
}

export default HomeDashboardManager;