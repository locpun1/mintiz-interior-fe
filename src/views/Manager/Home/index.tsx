import Page from "@/components/Page";
import InputSearch from "@/components/SearchBar";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import AccountSummary from "../components/AccountSummary";
import PostSummary from "../components/PostSummary";
import { IPost } from "@/types/post";
import { deleteUser, DeleteUserPayload, getUser, getUsers } from "@/services/user-service";
import { getPosts } from "@/services/post-service";
import { Contact } from "@/types/contact-types";
import { getContacts } from "@/services/contact-service";
import useAuth from "@/hooks/useAuth";
import { ROLE } from "@/constants/roles";
import CustomerContact from "../components/CustomerContactSummary";
import DialogDetailCustomerInfo from "../AccountCus/components/DetailCustomerInfo";
import DialogEditAccount from "../Account/components/DialogEditAccount";
import DialogConformDeleteAccount from "../Account/components/DialogConformDeleteAccount";
import useNotification from "@/hooks/useNotification";
import DialogConformDeleteSuccess from "../Account/components/DialogConformDeleteSuccess";
import { UserProfile } from "@/types/user-types";
import DialogDetailUser from "../Account/components/DialogDetailUser";

const HomeDashboardManager: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [users, setUsers] = useState<IUser[]>([]);
    const [pendingPosts, setPendingPosts] = useState<IPost[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const { profile} = useAuth();
    const [contactId, setIdContact] = useState<string | number>('');
    const [openDialogViewCus, setOpenDialogViewCus] = useState(false);
    const [openEditAccount, setOpenEditAccount] = useState(false);
    const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
    const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
    const [openDialogDetail, setOpenDialogDetail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idUser, setIdUser] = useState<string | number>('');
    const notify = useNotification();
    const [listUser, setListUser] = useState<UserProfile | null>(null);
    
    const handleSearch = (value: string) => {
        setSearchTerm(value.trim())
    }

    const renderListApi = (role: string, searchTerm?: string) => {
        switch (role) {
            case ROLE.EMPLOYEE:
                const fetchDashboardEmployeeData = async () => {
                    try {
                        const [contactsResponse, postsResponse] = await Promise.all([
                            getContacts({ limit: 6, page: 0 }),
                            getPosts({ status: 'pending', limit: 2, page: 1 }),
                        ]);
                        setContacts(contactsResponse?.data?.contacts || []);
                        setPendingPosts(postsResponse?.data?.posts || []);
                    } catch (error) {
                        console.error("Failed to fetch dashboard data:", error);
                    }
                };
                fetchDashboardEmployeeData();
                break;
            default:
                const fetchDashboardAdminData = async () => {
                    try {
                        const [usersResponse, postsResponse] = await Promise.all([
                            getUsers({ limit: 6, page: 1, status: 0, searchTerm: searchTerm }),
                            getPosts({ status: 'pending', limit: 2, page: 1 }),
                        ]);
                        setUsers(usersResponse?.data?.users || []);
                        setPendingPosts(postsResponse?.data?.posts || []);
                    } catch (error) {
                        console.error("Failed to fetch dashboard data:", error);
                    }
                };

                fetchDashboardAdminData();
                break;
        }
    }

    useEffect(() => {
        if(profile){
            if(searchTerm){
               renderListApi(profile.role, searchTerm) 
            }else{
               renderListApi(profile.role) 
            }
        }
    }, [profile, searchTerm]);

    const handleOpenDialogViewDetail = async(id: string | number) => {
        setIdContact(id)
        setOpenDialogViewCus(true)
    }

    const handleOpenEdit = (id: string | number) => {
        setOpenEditAccount(true)
        setIdUser(id)
    }

    const handleOpenDelete = (id: string | number) => {
        setOpenDeleteAccount(true)
        setIdUser(id)
    }

    const handleDelete = async() => {
        try {
            const data: DeleteUserPayload = {
                is_deleted: 1
            }
            await deleteUser(idUser, data);
            setOpenDeleteAccount(false)
            setOpenDeleteSuccess(true)
        } catch (error: any) {
            notify({
                message: error.message,
                severity: 'error' 
            })
        }
    }

    const handleClickDetail = async(id: string | number) => {
        try {
            const res = await getUser(id);
            const data = res as any as UserProfile;
            setListUser(data)
            setOpenDialogDetail(true)
        } catch (error) {
            setListUser(null)
        }
    }

    return (
        <Box>
            <Box p={2}>
                <InputSearch
                    initialValue={searchTerm}
                    placeholder="Tìm kiếm"
                    onSearch={handleSearch}
                    style={{ width: { xs: '100%', md: '50%'}}}
                />
            </Box>
            <Page title="Dashboard">
                <Stack sx={{display:'flex',flexDirection:'column'}}>
                    {profile.role === ROLE.ADMIN && (
                        <Box p={1}>
                            <SummaryCard
                                title="Quản lý tài khoản"
                                seeMoreLink="/user-account" 
                            >
                                <AccountSummary 
                                    handleClickDetail={handleClickDetail} 
                                    users={users} 
                                    handleOpenEdit={handleOpenEdit} 
                                    handleOpenDelete={handleOpenDelete} 
                                />
                            </SummaryCard>
                        </Box>
                    )}
                    {profile.role === ROLE.EMPLOYEE && (
                        <Box p={1}>
                            <SummaryCard
                                title="Quản lý thông tin"
                                seeMoreLink="/customer-info"
                            >
                                <CustomerContact handleClick={handleOpenDialogViewDetail} contacts={contacts}/>
                            </SummaryCard>
                        </Box>
                    )}
                    <SummaryCard
                        title="Quản lý bài viết"
                        seeMoreLink="/manager/blog" 
                    >
                        <PostSummary pendingPosts={pendingPosts} />
                    </SummaryCard>
                </Stack>
            </Page>
            {openDialogViewCus && contactId && (
                <DialogDetailCustomerInfo
                    open={openDialogViewCus}
                    onClose={() => { setOpenDialogViewCus(false)}}
                    contactId={contactId}
                />
            )}
            {openDialogDetail && listUser &&  (
                <DialogDetailUser
                    open={openDialogDetail}
                    onClose={() => {
                        setOpenDialogDetail(false)
                    }}
                    userDetail={listUser}
                />
            )}
            {openEditAccount &&  (
                <DialogEditAccount
                    open={openEditAccount}
                    onClose={() => {
                        setOpenEditAccount(false)
                        renderListApi(ROLE.ADMIN)
                    }}
                    userId={idUser}
                />
            )}
            {openDeleteAccount && (
                <DialogConformDeleteAccount
                    open={openDeleteAccount}
                    handleClose={() => {
                        setOpenDeleteAccount(false)
                    }}
                    handleAgree={handleDelete}
                />
            )}
            {openDeleteSuccess && (
                <DialogConformDeleteSuccess
                    open={openDeleteSuccess}
                    handleClose={() => {
                        setOpenDeleteSuccess(false)
                        renderListApi(ROLE.ADMIN)
                    }}
                />
            )}
        </Box>
    )
}

export default HomeDashboardManager;