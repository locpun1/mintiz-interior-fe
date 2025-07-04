import DialogComponent from "@/components/DialogComponent";
import { Button, Typography } from "@mui/material";
import React from "react";
interface DialogConformEditAccountProps{
    open: boolean,
    handleClose: () => void,
}
const DialogConformEditAccount: React.FC<DialogConformEditAccountProps> = (props) => {
    const { open, handleClose} = props;
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            isActiveFooter={false}
            isActiveHeader={false}
            isCenter={false}
        >
            <Typography fontWeight={500}>
                Xin chúc mừng. Bạn vừa chỉnh sửa tài khoản nhân viên thành công
            </Typography>
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

export default DialogConformEditAccount;