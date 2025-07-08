import DialogComponent from "@/components/DialogComponent";
import { Box, Button, Stack } from "@mui/material";
import React from "react";

interface DialogOpenImageProps{
    open: boolean,
    onClose: () =>  void;
    preview: string
}

const DialogOpenImage: React.FC<DialogOpenImageProps> = ({open, onClose, preview}) => {
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={onClose}
            isActiveFooter={false}
            isActiveHeader={false}
            isCenter={false}
        >
            <Stack direction='column' alignItems='center'>
                <Box
                    component="img"
                    src={preview}
                    alt="Preview"
                    sx={{ maxHeight: 300, maxWidth: '100%', mt: 2, borderRadius: 2 }}
                />
                <Button onClick={onClose} variant="outlined" sx={{border: '1px solid #1C1A1B', color: '#1C1A1B', width: { xs: '100%', md: 120}}}>Đóng</Button>
            </Stack>
        </DialogComponent>
    )
}

export default DialogOpenImage;