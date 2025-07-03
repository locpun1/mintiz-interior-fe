import Page from "@/components/Page";
import InputSearch from "@/components/SearchBar";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import AccountSummary from "../components/AccountSummary";
import PostSummary from "../components/PostSummary";
import { IPost } from "@/types/post";
import { getUsers } from "@/services/user-service";
import { getPosts } from "@/services/post-service";
import { Contact } from "@/types/contact-types";
import { getContacts } from "@/services/contact-service";
import useAuth from "@/hooks/useAuth";
import { ROLE } from "@/constants/roles";
import CustomerContact from "../components/CustomerContactSummary";
import DialogDetailCustomerInfo from "../AccountCus/components/DetailCustomerInfo";

const HomeDashboardManager: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [users, setUsers] = useState<IUser[]>([]);
    const [pendingPosts, setPendingPosts] = useState<IPost[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const { profile} = useAuth();
    const [contactId, setIdContact] = useState<string | number>('');
    const [openDialogViewCus, setOpenDialogViewCus] = useState(false);

    const handleSearch = (value: string) => {
        setSearchTerm(value.trim())
    }

    const renderListApi = (role: string) => {
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
                            getUsers({ limit: 6, page: 1 }),
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
            renderListApi(profile.role)
        }
    }, [profile]);

    const handleOpenDialogViewDetail = async(id: string | number) => {
        setIdContact(id)
        setOpenDialogViewCus(true)
    }

    return (
        <Box>
            <InputSearch
                initialValue={searchTerm}
                placeholder="Tìm kiếm"
                onSearch={handleSearch}
                style={{ width: '50%'}}
            />
            <Page title="Dashboard">
                <Stack sx={{display:'flex',flexDirection:'column'}}>
                    {profile.role === ROLE.ADMIN && (
                        <SummaryCard
                            title="Quản lý tài khoản"
                            seeMoreLink="/account" 
                        >
                            <AccountSummary users={users} />
                        </SummaryCard>
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
        </Box>
    )
}

export default HomeDashboardManager;