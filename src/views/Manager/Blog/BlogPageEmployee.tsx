import IconButton from "@/components/IconButton/IconButton";
import InputSearch from "@/components/SearchBar";
import { BorderBottom, NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import Grid from "@mui/material/Grid2";
import CreatePostCard from "./components/CreatePostCard";
import BlogPageManager from "./BlogPageManager";
import { getPosts, publishPost } from "@/services/post-service";
import { useAppSelector } from "@/store";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import BlogCreateCard from "./components/BlogCreateCard";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { useNavigate } from "react-router-dom";
import BlogPostCard from "./components/BlogPostCard";
import useNotification from "@/hooks/useNotification";

const BlogPageEmployee = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllBlogCreate, setShowAllBlogCreate] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [showAllBlog, setShowAllBlog] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const navigate = useNavigate();
    const notify = useNotification();
    const queryClient = useQueryClient();

    const { profile } = useAppSelector((state) => state.auth);

    const [dialog, setDialog] = useState<{
        open: boolean;
        type: 'approve' | 'reject' | null;
        postId: number | null;
    }>({ open: false, type: null, postId: null });

    const { data, isLoading } = useQuery({
        queryKey: ['posts', 'pending', page],
        queryFn: () => {
        const authorId = profile ? profile.id : undefined;
        const limit = 7;
        return getPosts({ page, limit, status: 'pending', authorId });
        },
        placeholderData: keepPreviousData
    });

    const posts = data?.data?.posts || [];
    const totalPages = data?.data?.totalPages || 0;

    const { data: dataPost } = useQuery({
        queryKey: ['posts', page],
        queryFn: () => {
        const authorId = profile ? profile.id : undefined;
        const limit = 7;
        return getPosts({ page, limit, authorId });
        },
        placeholderData: keepPreviousData
    });

    const allPosts = dataPost?.data?.posts || [];
    const totalAllPages = dataPost?.data?.totalPages || 0;

    // Tính toán danh sách hiển thị
    const displayedPosts = useMemo(() => {
        if (posts.length === 0) return [];
        return showAllBlogCreate ? posts : posts.slice(0, 3);
    }, [posts, showAllBlogCreate]);
  
    const displayedAllPosts = useMemo(() => {
        if (allPosts.length === 0) return [];
        return showAllBlog ? allPosts : allPosts.slice(0, 4);
    }, [allPosts, showAllBlog]);

    const handleSearch = (value: string) => {
        setSearchTerm(value.trim())
    }

    const handleShowAllBlogCreate = () => {
        setShowAllBlogCreate(true);
        setShowAll(true)
    }

    const handleShowAllBlog = () => {
        setShowAllBlog(true)
        setShowAll(true)
    }

    const handlePagePostCreate = (newPage: number) => {
        setPage(newPage)
    }

    const publishMutation = useMutation({
        mutationFn: (variables: { postId: number, publish: boolean }) =>
            publishPost(variables.postId, { publish: variables.publish }),
        onSuccess: (data, variables) => {
            notify({
                severity: 'success',
                message: variables.publish ? 'Đăng tải bài viết thành công' : 'Hủy đăng tải thành công'
            });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error: any) => {
            notify({ severity: 'error', message: error.message || 'Thao tác thất bại' });
        }
    });

    const handlePublish = (postId: number, currentState: boolean) => {
        publishMutation.mutate({ postId, publish: !currentState });
    };

    const handleEdit = (postId: number) => navigate(`/manage/blog/edit/${postId}`);
    return(
        <Box p={2}>
            {!showAll &&(
                <>
                    <InputSearch
                        initialValue={searchTerm}
                        placeholder="Tìm kiếm"
                        onSearch={handleSearch}
                    />
                    <Box onClick={handleShowAllBlogCreate} sx={{ cursor: 'pointer'}} py={2} display='flex' justifyContent='space-between'>
                        <Typography variant="h6" fontWeight={600}>Tạo bài viết mới</Typography>
                        <Stack>
                            <Typography pt={1} fontWeight={600} variant="subtitle2">Xem thêm</Typography>
                            <IconButton
                            handleFunt={handleShowAllBlogCreate}
                            icon={<NavigateNext sx={{ width: "28px", height: "28px" }} />}
                            />
                        </Stack>
                    </Box>
                    <Grid spacing={2} container>
                        <Grid size={{ xs: 12, sm:6, md: 4, lg: 3}}>
                            <CreatePostCard/>
                        </Grid>
                        {displayedPosts.length === 0 ? (
                            <Typography>Không tồn tại bản ghi nào cả</Typography>
                        ) : (
                            displayedPosts.map((item, index) => {
                                return(
                                    <Grid size={{ xs: 12, sm:6, md: 4, lg: 3}} key={item.id}>
                                        <BlogCreateCard blog={item}/>
                                    </Grid>
                                )
                            })
                        )}
                    </Grid>
                    <Box onClick={handleShowAllBlog} sx={{ cursor: 'pointer'}} py={2} display='flex' justifyContent='space-between'>
                        <Typography variant="h6" fontWeight={600}>Kiểm soát bài đăng</Typography>
                        <Stack>
                            <Typography pt={1} fontWeight={600} variant="subtitle2">Xem thêm</Typography>
                            <IconButton
                            handleFunt={handleShowAllBlog}
                            icon={<NavigateNext sx={{ width: "28px", height: "28px" }} />}
                            />
                        </Stack>
                    </Box>
                    <Grid spacing={2} container>
                        {displayedAllPosts.length === 0 ? (
                            <Typography>Không tồn tại bản ghi nào cả</Typography>
                        ) : (
                            displayedAllPosts.map((item, index) => {
                                const canEmployeePublish = item.status === 'approved';
                                const canEmployeeEdit = (item.status === 'pending' || item.status === 'rejected');
                                return(
                                    <Grid size={{ xs: 12, sm:6, md: 4, lg: 3}} key={item.id}>
                                        <BlogPostCard 
                                            post={item}
                                            onPublish={canEmployeePublish ? handlePublish : undefined}
                                            onEdit={canEmployeeEdit ? handleEdit : undefined}
                                        />
                                    </Grid>
                                )
                            })
                        )}
                    </Grid>                
                </>
            )}
            {showAllBlog && showAll && (
                <>
                <Stack onClick={() => {setShowAllBlog(false), setShowAll(false)}} mb={2} sx={{ cursor: 'pointer'}}> 
                    <IconButton
                        handleFunt={() => {setShowAllBlog(false), setShowAll(false)}}
                        icon={<NavigateBefore sx={{ width: "28px", height: "28px" }} />}
                    />
                    <Typography variant="h6" fontWeight={600}>Kiểm soát bài đăng</Typography>
                </Stack>
                <BlogPageManager/>
                </>
            )}
            {showAllBlogCreate && showAll && (
                <>
                    <Box display='flex' flexDirection='column' onClick={() => {setShowAllBlogCreate(false), setShowAll(false)}} mb={2} sx={{ cursor: 'pointer'}}> 
                        <Stack mb={2} direction='row'>
                            <IconButton
                                handleFunt={() => {setShowAllBlogCreate(false), setShowAll(false)}}
                                icon={<NavigateBefore sx={{ width: "28px", height: "28px" }} />}
                            />
                            <Typography variant="h6" fontWeight={600}>Tạo bài viết mới</Typography>                            
                        </Stack>

                        <Grid spacing={2} container>
                            <Grid size={{ xs: 12, sm:6, md: 4, lg: 3}}>
                                <CreatePostCard/>
                            </Grid>
                            {displayedPosts.length === 0 ? (
                                <Typography>Không tồn tại bản ghi nào cả</Typography>
                            ) : (
                                displayedPosts.map((item, index) => {
                                    return(
                                        <Grid size={{ xs: 12, sm:6, md: 4, lg: 3}} key={item.id}>
                                           <BlogCreateCard blog={item}/>
                                        </Grid>
                                    )
                                })
                            )}
                        </Grid>
                        <Box display='flex' justifyContent='center'>
                            <CustomPagination
                                page={page}
                                count={totalPages}
                                rowsPerPage={7}
                                onPageChange={handlePagePostCreate}
                            />
                        </Box>
                    </Box> 
                </>
            )}
        </Box>
    )
}

export default BlogPageEmployee;