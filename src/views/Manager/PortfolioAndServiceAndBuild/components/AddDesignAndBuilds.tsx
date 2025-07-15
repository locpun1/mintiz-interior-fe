import { Box, Button, Typography } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import Grid from '@mui/material/Grid2';
import { Dayjs } from "dayjs";
import InputText from "@/components/InputText";
import useNotification from "@/hooks/useNotification";
import ImageServicesUpload from "./ImageServicesUpload";
import { createDesignAndBuilds, getDesignAndBuild, updateDesignAndBuild } from "@/services/settings-service";
import { IDesignAndBuild, IServices } from "@/types/settings";

interface AddDesignAndBuildsProps{
    onClose: () => void;
    onLoad: () => void;
    designAndBuildId?: string | number
}

interface DataDesignAndBuildFormData{
    title: string,
    content: string
}

type FormErrors = {
  [K in keyof DataDesignAndBuildFormData]?: string;
};

const AddDesignAndBuilds: React.FC<AddDesignAndBuildsProps> = ({ onClose, onLoad, designAndBuildId}) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const notify = useNotification();
    const [formData, setFormData] = useState<DataDesignAndBuildFormData>({
         title: '', content: ''
    })
    const [resetCount, setResetCount] = useState(0);
    const [errors, setErrors] = useState<FormErrors>({});
    const [errorImage, setErrorImage] = useState('');
    const [imageService, setImageService] = useState<string | null>(null);


    useEffect(() => {
        if(designAndBuildId){
            const fetchDesignAndBuild = async() => {
                const res = await getDesignAndBuild(designAndBuildId);
                const data = res.data as any as IDesignAndBuild;
                setFormData({
                    title: data.title,
                    content: data.content
                })
                setImageService(data.image_url)
            };
            fetchDesignAndBuild()
        }
    },[designAndBuildId])

    const handleChangeInput = (name: string, value: string | Dayjs | null | number) => {
        if(Object.prototype.hasOwnProperty.call(formData, name)){
            const validName = name as keyof DataDesignAndBuildFormData;

            setFormData((prevData) => ({
                ...prevData,
                [validName]: value,
            }))

            if (errors[name as keyof typeof errors]) {
                setErrors(prev => ({ ...prev, [name]: undefined }));
            }
            if(errorImage){ setErrorImage('')}
        }else {
            console.warn(`CustomInput called onChange with an unexpected name: ${name}`);
        }
    }
    const handleFileSelect = (file: File) => {
        setImageFile(file);
    };

    const handleReset = () => {
        setResetCount(c => c + 1);
        setFormData({
            title: '', content: ''
        });
        setErrors({})
        setErrorImage('')
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được để trống.';
        if (!formData.content.trim()) newErrors.content = 'Nội dung không được để trống.';
        if (!imageFile) {
            setErrorImage('Vui lòng tải lên hình ảnh');
        }  

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && !!imageFile;
    };

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!designAndBuildId && !validateForm()){
            return;
        }
        
        const data = new FormData();
        if(imageFile) {
            data.append('image_url', imageFile)
        }
        data.append('title', formData.title);
        data.append('content', formData.content);
        try {
            let res;
            if(designAndBuildId){
                //update
                res = await updateDesignAndBuild(designAndBuildId, data);
                const newData = res.data as any as IServices;
                setFormData({
                    title: newData.title,
                    content: newData.content
                })
                setImageService(newData.image_url)
            }else{
                //create
                res = await createDesignAndBuilds(data);
                handleReset();
            }
            notify({ message: res.message, severity: 'success'})
            if(onLoad){
                onLoad()
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Lưu thông tin thất bại. Vui lòng thử lại.';
            notify({ message: errorMessage, severity: 'error'})
        }
    }

    return(
        <Box component='form' onSubmit={handleSubmit} mt={2} p={2} sx={{ bgcolor: 'white', borderRadius: '10px', boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)'}}>
            <Grid container spacing={2}>
                {designAndBuildId && (
                    <Grid size={{ xs: 12}}>
                        <Typography variant="body2" fontWeight={500}>{`Chỉnh sửa ${formData.title}`}</Typography>
                    </Grid>
                )}
                <Grid size={{ xs: 12}}>
                    <ImageServicesUpload imageService={imageService} resetCount={resetCount} onFileSelect={handleFileSelect}/>
                    {errorImage && (
                        <Typography mt={1} variant="subtitle2" color="error">{errorImage}</Typography>
                    )}
                </Grid>
                <Grid size={{ xs: 12}}>
                    <Typography variant="body2" fontWeight={500}>Tiêu đề</Typography>
                    <InputText
                        label=""
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChangeInput}
                        placeholder="Nhập thông tin"
                        sx={{ mt: 0}}
                        multiline
                        rows={2}
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                </Grid>
                <Grid size={{ xs: 12}}>
                    <Typography variant="body2" fontWeight={500}>Nội dung</Typography>
                    <InputText
                        label=""
                        type="text"
                        name="content"
                        value={formData.content}
                        onChange={handleChangeInput}
                        placeholder="Nhập thông tin"
                        sx={{ mt: 0}}
                        multiline
                        rows={5}
                        error={!!errors.content}
                        helperText={errors.content}
                    />
                </Grid>
                <Grid size={{ xs: 12}} display='flex' justifyContent={{ xs: 'center', sm: 'flex-end'}}>
                    <Button
                        type="submit"
                        sx={{ bgcolor: '#1C1A1B', color: 'white', mr: 1, width: 100}}
                    >
                        Lưu
                    </Button>
                    {!designAndBuildId && (
                        <Button
                            variant="outlined"
                            sx={{ color: '#1C1A1B', border: 'solid 1px #1C1A1B', width: 100, mr: 1}}
                            onClick={handleReset}
                        >
                            Reset
                        </Button> 
                    )}

                    <Button
                        variant="outlined"
                        sx={{ color: '#1C1A1B', border: 'solid 1px #1C1A1B', width: 100}}
                        onClick={onClose}
                    >
                        Hủy
                    </Button> 
                </Grid>
            </Grid>
        </Box>
    )
}

export default AddDesignAndBuilds;