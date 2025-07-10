import DialogComponent from "@/components/DialogComponent";
import { Button, Typography } from "@mui/material";
import React from "react";
interface DialogOpenConfirmAccountProps{
    open: boolean,
    handleClose: () => void,
    handleAgree: () => void,
    title: string
}
const DialogOpenConfirmAccount: React.FC<DialogOpenConfirmAccountProps> = (props) => {
    const { open, handleClose, handleAgree, title} = props;
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            isActiveFooter={false}
            isActiveHeader={false}
            isCenter={false}
        >
            <Typography fontWeight={500}>
                {title}
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

export default DialogOpenConfirmAccount;