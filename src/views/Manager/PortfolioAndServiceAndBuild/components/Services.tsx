import { Alert, Box, CircularProgress, IconButton, Paper, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Grid from '@mui/material/Grid2';
import AddCard from "../../Account/components/AddCard";
import CommonImage from "@/components/Image/index";
import { Delete, Edit } from "@mui/icons-material";
import AddServices from "./AddServices";
import { IServices } from "@/types/settings";
import ModelDetailServices from "./ModalDetailServices";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { deleteService, getServices } from "@/services/settings-service";
import { debounce } from "lodash";
import { getPathImage } from "@/utils/url";
import useNotification from "@/hooks/useNotification";

interface ServicesProps{
    searchTerm: string
}
interface ServicesData extends IServices{
    order: number | string,
    isReverse: boolean
}

const Services: React.FC<ServicesProps> = ({ searchTerm}) => {
    const [openAddService, setOpenAddService] = useState(false);
    const [openEditService, setOpenEditService] = useState(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [services, setServices] = useState<IServices[]>([]);
    const [service, setService] = useState<IServices | null>(null);
    const [serviceId, setServiceId] = useState<string | number>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const notify = useNotification()

    const fetchServices = useCallback(async (currentPage: number, currentSize: number, currentSearch?: string) =>{
        setLoading(true)
        try {
            const servicesResponse = await getServices({ page: currentPage, size: currentSize, searchTerm: currentSearch});
            const data = servicesResponse.data?.services as any as IServices[];
            const newData: ServicesData[] = data?.map(
                (service, index) => {
                    const numericId = Number(service.id);
                    return {
                        ...service,
                        order: String(index + 1).padStart(2, '0'),
                        isReverse: !isNaN(numericId) && numericId % 2 !== 0 //true nếu là số lẻ
                    }
                }
            )
            setServices(newData);
            servicesResponse.data?.totalServices && setTotal(servicesResponse.data.totalServices)
        } catch (error: any) {
            setError(error.message)
            setServices([])
            setTotal(0)
        }finally{
            setLoading(false)
        }
    },[])

    const debounceGetServices = useMemo(
        () => debounce((currentPage: number, currentSize: number,currentSearch?: string) => {
            fetchServices(currentPage, currentSize, currentSearch);
        }, 500),
        [fetchServices]
    )

    useEffect(() => {
        if(searchTerm){
            debounceGetServices(page, rowsPerPage, searchTerm)
        }else{
            fetchServices(page, rowsPerPage)
        }
    }, [page, rowsPerPage, searchTerm])

    const handleOpenAddService = () => {
        setOpenAddService(true)
    }

    const handleOpenModal = (item: IServices) => {
        setService(item);
        setOpenModal(true)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleLoad = () => {
        fetchServices(0, rowsPerPage)
    }

    const handleDelete = async(id: string | number) => {
        try {
            const res = await deleteService(id);
            notify({ message: res.message, severity: 'success'})
            fetchServices(0, rowsPerPage)
        } catch (error: any) {
            notify({ message: error.message, severity: 'error'})
        }
    }

    const handleOpenEdit = (id: string | number) => {
        setOpenEditService(true)
        setServiceId(id)
        if(openAddService) setOpenAddService(false)
    }
    return(
        <Box 
            mt={3}
        >
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3.5}}>
                    <AddCard
                        title="Thêm dịch vụ"
                        handleAdd={handleOpenAddService}
                        isDisabled={openAddService || openEditService}
                        from="service"
                    />
                    {openAddService && (
                        <AddServices onClose={() => setOpenAddService(false)} onLoad={handleLoad} />
                    )}
                    {openEditService && (
                        <AddServices onClose={() => setOpenEditService(false)} onLoad={handleLoad} serviceId={serviceId} />
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
                        {services.length === 0 ? (
                            <Typography sx={{ mx: 2, mt: 3}} variant="h6">Không tồn tại bản ghi nào cả</Typography>
                        ) : (
                            <>
                            <Typography variant="h5" fontWeight={500} mb={1}>Danh sách dịch vụ</Typography>
                            <Grid container spacing={2}>
                                {services.map((content, index) => {
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
                                                    src={getPathImage(content.image_url)}
                                                />
                                                <Box sx={{ width: '100%'}} display='flex' flexDirection='column'>
                                                    <Stack mt={1} display='flex' justifyContent='end' alignItems='end'>
                                                            <IconButton onClick={() => handleOpenEdit(content.id)}><Edit color="primary"/></IconButton>
                                                            <IconButton onClick={() => handleDelete(content.id)}><Delete color="error"/></IconButton>
                                                    </Stack>
                                                    <Box display='flex' flexDirection='column' ml={{ xs: 0, sm: 2}} mt={{ xs: 2, sm: 1}} p={{ xs: 1, sm: 0}}>
                                                        <Typography pr={1} fontWeight={500} variant="body1">{content.order}. {content.title}</Typography>
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
                                                            {`${content.content}`}
                                                        </Typography>
                                                        {content.content.length > 100 && (
                                                            <Typography 
                                                                onClick={() => handleOpenModal(content)}
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
                )}

            </Grid>
            {openModal && service && (
                <ModelDetailServices
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    service={service}
                />
            )}
        </Box>
    )
}

export default Services;