import InputText from "@/components/InputText";
import { Box, Button, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Dayjs } from "dayjs";
import { useState } from "react";
import mintz_logo from "@/assets/images/users/logo.png";
import CommonImage from "@/components/Image/index";

interface ProfileFormData {
  full_name: string;
  email: string;
  phone_number: string;
  title: string;
  content: string;
}

const ContactConsultativeInfo: React.FC = () => {
    const [errors, setErrors] = useState<Partial<Record<'phone_number' | 'email' , string>>>({});
    const [formData, setFormData] = useState<ProfileFormData>({
        full_name: '', email: '', phone_number: '', title: '',
        content: '',
    });
    const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;

    const handleCustomInputChange = (name: string, value: string | null | Dayjs | number ) => {
        if (Object.prototype.hasOwnProperty.call(formData, name)) {
            const validName = name as keyof ProfileFormData; 
    
            setFormData((prevData) => ({
                ...prevData,
                [validName]: value, 
            }));

            if (validName === 'email' || validName === 'phone_number') {
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
                if (errors[validName as 'email' | 'phone_number']) {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[validName as 'email' | 'phone_number'];
                        return newErrors;
                    });
                }
            }
        } else {
            console.warn(`CustomInput called onChange with an unexpected name: ${name}`);
        }
    };

    return(
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5}}>
                <Box
                    display= 'flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                >
                    <CommonImage
                        src={mintz_logo}
                        sx={{
                            width: '216px',
                            height: '191px'
                        }}
                    />
                    <Typography
                        fontWeight={600}
                        variant="h5"
                        sx={{ 
                            color: 'white',
                            pb: 1,
                            borderBottom: '2px solid white',
                            my: 2
                        }}
                    >
                        THÔNG TIN TƯ VẤN
                    </Typography>
                    <Typography sx={{ color: 'grey' }}> Hoặc liên hệ hợp tác với chúng tôi </Typography>
                    <Typography sx={{ color: 'grey' }}> qua email bằng cách điền vào biểu </Typography>
                    <Typography sx={{ color: 'grey' }}> mẫu sau </Typography>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7}}>
                <Box id="create-task-form" component='form'>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12}}>
                            <Stack direction={{ xs: 'column', md: 'row'}} spacing={{ xs: 0, md: 2}} sx={{ width: { xs: '100%', md: '80%'} }}>
                                <Box flexGrow={1}>
                                    <Typography variant="body2" fontWeight={600} gutterBottom sx={{ color: 'white'}}>Tên đầy đủ</Typography>
                                    <InputText
                                        label=""
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleCustomInputChange}
                                        type="text"
                                        sx={{ mt: 0 }}
                                        margin="dense"
                                        placeholder="Nhập thông tin"
                                        from="from-contact"
                                    />
                                </Box>
                                <Box flexGrow={1}>
                                    <Typography variant="body2" fontWeight={600} gutterBottom sx={{ color: 'white' }}>Email</Typography>
                                    <InputText
                                        label=""
                                        name="email"
                                        value={formData.email}
                                        onChange={handleCustomInputChange}
                                        type="text"
                                        sx={{ mt: 0}}
                                        margin="dense"
                                        placeholder="Nhập thông tin"
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        from="from-contact"
                                    />
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12}}>
                            <Stack direction={{ xs: 'column', md: 'row'}} spacing={{ xs: 0, md: 2}} sx={{ width: { xs: '100%', md: '80%'} }}>
                                <Box flexGrow={1}>
                                    <Typography variant="body2" fontWeight={600} gutterBottom sx={{ color: 'white'}}>Điện thoại</Typography>
                                    <InputText
                                        label=""
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleCustomInputChange}
                                        type="text"
                                        sx={{ mt: 0}}
                                        margin="dense"
                                        placeholder="Nhập thông tin"
                                        error={!!errors.phone_number}
                                        helperText={errors.phone_number}
                                        from="from-contact"
                                    />
                                </Box>
                                <Box flexGrow={1}>
                                    <Typography variant="body2" fontWeight={600} gutterBottom sx={{ color: 'white'}}>Tiêu đề</Typography>
                                    <InputText
                                        label=""
                                        name="title"
                                        value={formData.title}
                                        onChange={handleCustomInputChange}
                                        type="text"
                                        sx={{ mt: 0}}
                                        margin="dense"
                                        placeholder="Nhập thông tin"
                                        from="from-contact"
                                    />
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12}}>
                            <Stack direction='column' flexGrow={1} sx={{ width: { xs: '100%', md: '80%'} }}>
                                <Typography variant="body2" fontWeight={600} gutterBottom sx={{ color: 'white'}}>Nội dung</Typography>
                                <InputText
                                    rows={5}
                                    multiline
                                    label=""
                                    name="content"
                                    value={formData.content}
                                    onChange={handleCustomInputChange}
                                    type="text"
                                    sx={{ mt: 0}}
                                    margin="dense"
                                    placeholder="Nhập thông tin"
                                    from="from-contact"
                                />
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12}}>
                            <Box display='flex' justifyContent='center' sx={{ width: { xs: '100%', md: '80%'} }}>
                                <Button
                                    sx={{
                                        px: 4,
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        borderRadius: '8px',
                                        backgroundColor: 'white',
                                        color: 'black',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                        width: '250px',
                                        '&:hover': {
                                            backgroundColor: 'black',
                                            color: 'white'
                                        },
                                    }}
                                    >
                                    Gửi thông tin
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    )
}

export default ContactConsultativeInfo;