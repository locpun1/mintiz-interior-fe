import { Alert, Box, CircularProgress, IconButton, Paper, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Grid from '@mui/material/Grid2';
import AddCard from "../../Account/components/AddCard";
import { IDesignAndBuild } from "@/types/settings";
import { deleteDesignAndBuild, getDesignAndBuilds } from "@/services/settings-service";
import { debounce } from "lodash";
import CommonImage from "@/components/Image/index";
import { getPathImage } from "@/utils/url";
import AddDesignAndBuilds from "./AddDesignAndBuilds";
import { Delete, Edit } from "@mui/icons-material";
import ModalDetailDesignAndBuild from "./ModalDetailDesignAndBuild";
import useNotification from "@/hooks/useNotification";
import CustomPagination from "@/components/Pagination/CustomPagination";

interface DesignAndBuildProps{
    searchTerm: string
}

const DesignAndBuild: React.FC<DesignAndBuildProps> = ({ searchTerm }) => {
    const notify = useNotification();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [designAndBuilds, setDesignAndBuilds] = useState<IDesignAndBuild[]>([]);
    const [designAndBuild, setDesignAndBuild] = useState<IDesignAndBuild | null>(null);
    const [designAndBuildId, setDesignAndBuildId] = useState<string | number>('');


    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openAddDesignAndBuild, setOpenAddDesignAndBuild] = useState(false);
    const [openEditDesignAndBuild, setOpenEditDesignAndBuild] = useState(false);


    const fetchDesignAndBuilds = useCallback(async(currentPage: number, currentSize: number, currentSearch?: string) => {
        setLoading(true);
        try {
            const response = await getDesignAndBuilds({ page: currentPage, size: currentSize, searchTerm: currentSearch });
            const data = response.data?.designAndBuilds as any as IDesignAndBuild[];
            setDesignAndBuilds(data);
            response.data?.totalDesignAndBuilds && setTotal(response.data.totalDesignAndBuilds);
        } catch (error: any) {
            setError(error.message);
            setDesignAndBuilds([]);
            setTotal(0)
        }finally{
            setLoading(false);
        }
    }, []);

    const debounceGetDesignAndBuilds = useMemo(
        () => debounce((currentPage: number, currentSize: number, currentSearch?: string) => {
            fetchDesignAndBuilds(currentPage, currentSize, currentSearch);
        }, 500),
        [fetchDesignAndBuilds]
    )

    useEffect(() => {
        if(searchTerm){
            debounceGetDesignAndBuilds(page, rowsPerPage, searchTerm)
        }else{
            fetchDesignAndBuilds(page, rowsPerPage)
        }
    }, [page, rowsPerPage, searchTerm]);

    const handleOpenAddDesignAndBuild = () => {
        setOpenAddDesignAndBuild(true)
    }

    const handleLoad = () => {
        fetchDesignAndBuilds(0, rowsPerPage)
    }

    const handleOpenModal = (item: IDesignAndBuild) => {
        setDesignAndBuild(item)
        setOpenModal(true)
    }

    const handleOpenEdit = (id: string | number) => {
        setDesignAndBuildId(id)
        setOpenEditDesignAndBuild(true)
        setOpenAddDesignAndBuild(false)
    }

    const handleDelete = async(id: string | number) => {
        try {
            const res = await deleteDesignAndBuild(id);
            notify({ message: res.message, severity: 'success'})
            fetchDesignAndBuilds(0, rowsPerPage)
        } catch (error: any) {
            notify({ message: error.message, severity: 'error'})
        }
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    return(
        <Box
            mt={3}
        >
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3.5}}>
                    <AddCard
                        title="Thêm thiết kế & thi công"
                        from="design-and-build"
                        handleAdd={handleOpenAddDesignAndBuild}
                        isDisabled={designAndBuilds.length === 4}
                    />
                    {openAddDesignAndBuild && (
                        <AddDesignAndBuilds
                            onClose={() => setOpenAddDesignAndBuild(false)}
                            onLoad={handleLoad}
                        />
                    )}
                    {openEditDesignAndBuild && designAndBuildId && (
                        <AddDesignAndBuilds
                            onClose={() => setOpenEditDesignAndBuild(false)}
                            onLoad={handleLoad}
                            designAndBuildId={designAndBuildId}
                        />
                    )}
                </Grid>
                {loading && (
                    <Box display='flex' justifyContent='center' my={3}>
                        <CircularProgress/>
                    </Box>
                )} 
                {error && !loading && (
                    <Alert severity="error" sx={{ my: 2}}>{error}</Alert>
                )}  
                {!loading && !error && (
                    <Grid size={{ xs: 12, md: 8.5}} sx={{ px: 1}}>
                        {designAndBuilds.length === 0 ? (
                            <Typography sx={{ mx: 2, mt: 3}} variant="h6">Không tồn tại bản ghi nào cả</Typography>
                        ) : (
                            <>
                                <Typography variant="h5" fontWeight={500} mb={1}>Danh sách thiết kế & thi công</Typography>
                                <Grid container spacing={2}>
                                    {designAndBuilds.map((data, index) => {
                                        return(
                                            <Grid key={index} size={{ xs: 12, md: 6}}>
                                                <Paper
                                                    sx={{
                                                        display: 'flex', borderRadius: '10px',
                                                        flexDirection: { xs: 'column', sm: 'row'}, bgcolor: 'white',
                                                        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.1)', 
                                                    }}
                                                >
                                                    <CommonImage
                                                        sx={{ maxHeight: 200, maxWidth: { xs: '100%', sm: '50%'}}}
                                                        src={getPathImage(data.image_url)}
                                                    />
                                                    <Box sx={{ width: '100%'}} display='flex' flexDirection='column'>
                                                        <Stack mt={1} display='flex' justifyContent='end' alignItems='end'>
                                                            <IconButton onClick={() => handleOpenEdit(data.id)}><Edit color="primary"/></IconButton>
                                                            <IconButton onClick={() => handleDelete(data.id)}><Delete color="error"/></IconButton>
                                                        </Stack>
                                                        <Box display='flex' flexDirection='column' ml={{ xs: 0, sm: 2}} mt={{ xs: 2, sm: 1}} p={{ xs: 1, sm: 0}}>
                                                            <Typography pr={1} fontWeight={500} variant="body1">
                                                                {data.title}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    mt: 1,
                                                                    pr:1,
                                                                    fontSize: { xs: '13px', md: '15px' },
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    whiteSpace: 'normal',
                                                                    wordBreak: 'break-word',
                                                                }}
                                                            >
                                                                {data.content}
                                                            </Typography>
                                                            {data.content.length > 100 && (
                                                                <Typography
                                                                    onClick={() => handleOpenModal(data)}
                                                                    textAlign='end'
                                                                    sx={{
                                                                        color: 'primary.main',
                                                                        cursor: 'pointer',
                                                                        mt: 1,
                                                                        fontSize: '14px',
                                                                        fontWeight: 500,
                                                                        mr: 1
                                                                    }}
                                                                >
                                                                    Xem thêm
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </>
                        )}
                    </Grid>
                )}
                        <Box display='flex' justifyContent='center'>
                            <CustomPagination
                                count={total}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handlePageChange}
                                page={page}
                                sx={{ mt: 2}}
                            />
                        </Box>                       
            </Grid>
            {openModal && designAndBuild && (
                <ModalDetailDesignAndBuild
                    open={openModal}
                    onClose={() => {
                        setOpenModal(false)
                    }}
                    designAndBuild={designAndBuild}
                />
            )}
        </Box>
    )
}

export default DesignAndBuild;