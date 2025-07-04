import DialogComponent from "@/components/DialogComponent";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Contact } from "@/types/contact-types";
import Grid from "@mui/material/Grid2"
import { getContact } from "@/services/contact-service";

interface DialogDetailCustomerInfoProps{
    open: boolean,
    onClose: () => void;
    contactId: string | number;
}

const DialogDetailCustomerInfo: React.FC<DialogDetailCustomerInfoProps> = ({ open, onClose, contactId}) => {
    const [contact, setContact] = useState<Contact | null> (null);

    useEffect(() => {
        if(open && contactId){
            const getDetailContact = async() => {
                const res = await getContact(contactId);
                const data = res.data as any as Contact;
                setContact(data);
            }
            getDetailContact();
        }
    }, [open, contactId])

    return(
        <DialogComponent
            dialogKey={open}
            handleClose={onClose}
            isActiveFooter={false}
            isActiveHeader={false}
        >
            <Box p={2} width={{ xs: '100%', md: 380}} display='flex' flexDirection='column'>
                <Grid container spacing={1}>
                    <Grid size={{ xs: 12}}>
                        <Stack direction='column' flexGrow={1} display='flex' justifyContent='center' alignItems='center'>
                            <Avatar
                                sx={{ 
                                    width: '100px', height: '100px', mb: 2, borderRadius:'50%', boxShadow: 4,
                                    bgcolor: 'action.disabledBackground'
                                }}
                            />
                            {contact && <Typography variant="subtitle2" color="text.secondary">Mail: {contact.email}</Typography>}
                            {contact && <Typography variant="subtitle2" color="text.secondary">Điện thoại: {contact.phone}</Typography>}
                        </Stack>
                    </Grid>
                    <Grid size={{ xs:12}}>
                        <Grid container spacing={1}>
                            <Grid size={{ xs:3, md: 2.5}}>
                                <Typography variant="body2" fontWeight={500}>Tiêu đề:</Typography>
                            </Grid>
                            <Grid size={{ xs: 9, md: 9.5}} sx={{ display: 'flex', justifyContent: 'start'}}>
                                {contact && <Typography variant="body2">{contact.title || '-'}</Typography>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={{ xs:12}}>
                        <Grid container spacing={1}>
                            <Grid size={{ xs:3, md: 2.5}}>
                                <Typography variant="body2" fontWeight={500}>Nội dung:</Typography>
                            </Grid>
                            <Grid size={{ xs: 9, md: 9.5}} sx={{ display: 'flex', justifyContent: 'start'}}>
                                {contact && <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap'}}>{contact.message || '-'}</Typography>}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
                <Box display="flex" justifyContent="center">
                    <Button
                        variant="outlined"
                        sx={{ width: '120px', color: '#1C1A1B', border: '1px solid #1C1A1B', borderRadius: '15px'}}
                        onClick={onClose}
                    >
                        Đóng
                    </Button>
                </Box>
            
        </DialogComponent>
    )
}
export default DialogDetailCustomerInfo;