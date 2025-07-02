import DialogComponent from "@/components/DialogComponent";
import { Button, Typography } from "@mui/material";
import React from "react";
interface DialogConformDeleteAccountProps{
    open: boolean,
    handleClose: () => void,
    handleAgree: () => void,
}
const DialogConformDeleteAccount: React.FC<DialogConformDeleteAccountProps> = (props) => {
    const { open, handleClose, handleAgree} = props;
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            isActiveFooter={false}
            isCenter={false}
        >
            <Typography fontWeight={500}>
                Bạn chắc chắn muốn xóa tài khoản này chứ? Tài khoản sẽ bị xóa vĩnh viễn không thể khôi phục
            </Typography>
            <Button
                
                variant="outlined"
                onClick={handleAgree}
                sx={{ mt: 2, border: "1px solid #1C1A1B", borderRadius: '20px', color: '#1C1A1B', width: '100px' }}
            >
                Chắc chắn
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

export default DialogConformDeleteAccount;