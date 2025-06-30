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

const HomeDashboardManager: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [users, setUsers] = useState<IUser[]>([]);
    const [pendingPosts, setPendingPosts] = useState<IPost[]>([]);
    const handleSearch = (value: string) => {
        setSearchTerm(value.trim())
    }

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersResponse, postsResponse] = await Promise.all([
                    getUsers({ limit: 6, page: 1 }),
                    getPosts({ status: 'pending', limit: 2, page: 1 })
                ]);
                setUsers(usersResponse?.data?.users || []);
                setPendingPosts(postsResponse?.data?.posts || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <Box>
            <InputSearch
                initialValue={searchTerm}
                placeholder="Tìm kiếm"
                onSearch={handleSearch}
            />
            <Page title="Dashboard">
                <Stack sx={{display:'flex',flexDirection:'column'}}>
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
                        <PostSummary pendingPosts={pendingPosts} />
                    </SummaryCard>
                </Stack>
            </Page>
        </Box>
    )
}

export default HomeDashboardManager;