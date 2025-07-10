import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import slide_image_1 from "@/assets/images/users/slide_image_6.jpg";
import slide_image_2 from "@/assets/images/users/slide_image_7.jpg";
import slide_image_3 from "@/assets/images/users/home-image.png";
import slide_image_4 from "@/assets/images/users/slide-image-3.jpg";
import slide_image_5 from "@/assets/images/users/slide-image-4.jpg";
import AddImageCard from "../../Account/components/AddCard";
import Grid from "@mui/material/Grid2";
import ImageSlideUpload from "./ImageSlideUpload";
import IconButton from "@/components/IconButton/IconButton";
import { DeleteOutline } from "@mui/icons-material";
import DialogOpenImage from "./DialogOpenImage";
import { IImageSlide } from "@/types/settings";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { deleteImageSlide, getSlides, uploadImageSlide } from "@/services/settings-service";
import useNotification from "@/hooks/useNotification";
import { getPathImage } from "@/utils/url";
import { debounce } from "lodash";

interface ImageSlideProps{
    searchTerm: string
}


const ImageSlide: React.FC<ImageSlideProps> = ({searchTerm}) => {
    const [images, setImages] = useState<IImageSlide[]>();
    const [open, setOpen] = useState(false);
    const [openDialogImage, setOpenDialogImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [total, setTotal] = useState(0);
    const notify = useNotification();

    const fetchSlides = useCallback(async (currentSearch?: string) => {
        setLoading(true)
            try {
                const slidesResponse = await getSlides({ size: rowsPerPage, page: page, searchTerm: currentSearch });
                setImages(slidesResponse?.data?.slides || []);
                slidesResponse.data?.totalSlides && setTotal(slidesResponse.data?.totalSlides)
            } catch (error: any) {
                console.error("Failed to fetch dashboard data:", error);
                setError(error.message);
                setTotal(0)
                setImages([])
            }finally{
                setLoading(false);
            }
    },[rowsPerPage, page])


    const debounceGetSlides = useMemo(
        () => debounce((currentSearchTerm?: string) => {
            fetchSlides(currentSearchTerm);
        }, 500),
        [fetchSlides]
    );
    
    useEffect(() => {
        if(searchTerm){
            debounceGetSlides(searchTerm);
        }else{
            fetchSlides();
        }
    }, [searchTerm]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }
    const handleFileSelect = (file: File) => {
        setImageFile(file);
    };

    const handleOpenImage = (url: string) => {
        setPreview(url)
        setOpenDialogImage(true)
    }
    
    const handleAddImage = async() => {
        const data = new FormData();
        if(imageFile?.name) data.append('name', imageFile?.name);
        if(imageFile) data.append('url', imageFile);
        try {
            const res = await uploadImageSlide(data);
            const image = res.data as any as IImageSlide;
            setPreview(getPathImage(image.url))
            notify({
                message: res.message,
                severity: "success"
            })
            fetchSlides();
        } catch (error: any) {
            notify({
                message: error.message,
                severity: 'error'
            })
        }
    }

    const handleDeleteImage = async(id: string | number) => {
        try {
            const res = await deleteImageSlide(id);
            notify({
                message: res.message,
                severity: 'success'
            })
            fetchSlides();
        } catch (error: any) {
            notify({
                message: error.message,
                severity: 'error'
            })
        }
    }
    return (
        <Box mt={3}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4}}>
                    <ImageSlideUpload onFileSelect={handleFileSelect} handleAddImage={handleAddImage}/>
                </Grid>
                <Grid size={{ xs: 12, md: 8}}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Hình ảnh</TableCell>
                                    <TableCell align="right">Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {images?.map((img) => {
                                    const url = img.url && getPathImage(img.url)
                                    return (
                                        <TableRow key={img.id}>
                                            <TableCell>{img.id}</TableCell>
                                            <TableCell>{img.name}</TableCell>
                                            <TableCell>
                                                <img
                                                    src={url}
                                                    alt={`Image ${img.id}`}
                                                    style={{ width: 100, height: 60, objectFit: "cover", cursor: 'pointer' }}
                                                    onClick={() =>  img.url && handleOpenImage(img.url)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    handleFunt={() => handleDeleteImage(img.id)}
                                                    icon={<DeleteOutline color="error"/>}
                                                    tooltip="Xóa"
                                                    backgroundColor="white"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display='flex' alignItems='center' justifyContent='center'>
                        <CustomPagination
                            page={page}
                            count={total}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handlePageChange}
                            sx={{ mt: 2}}
                        />
                    </Box>
                </Grid>
            </Grid>
            {openDialogImage && preview && (
                <DialogOpenImage
                    open={openDialogImage}
                    onClose={() => setOpenDialogImage(false)}
                    preview={getPathImage(preview)}
                />
            )}
        </Box>
    )
}

export default ImageSlide;