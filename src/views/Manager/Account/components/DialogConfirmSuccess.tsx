import DialogComponent from "@/components/DialogComponent";
import { Button, Typography } from "@mui/material";
import React from "react";
interface DialogConfirmSuccessProps{
    open: boolean,
    handleClose: () => void,
    title: string
}
const DialogConfirmSuccess: React.FC<DialogConfirmSuccessProps> = (props) => {
    const { open, handleClose, title} = props;
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
                variant="contained"
                onClick={handleClose}
                sx={{ mt: 2, ml: 2, color: 'white', backgroundColor: "#1C1A1B", borderRadius: '20px', width: '100px' }}
            >
                Quay lại
            </Button>
        </DialogComponent>
    )
}

export default DialogConfirmSuccess;