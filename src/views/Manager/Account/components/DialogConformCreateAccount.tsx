import DialogComponent from "@/components/DialogComponent";
import { Button, Typography } from "@mui/material";
import React from "react";
interface DialogConformCreateAccountProps{
    open: boolean,
    handleClose: () => void,
    handleContinueCreate: () => void,
}
const DialogConformCreateAccount: React.FC<DialogConformCreateAccountProps> = (props) => {
    const { open, handleClose, handleContinueCreate} = props;
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            isActiveFooter={false}
            isCenter={false}
        >
            <Typography fontWeight={500}>
                Xin chúc mừng. Bạn vừa tạo tài khoản thành công cho nhân viên
            </Typography>
            <Button
                
                variant="outlined"
                onClick={handleContinueCreate}
                sx={{ mt: 2, border: "1px solid #1C1A1B", borderRadius: '20px', color: '#1C1A1B', width: '100px' }}
            >
                Tiếp tục
            </Button>
            <Button
                variant="contained"
                onClick={handleClose}
                sx={{ mt: 2, ml: 2, color: 'white', backgroundColor: "#1C1A1B", borderRadius: '20px', width: '100px' }}
            >
                Quay lại
            </Button>
        </DialogComponent>
    )
}

export default DialogConformCreateAccount;