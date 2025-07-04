import ControllerTextField from "@/components/ControllerField/ControllerTextField";
import DialogComponent from "@/components/DialogComponent";
import useBoolean from "@/hooks/useBoolean";
import useNotification from "@/hooks/useNotification";
import { changePasswordSchema } from "@/schemas/auth-schema";
import { changePassword } from "@/services/auth-service";
import { ChangePasswordRequest } from "@/types/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, IconButton, InputAdornment, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

interface DialogChangePasswordProps{
    open: boolean,
    onClose: () => void;
    userId: string | number;
}
interface IChangePasswordForm {
  currentPassword?: string;
  password: string;
  confirmPassword: string;
}

const DialogChangePassword: React.FC<DialogChangePasswordProps> = ({open, onClose, userId}) => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
        getValues,
        trigger,
    } = useForm<IChangePasswordForm>({
        resolver: yupResolver(changePasswordSchema),
    });
    const theme = useTheme();
    const notify = useNotification();

    const [_loading, setLoading] = useBoolean(false);
    const [showCurrentPassword, setShowCurrentPassword] = useBoolean(false);
    const [showPassword, setShowPassword] = useBoolean(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useBoolean(false);
    
    const onSubmit = async(values: IChangePasswordForm) => {
        setLoading.on();
        const body: ChangePasswordRequest = {
            password: values.password,
            is_default: 0,
            user_id: userId
        }
        try {
            await changePassword(body);
            notify({
                message: 'Thay đổi mật khẩu thành công',
                severity: 'success'
            })
            onClose()
        } catch (error: any) {
            notify({
                message: `Thay đổi mật khẩu thất bại, ${error.message}`,
                severity: 'error',
            })
        }finally{
            setLoading.off()
        }
    }
    
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={onClose}
            isActiveFooter={false}
            isCenter={false}
            dialogTitle="Thay đổi mật khẩu"
            fullWidth
        >
            <Box 
                component='form'
                onSubmit={handleSubmit(onSubmit)}
            >
                <ControllerTextField<IChangePasswordForm>
                    controllerProps={{
                        name: 'currentPassword',
                        defaultValue: '',
                        control: control
                    }}
                    textFieldProps={{
                        label: 'Mật khẩu hiện tại',
                        type: showCurrentPassword ? 'text' : 'password',
                        slotProps:{
                            input:{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle current password visibility"
                                            onClick={() => setShowCurrentPassword.toggle()}
                                            edge='end'
                                        >
                                            {showCurrentPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }
                    }}
                    prefixIcon={Lock}
                />
                <ControllerTextField<IChangePasswordForm>
                    controllerProps={{
                        name: 'password',
                        defaultValue: '',
                        control: control
                    }}
                    textFieldProps={{
                        label: 'Mật khẩu mới',
                        type: showPassword ? 'text' : 'password',
                        slotProps:{
                            input:{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle new password visibility"
                                            onClick={() => setShowPassword.toggle()}
                                            edge='end'
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }
                    }}
                    prefixIcon={Lock}
                />
                <ControllerTextField<IChangePasswordForm>
                    controllerProps={{
                        name: 'confirmPassword',
                        defaultValue: '',
                        control: control
                    }}
                    textFieldProps={{
                        label: 'Nhập lại mật khẩu',
                        type: showPasswordConfirm ? 'text' : 'password',
                        slotProps:{
                            input:{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={() => setShowPasswordConfirm.toggle()}
                                            edge='end'
                                        >
                                            {showPasswordConfirm ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }
                    }}
                    prefixIcon={Lock}
                />
                <Box mt={1}>
                    <LoadingButton
                        loading={_loading}
                        type='submit'
                        variant='contained'
                        sx={{width: 100, bgcolor: '#1C1A1B', mr: 2 }}
                    >
                        Lưu
                    </LoadingButton>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ border: '1px solid #1C1A1B',width: 100, color: '#1C1A1B'}}
                    >
                        Đóng
                    </Button>
                </Box>
            </Box>
        </DialogComponent>
    )
}

export default DialogChangePassword;