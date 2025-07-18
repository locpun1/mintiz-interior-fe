import Page from "@/components/Page";
import InputSearch from "@/components/SearchBar";
import { Box, Stack } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import AccountSummary from "../components/AccountSummary";
import PostSummary from "../components/PostSummary";
import { IPost } from "@/types/post";
import { deleteUser, UserPayload, getUser, getUsers } from "@/services/user-service";
import { getPosts, reviewPost } from "@/services/post-service";
import { IUser } from "@/types/user";
import useNotification from "@/hooks/useNotification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "@/components/ConfirmDialog";
import useAuth from "@/hooks/useAuth";
import { ROLE } from "@/constants/roles";
import { Contact } from "@/types/contact-types";
import {  getContacts } from "@/services/contact-service";
import CustomerContact from "../components/CustomerContactSummary";
import DialogDetailCustomerInfo from "../AccountCus/components/DetailCustomerInfo";
import { UserProfile } from "@/types/user-types";
import DialogDetailUser from "../Account/components/DialogDetailUser";
import DialogEditAccount from "../Account/components/DialogEditAccount";
import DialogConformDeleteAccount from "../Account/components/DialogOpenConfirmAccount";
import DialogConformDeleteSuccess from "../Account/components/DialogConfirmSuccess";

const HomeDashboardManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pendingPosts, setPendingPosts] = useState<IPost[]>([]);
  const [dialog, setDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject' | null;
    postId: number | null;
  }>({ open: false, type: null, postId: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const notify = useNotification();
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const [openDialogViewContact, setOpenDialogViewContact] = useState(false);
  const [openDialogView, setOpenDialogView] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogDeleteSuccess, setOpenDialogDeleteSuccess] = useState(false);

  const [contactId, setIdContact] = useState<string | number>('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | number>('');

  const menuCodes: string[] = JSON.parse(localStorage.getItem('menuCodes') || '[]');
  console.log("menuCodes: ", menuCodes);
  

  const handleSearch = (value: string) => {
    setSearchTerm(value.trim())
  }

  const fetchDashboardData = useCallback(async () => {
    try {
      const postParams = {
        status: 'pending' as const,
        limit: 2,
        page: 1,
        authorId: profile?.role === 'employee' ? profile.id : undefined,
      };

      const [usersResponse, postsResponse] = await Promise.all([
        getUsers({ limit: 6, page: 1, status: 0 }),
        getPosts(postParams)
      ]);
      setUsers(usersResponse?.data?.users || []);
      setPendingPosts(postsResponse?.data?.posts || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      notify({ severity: 'error', message: 'Tải dữ liệu dashboard thất bại' });
    }
  }, [notify]);

  const fetchDashboardDataEmployee = useCallback(async () => {
    try {
      const [contactsResponse, postsResponse] = await Promise.all([
        getContacts({ limit: 6, page: 0, searchTerm: searchTerm }),
        getPosts({ status: 'pending', limit: 2, page: 1 })
      ]);
      setContacts(contactsResponse?.data?.contacts || []);
      setPendingPosts(postsResponse?.data?.posts || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      notify({ severity: 'error', message: 'Tải dữ liệu dashboard thất bại' });
    }
  }, [notify]);
  
  const renderApiList = (role: string) => {
    switch (role) {
      case ROLE.EMPLOYEE:
        fetchDashboardDataEmployee()
        break;
      default:
        fetchDashboardData()
        break;
    }
  }

  useEffect(() => {
    if(profile){
      renderApiList(profile.role)
    }
  }, [profile]);

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

  const handleOpenViewContact = (id: string | number) => {
    setOpenDialogViewContact(true)
    setIdContact(id)
  }

  const handleOpenView = async(id: string | number) => {
    try {
      const res = await getUser(id);
      const data = res as any as UserProfile;
      setUser(data);
      setOpenDialogView(true)
    } catch (error: any) {
      setUser(null)
    }
  }

  const handleOpenDelete = (id: string | number) => {
    setOpenDialogDelete(true);
    setUserId(id);
  }

  const handleDelete = async() => {
    try {
      const data: UserPayload = {
        is_deleted: 1
      }
      await deleteUser(userId, data);
      setOpenDialogDelete(false);
      setOpenDialogDeleteSuccess(true)
    } catch (error: any) {
      notify({
        message: error.message,
        severity: 'error'
      })
    }
  }

  const handleOpenEdit = (id: string | number) => {
    setOpenDialogEdit(true)
    setUserId(id);
  }
  const canReview = useMemo(() => profile?.role === 'admin', [profile?.role]);

  return (
    <Box p={2}>
      <InputSearch
        initialValue={searchTerm}
        placeholder="Tìm kiếm"
        onSearch={handleSearch}
      />
      <Page title="Dashboard">
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {profile?.role === ROLE.ADMIN && (
            <Box my={1.5}>
              <SummaryCard
                title="Quản lý tài khoản"
                seeMoreLink="/manage/account"
              >
                <AccountSummary 
                  users={users} 
                  handleOpenView={handleOpenView} 
                  handleOpenDelete={handleOpenDelete}
                  handleOpenEdit={handleOpenEdit}
                />
              </SummaryCard>
            </Box>
          )}
          {profile?.role === ROLE.EMPLOYEE && menuCodes.includes('002') && (
            <Box my={1.5}>
              <SummaryCard
                title="Quản lý thông tin"
                seeMoreLink="/manage/customer-info"
              >
                <CustomerContact contacts={contacts} handleClick={handleOpenViewContact}/>
              </SummaryCard>
            </Box>
          )}
          {profile?.role === ROLE.ADMIN || (profile?.role === ROLE.EMPLOYEE && menuCodes.includes('003')) && (
            <Box mt={1.5}>
              <SummaryCard
                title="Quản lý bài viết"
                seeMoreLink="/manage/blog"
              >
                <PostSummary pendingPosts={pendingPosts}
                  onApprove={canReview ? handleApprove : undefined}
                  onReject={canReview ? handleReject : undefined}
                />
              </SummaryCard> 
            </Box>
          )}

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
      {openDialogViewContact && contactId && (
        <DialogDetailCustomerInfo
          open={openDialogViewContact}
          onClose={() => { setOpenDialogViewContact(false)}}
          contactId={contactId}
        />
      )}
      {openDialogView && user && (
        <DialogDetailUser
          open={openDialogView}
          onClose={() => {
            setOpenDialogView(false)
          }}
          userDetail={user}
        />
      )}
      {openDialogEdit && (
        <DialogEditAccount
          open={openDialogEdit}
          onClose={() => {
            setOpenDialogEdit(false);
            renderApiList(ROLE.ADMIN)
          }}
          userId={userId}
        />
      )}
      {openDialogDelete && (
        <DialogConformDeleteAccount
          open={openDialogDelete}
          handleClose={() => {
            setOpenDialogDelete(false)
          }}
          handleAgree={handleDelete}
          title="Bạn chắc chắn muốn xóa tài khoản này chứ? Tài khoản này sẽ bị vô hiệu hóa"
        />
      )}
      {openDialogDeleteSuccess && (
        <DialogConformDeleteSuccess
          open={openDialogDeleteSuccess}
          handleClose={() => {
            setOpenDialogDeleteSuccess(false)
            renderApiList(ROLE.ADMIN)
          }}
          title="Xin chúc mừng. Bạn vừa xóa tài khoản thành công"
        />
      )}
    </Box>
  )
}

export default HomeDashboardManager;