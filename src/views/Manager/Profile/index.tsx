import { Avatar, Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { Edit, PhotoCamera } from "@mui/icons-material";
import { Dayjs } from "dayjs";
import useAuth from "@/hooks/useAuth";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import useNotification from "@/hooks/useNotification";
import { useAppDispatch } from "@/store";
import { setProfile } from "@/slices/user";
import { getPathImage } from "@/utils/url";
import IconButton from "@/components/IconButton/IconButton";
import { getRoleLabel } from "@/utils/labelEnToVi";
import InputText from "@/components/InputText";
import { UserProfile } from "@/types/user-types";
import { updateAccount } from "@/services/user-service";
import DialogConformEditAccount from "../Account/components/DialogConformEditAccount";

interface DetailItemProps {
    label: string;
    value: React.ReactNode;
}
const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
    <Grid container spacing={1} sx={{ mt: 1, mx:4 }}>
            <Grid size={{ xs: 4 }}>
                <Typography variant="subtitle2" fontWeight={400} sx={{ fontWeight: 'medium' }}>
                    {label}:
                </Typography>
            </Grid>
            <Grid size={{ xs: 8 }} >
                {typeof value === 'string' || typeof value === 'number' ? (
                    <Typography variant="subtitle2" component="span" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {value || '-'}
                    </Typography>
                ) : (
                    value || '-'
                )}
            </Grid>
    </Grid>
);

interface ProfileFormData {
    fullName: string,
    username: string,
    email: string,
    address: string,
    phone_number: string,
    role: string,
    avatar_url: File | null;
}

