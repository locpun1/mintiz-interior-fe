import DialogComponent from "@/components/DialogComponent";
import { Button, Typography } from "@mui/material";
import React from "react";
interface DialogOpenConfirmResetAccountProps{
    open: boolean,
    handleClose: () => void,
    handleAgree: () => void,
}
const DialogOpenConfirmResetAccount: React.FC<DialogOpenConfirmResetAccountProps> = (props) => {
    const { open, handleClose, handleAgree} = props;
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            isActiveFooter={false}
            isCenter={false}
        >
            <Typography fontWeight={500}>
                Xác nhận đặt lại mật khẩu cho nhân viên
            </Typography>
            <Button
                
                variant="outlined"
                onClick={handleAgree}
                sx={{ mt: 2, border: "1px solid #1C1A1B", borderRadius: '20px', color: '#1C1A1B', width: '100px' }}
            >
                Đồng ý
            </Button>
            <Button
                variant="contained"
                onClick={handleClose}
                sx={{ mt: 2, ml: 2, color: 'white', backgroundColor: "#1C1A1B", borderRadius: '20px', width: '100px' }}
            >
                Hủy
            </Button>
        </DialogComponent>
    )
}

export default DialogOpenConfirmResetAccount;