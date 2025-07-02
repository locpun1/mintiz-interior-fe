import DialogComponent from "@/components/DialogComponent";
import { getUser, updateAccount } from "@/services/user-service";
import { UserProfile } from "@/types/user-types";
import { Alert, Avatar, Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { generateCaptcha, MAX_IMAGE_SIZE, ProfileFormData } from "./DialogAddAccount";
import { getPathImage } from "@/utils/url";
import Grid from "@mui/material/Grid2";
import { PhotoCamera } from "@mui/icons-material";
import { resizeImage } from "@/utils/common";
import useNotification from "@/hooks/useNotification";
import { Dayjs } from "dayjs";
import InputText from "@/components/InputText";
import { getRoleLabel } from "@/utils/labelEnToVi";
import avatar from "@/assets/images/users/default-avatar.jpg"
import DialogConformEditAccount from "./DialogConformEditAccount";

interface DialogEditAccountProps{
    open: boolean,
    onClose: () =>  void;
    userId: string | number
}

const DialogEditAccount: React.FC<DialogEditAccountProps> = ({ open, onClose, userId}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState<ProfileFormData>({
        fullName: '', username: '', email: '', address: '', password: '', phone_number: '', passwordConfirm: '', role: 'employee', captchaCode: '', avatar_url: null
    });
    const [errors, setErrors] = useState<Partial<Record<'fullName' | 'username' | 'password'| 'phone_number' | 'passwordConfirm' | 'email' | 'captchaCode', string>>>({});
    const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const notify = useNotification();
    const [captcha, setCaptcha] = useState<string>('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [openDialogConfirmEditAccount, setOpenDialogConfirmEditAccount] = useState(false)
    

    useEffect(() => {
        if(open && userId){
            setLoading(true)
            try {
                const getDetail = async(id: string | number) => {
                    const res = await getUser(id);
                    const userProfile = res as any as UserProfile
                    setFormData({
                        fullName: userProfile.fullName,
                        username: userProfile.username,
                        role: userProfile.role ? userProfile.role : "",
                        email: userProfile.email ? userProfile.email : '',
                        address: userProfile.address ? userProfile.address : '',
                        phone_number: userProfile.phone_number ? userProfile.phone_number : '',
                        password: userProfile.password ? userProfile.password : '',
                        captchaCode: userProfile.captchaCode ? userProfile.captchaCode : '',
                        avatar_url: null,
                        passwordConfirm: userProfile.password ? userProfile.password : '',
                    })
                    const rawAvatarUrlFromApi = userProfile.avatar_url || null;
                    setInitialAvatarUrl(rawAvatarUrlFromApi);
                    setAvatarPreview(null)
                }
                getDetail(userId)
            } catch (error:any) {
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }
    },[open, userId])

    useEffect(() => {
        let objectUrl: string | null = null;
        if (avatarPreview && (avatarPreview.startsWith('blob:') || avatarPreview.startsWith('data:'))) {
        if (avatarPreview.startsWith('blob:')) objectUrl = avatarPreview;
        }
        return () => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
        };
    }, [avatarPreview]);

    let finalDisplayAvatarSrc: string | undefined = undefined;
    if (avatarPreview) {
        finalDisplayAvatarSrc = avatarPreview;
    } else if (initialAvatarUrl ) {
        finalDisplayAvatarSrc = getPathImage(initialAvatarUrl);
    }

    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    const handleClose = () => {
        onClose()
        // setFormData({
        //     fullName: '', username: '', email: '', address: '', password: '', phone_number: '', passwordConfirm: '', role: 'employee', captchaCode: '' ,avatar_url: null
        // })
    }

    const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;

    const handleCustomInputChange = (name: string, value: string | Dayjs | null | number) => {
        if (Object.prototype.hasOwnProperty.call(formData, name)) {
            const validName = name as keyof ProfileFormData; 
    
            setFormData((prevData) => ({
                ...prevData,
                [validName]: value, 
            }));

            if (validName === 'email' || validName === 'phone_number' || validName === 'captchaCode' || validName === 'password' || validName === 'passwordConfirm') {
                if(validName === 'phone_number' && typeof value === 'string'){
                    const phone = value.replace(/\s|-/g, '');
                    if (!/^\d+$/.test(phone)) {
                        setErrors(prev => ({
                            ...prev,
                            phone_number: 'Số điện thoại chỉ chứa số',
                        }));
                        return;
                    }
                    if(phone.startsWith('0') && phone.length !== 10){
                        setErrors(prev => ({
                            ...prev,
                            phone_number: 'Số điện thoại phải có 10 chữ số (nếu bắt đầu bằng 0)',
                        }));
                        return;
                    }

                    if(phone.startsWith('+84') && (phone.length < 11 || phone.length > 12)){
                        setErrors(prev => ({
                            ...prev,
                            phone_number: 'Số điện thoại phải có 11-12 chữ số (nếu bắt đầu bằng +84)',
                        }));
                        return;
                    }

                    if(!phoneRegex.test(phone)){
                        setErrors(prev => ({
                            ...prev,
                            phone_number: 'Số điện thoại không đúng định dạng (bắt đầu từ +84|03|05|07|08|09',
                        }));
                        return;
                    }
                }
                if(validName === 'email' && typeof value === 'string'){
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // chuẩn email đơn giản
                    if(!emailRegex.test(value)){
                        setErrors(prev => ({
                            ...prev,
                            email: "Email không hợp lệ"
                        }));
                        return;
                    }
                }
                if(validName === 'captchaCode' && typeof value === 'string'){
                    if(value !== captcha){
                        setErrors(prev => ({
                            ...prev,
                            captchaCode: "Captcha sai. Vui lòng nhập lại"
                        }))
                    }
                }
                if(validName === 'password' && typeof value === "string"){
                    setPassword(value)
                }

                if(validName === 'passwordConfirm' && typeof value === "string"){
                    if(value !== password){
                        setErrors(prev => ({
                            ...prev,
                            passwordConfirm: 'Mật khẩu và mật khẩu nhập lại không khớp'
                        }))
                    }

                }

                if (errors[validName as 'fullName' | 'username' | 'password'| 'phone_number' | 'passwordConfirm' | 'email' | 'captchaCode']) {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[validName as 'fullName' | 'username' | 'password'| 'phone_number' | 'passwordConfirm' | 'email' | 'captchaCode'];
                        return newErrors;
                    });
                }
            }
        } else {
            console.warn(`CustomInput called onChange with an unexpected name: ${name}`);
        }
    }

    const handleAvatarChange = async(event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if(file && file.type.startsWith('image/')){
            const { blob, previewUrl } = await resizeImage(file, MAX_IMAGE_SIZE);
            const newFile = new File([blob], file.name, { type: "image/jpeg" });
            setFormData((prevData) => ({ ...prevData, avatar_url: newFile}));
            setAvatarPreview(previewUrl)
        }else{
            if (!file) notify({ message: 'Vui lòng chọn file ảnh.', severity: 'warning' });
            setFormData(prev => ({ ...prev, avatarFile: null }));
            setAvatarPreview(null);
            event.target.value = "";
        }
        //Reset lại input để onChange được gọi nếu chọn lại cùng 1 ảnh
        if(fileInputRef.current){
            fileInputRef.current.value = "";
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<'fullName' | 'username' | 'password'| 'phone_number' | 'passwordConfirm' | 'email' | 'captchaCode', string>> = {};
        if(!formData.fullName.trim()) newErrors.fullName = 'Tên đầy đủ là bắt buộc';
        if(!formData.email) newErrors.email = 'Email là bắt buộc';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // True nếu không có lỗi
    }

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!validateForm()){
            return;
        }
        setIsSubmitting(true);
        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('username', formData.username);
        if(formData.email) data.append('email', formData.email);
        if(formData.address) data.append('address', formData.address);
        // data.append('password', formData.password);
        if(formData.phone_number) data.append('phone_number', formData.phone_number);
        data.append('role', formData.role);
        if(formData.captchaCode) data.append('captchaCode', formData.captchaCode);
        if(formData.avatar_url) data.append('avatar_url', formData.avatar_url);
        
        try {
            await updateAccount(userId, data);
            setOpenDialogConfirmEditAccount(true)
            // onClose()
        } catch (error: any) {
            const errorMessage = error.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.';
            notify({ message: errorMessage, severity: 'error'})
        }finally{
            setIsSubmitting(false);
        }
    
    }
    
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            isActiveFooter={false}
        >
            {loading && (
                <Box display='flex' justifyContent='center' my={3}>
                    <CircularProgress/>
                </Box>
            )}
            {error && !loading && (
                <Alert severity="error" sx={{ my: 2}}>{error}</Alert>
            )}
            {!loading && !error && (
                <Box flexGrow={1} component='form' onSubmit={handleSubmit}>
                    <Grid container spacing={2} alignItems="stretch">
                        <Grid size={{ xs: 12}} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2.5 }}>
                            <Box sx={{ position: 'relative', width: 180, height: 180 }}>
                                <Avatar
                                    src={finalDisplayAvatarSrc ? finalDisplayAvatarSrc : avatar}
                                    sx={{ width: '100%', height: '100%', mb: 2, bgcolor: 'grey.600', borderRadius:'50%', boxShadow: 4 }}
                                />
                                <Button 
                                    variant="contained" 
                                    sx={{ 
                                        backgroundColor:'grey.300', 
                                        borderRadius: '50%', 
                                        minWidth: '35px', 
                                        width: '35px', 
                                        height: '35px', 
                                        position: 'absolute', 
                                        bottom: 6,
                                        right: 12,
                                    }} 
                                    component="label" 
                                    startIcon={<PhotoCamera sx={{  width: '25px', height: '25px', ml: 1.2, color:'#1C1A1B'}} />}
                                >
                                    <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                                </Button>
                            </Box>
                        </Grid>
                        <Grid sx={{ mt: 2}} size={{ xs: 12}}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6}}>
                                    <Typography variant="body2" fontWeight={600}>Tên đầy đủ</Typography>
                                    <InputText
                                        label=""
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleCustomInputChange}
                                        placeholder="Nhập thông tin"
                                        sx={{ mt: 0}}
                                        error={!!errors.fullName}
                                        helperText={errors.fullName}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6}}>
                                    <Typography variant="body2" fontWeight={600}>Tên hiển thị</Typography>
                                    <InputText
                                        label=""
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleCustomInputChange}
                                        placeholder="Nhập thông tin"
                                        sx={{ mt: 0}}
                                        disabled
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6}}>
                                    <Typography variant="body2" fontWeight={600}>Email</Typography>
                                    <InputText
                                        label=""
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleCustomInputChange}
                                        placeholder="Nhập thông tin"
                                        sx={{ mt: 0}}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6}}>
                                    <Typography variant="body2" fontWeight={600}>Địa chỉ</Typography>
                                    <InputText
                                        label=""
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleCustomInputChange}
                                        placeholder="Nhập thông tin"
                                        sx={{ mt: 0}}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6}}>
                                    <Typography variant="body2" fontWeight={600}>Số điện thoại</Typography>
                                    <InputText
                                        label=""
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleCustomInputChange}
                                        placeholder="Nhập thông tin"
                                        sx={{ mt: 0}}
                                        error={!!errors.phone_number}
                                        helperText={errors.phone_number}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6}}>
                                    <Typography variant="body2" fontWeight={600}>Chức vụ</Typography>
                                    <InputText
                                        label=""
                                        type="text"
                                        name="role"
                                        value={getRoleLabel(formData.role)}
                                        onChange={handleCustomInputChange}
                                        placeholder="Nhập thông tin"
                                        sx={{ mt: 0}}
                                        disabled
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6}}>
                                    <Typography variant="body2" fontWeight={600}>Xác minh mã Captcha</Typography>
                                    <InputText
                                        label=""
                                        type="text"
                                        name="captchaCode"
                                        value={formData.captchaCode}
                                        onChange={handleCustomInputChange}
                                        placeholder="Nhập thông tin"
                                        sx={{ mt: 0}}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6}}>
                                    <Typography variant="body2" fontWeight={600}>Mã Captcha</Typography>
                                    <Box
                                    sx={{
                                        border: '1px solid #1C1A1B',
                                        borderRadius: '10px',
                                        px: 2,
                                        py: 0.5,
                                        display: 'flex',
                                        gap: 1,
                                        height: '40px',
                                        width: {xs: '100%', md: '50%'}
                                    }}
                                    >
                                    {captcha.split('').map((char, index) => (
                                        <Box
                                        key={index}
                                        sx={{
                                            transform: `rotate(${Math.random() * 30 - 15}deg)`,
                                            fontSize: '20px',
                                            fontWeight: 'bold'
                                        }}
                                        >
                                        {char}
                                        </Box>
                                    ))}
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12}}>
                                    <Box sx={{ display: 'flex', justifyContent: {xs: 'center', md: 'flex-end'}}}>
                                        <Button
                                            type="submit"
                                            variant="outlined"
                                            sx={{ width: '150px', position: 'relative', bgcolor:"#1C1A1B", color: 'white', fontWeight:600, borderRadius: '20px', mr: 2}}
                                        >
                                            {isSubmitting ? 'Đang chỉnh sửa...' : 'Lưu chỉnh sửa'}
                                            {isSubmitting && (
                                                <CircularProgress
                                                    size={24}
                                                    sx={{
                                                        color: 'primary.contrastText',
                                                        position: 'absolute',
                                                        top: '50%', left: '50%',
                                                        marginTop: '-12px', marginLeft: '-12px',
                                                    }}
                                                />
                                            )}
                                        </Button>
                                        <Button
                                            type="reset"
                                            variant="outlined"
                                            sx={{ width: '100px', position: 'relative', border:"1px solid #1C1A1B", color: '#1C1A1B', fontWeight:600, borderRadius: '20px'}}
                                            onClick={handleClose}
                                        >
                                            Đóng
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {openDialogConfirmEditAccount && (
                <DialogConformEditAccount
                    open={openDialogConfirmEditAccount}
                    handleClose={() => {
                        setOpenDialogConfirmEditAccount(false)
                        handleClose()
                    }}
                />
            )}
        </DialogComponent>
    )
}

export default DialogEditAccount;