function Profile (){
    const { userId, profile } = useAuth();
    const dispatch = useAppDispatch();
    const notify = useNotification();
    const [formData, setFormData] = useState<ProfileFormData>({
        fullName: '', username: '', email: '', address: '',
        role: '', phone_number: '', avatar_url: null,
    });
    const [errors, setErrors] = useState<Partial<Record<'fullName' | 'phone_number' | 'email', string>>>({});
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
    const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [openDialogConfirmEditAccount, setOpenDialogConfirmEditAccount] = useState(false)

    const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;

    const handleCustomInputChange = (name: string, value: string | Dayjs | null | number) => {
        if (Object.prototype.hasOwnProperty.call(formData, name)) {
        const validName = name as keyof ProfileFormData; 
    
        setFormData((prevData) => ({
            ...prevData,
            [validName]: value, 
        }));

        if (validName === 'fullName' || validName === 'phone_number' || validName === 'email' || validName === 'address') {
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
            if (errors[validName as 'fullName' | 'phone_number' | 'email']) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[validName as 'fullName' | 'phone_number' | 'email'];
                    return newErrors;
                });
            }
        }
        } else {
        console.warn(`CustomInput called onChange with an unexpected name: ${name}`);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<'fullName' | 'phone_number' | 'email', string>> = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Tên đầy đủ là bắt buộc';
        // Thêm validation khác nếu cần
  
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // True nếu không có lỗi
    };

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(file && file.type.startsWith('image/')){
            setFormData((prevData) => ({ ...prevData, avatar_url: file}));
            const reader = new FileReader();
            reader.onloadend = () => { setAvatarPreview(reader.result as string); };
            reader.readAsDataURL(file);
        } else {
            if (!file) notify({ message: 'Vui lòng chọn file ảnh.', severity: 'warning' });
            setFormData(prev => ({ ...prev, avatarFile: null }));
            setAvatarPreview(null);
            event.target.value = '';
        }
    }

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
    } else if (initialAvatarUrl) {
        finalDisplayAvatarSrc = getPathImage(initialAvatarUrl);
    }

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!validateForm()){
            return;
        }
        
        setIsSubmitting(true);
        setSubmitSuccess(null)

        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('username', formData.username);
        if(formData.email) data.append('email', formData.email);
        if(formData.address) data.append('address', formData.address);
        if(formData.phone_number) data.append('phone_number', formData.phone_number);
        data.append('role', formData.role);
        if(formData.avatar_url) data.append('avatar_url', formData.avatar_url);
        
        try {
            const res = await updateAccount(userId, data)
            if(res){
                const updatedProfile = res.data;
                notify({ message: 'Cập nhật thông tin thành công!', severity: 'success' });
                setSubmitSuccess(true)
                dispatch(setProfile(updatedProfile))
                setOpenDialogConfirmEditAccount(true)
                setFormData({
                    fullName: '', username: profile.username, email: '', address: '',
                    role: getRoleLabel(profile.role), phone_number: '', avatar_url: null,
                });
                setIsEditMode(false)
                setAvatarPreview(null);
                setInitialAvatarUrl(null)
                const avatarInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
                if (avatarInput) avatarInput.value = '';
            }else{
                throw new Error("Phản hòi cập nhật không hợp lệ từ máy chủ.")
            }
            
        } catch (error: any) {
            const errorMessage = error.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.';
            notify({ message: errorMessage, severity: 'error' });
            setSubmitSuccess(false);
        }finally{
            setIsSubmitting(false);
        }
        
    }

    const handleRenderInfoProfile = () => {
        setIsEditMode(true)
        if(profile){
            const typedProfile = profile as UserProfile;
            setFormData({
                fullName: typedProfile.fullName,
                username: typedProfile.username,
                email: typedProfile.email ? typedProfile.email : '',
                address: typedProfile.address ?  typedProfile.address : '',
                phone_number: typedProfile.phone_number ? typedProfile.phone_number : '',
                role: typedProfile.role ? typedProfile.role : '',
                avatar_url: null,

            })
            const rawAvatarUrlFromApi = typedProfile.avatar_url || null;
                setInitialAvatarUrl(rawAvatarUrlFromApi);
                setAvatarPreview(null);
        }
    }
    
    return(
        <Box sx={{ p: 0.5, m:1, minHeight: "100%"}}>
            <Grid container spacing={2} alignItems="stretch" >
                {/* Hồ sơ người dùng */}
                <Grid size={{ xs: 12, md:3.5}}>
                    <Paper elevation={2} sx={{ padding: 2, borderRadius: '8px', border: '1px solid #e0e0e0',height: '100%' }}>
                        <Stack direction='row' justifyContent="center" alignItems="center">
                            <Typography variant="h6" align="center" fontWeight={500}> Hồ sơ người dùng</Typography>
                            <IconButton
                                handleFunt={handleRenderInfoProfile}
                                icon={<Edit color="primary"/>}
                                title="Chỉnh sửa"
                            />
                        </Stack>
                        <Box sx={{my: 1 }}>
                            <Stack direction="column" spacing={1} alignItems="center" justifyContent="center" sx={{ py:2}}>
                                <Avatar
                                    src={profile?.avatar_url ? getPathImage(profile?.avatar_url) : ""}
                                    sx={{ width: 120, height: 120, bgcolor: 'grey.300', borderRadius:'50%', mb:2 }}
                                >
                                </Avatar>
                                <Typography fontWeight='bold'>{profile?.fullName}</Typography>
                                <Typography sx={{ color: 'text.secondary', fontStyle: "italic"}}>{getRoleLabel(profile?.role) || " - "}</Typography>
                            </Stack>
                        </Box>
                        <Box sx={{ mx:4}} display='flex' flexDirection='column'>
                            <Typography variant="body1" sx={{ color: 'text.secondary'}}>Thông tin cá nhân</Typography>
                        </Box>
                        <DetailItem label="Tên" value={profile?.fullName}/>
                        <DetailItem label="Tài khoản" value={profile?.username}/>
                        <DetailItem label="Chức vụ" value={getRoleLabel(profile?.role)}/>
                        <DetailItem label="Công tác" value='Phòng HR công ty Mintz DG'/>
                        <Box sx={{ mx:4, mt:4}} display='flex' flexDirection='column'>
                            <Typography variant="body1" sx={{ color: 'text.secondary'}}>Thông tin liên lạc</Typography>
                        </Box>
                        <DetailItem label="Địa chỉ" value={profile?.address}/>
                        <DetailItem label="Điện thoại" value={profile?.phone_number} />
                        <DetailItem label="Email" value={profile?.email} />
                    </Paper>
                </Grid>

                {/* Chỉnh sửa thông tin người dùng */}
                <Grid size={{ xs: 12, md: 8.5}}>
                    <Paper elevation={2} sx={{ padding: 2, borderRadius: '8px', border: '1px solid #e0e0e0', height: '100%' }}>
                        <Box onSubmit={handleSubmit} component='form' sx={{my: 1 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs:12 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: { md: 2.5 } }}>
                                    <Box sx={{ position: 'relative', width: 180, height: 180 }}>
                                        <Avatar src={finalDisplayAvatarSrc} sx={{ width: '100%', height: '100%', mb: 2, bgcolor: 'grey.300', borderRadius:'50%' }} />
                                        <Button 
                                            variant="contained" 
                                            sx={{ 
                                                backgroundColor:'#00C7BE', 
                                                borderRadius: '50%', 
                                                minWidth: '35px', 
                                                width: '35px', 
                                                height: '35px', 
                                                position: 'absolute', 
                                                bottom: 6,
                                                right: 12,
                                            }} 
                                            component="label" 
                                            startIcon={<PhotoCamera sx={{  width: '25px', height: '25px', ml: 1.2}} />}
                                            disabled={!isEditMode}
                                        >
                                            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid sx={{ mt: 2}} size={{ xs: 12}}>
                                    <Grid container spacing={2}>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Họ và tên</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleCustomInputChange}
                                                placeholder="Nhập thông tin"
                                                sx={{ mt: 0 }}
                                                error={!!errors.fullName}
                                                helperText={errors.fullName}
                                                margin="dense"
                                                disabled={!isEditMode}
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Tên hiển thị</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleCustomInputChange}
                                                placeholder="Nhập thông tin"
                                                sx={{ mt: 0 }}
                                                margin="dense"
                                                disabled
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Email</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleCustomInputChange}
                                                placeholder="Nhập thông tin"
                                                sx={{ mt: 0 }}
                                                margin="dense"
                                                disabled={!isEditMode}
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Địa chỉ</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleCustomInputChange}
                                                placeholder="Nhập thông tin"
                                                sx={{ mt: 0 }}
                                                margin="dense"
                                                disabled={!isEditMode}
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Số điện thoại</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleCustomInputChange}
                                                placeholder="Nhập thông tin"
                                                sx={{ mt: 0 }}
                                                margin="dense"
                                                disabled={!isEditMode}
                                            />
                                        </Grid>
                                        <Grid  size={{ xs: 12, md: 6}}>
                                            <Typography variant="body2" fontWeight={600} gutterBottom>Chức vụ</Typography>
                                            <InputText
                                                label=""
                                                type="text"
                                                name="role"
                                                value={getRoleLabel(formData.role)}
                                                onChange={handleCustomInputChange}
                                                placeholder="Nhập thông tin"
                                                sx={{ mt: 0 }}
                                                margin="dense"
                                                disabled
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12}}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    sx={{ backgroundColor: '#1C1A1B', width: '150px', position: 'relative', mr: 3}}
                                                    disabled={!isEditMode}
                                                >
                                                    {isSubmitting ? 'Đang lưu...' : 'Lưu'}
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
                                                    variant="outlined"
                                                    sx={{ border: '1px solid #1C1A1B', width: '150px', color: '#1C1A1B'}}
                                                    onClick={() => {
                                                        setFormData({
                                                            fullName: '', username: profile.username, email: '', address: '',
                                                            role: getRoleLabel(profile.role), phone_number: '', avatar_url: null,
                                                        });
                                                    }}
                                                    disabled={!isEditMode}
                                                >
                                                    Reset
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            {openDialogConfirmEditAccount && (
                <DialogConformEditAccount
                    open={openDialogConfirmEditAccount}
                    handleClose={() => {
                        setOpenDialogConfirmEditAccount(false)
                    }}
                />
            )}
        </Box>
    )
}

export default Profile;