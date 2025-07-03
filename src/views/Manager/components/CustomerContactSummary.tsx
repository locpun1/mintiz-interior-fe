// src/views/Manager/components/AccountSummary.tsx
import { Avatar, Box, Card, Grid, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Contact } from '@/types/contact-types';

interface CustomerContactCardProps {
    contact: Contact;
    handleClick: (id: string | number) => void;
}

const CustomerContactCard = ({ contact, handleClick }: CustomerContactCardProps) => (
    <Card variant="outlined" sx={{
        borderRadius: 3,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        p: 2,
        border: 'none',
        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
    }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: 'action.disabledBackground' }} />
        <Box flexGrow={1}>
            <Box sx={{display:'flex',
                justifyContent:'space-between'
            }}>
                <Typography variant="subtitle1" fontWeight={600}>{contact.name}</Typography>
                <Stack spacing={0.5} sx={{ display: 'flex' }}>
                    <IconButton onClick={(e) => {e.stopPropagation(), contact.id && handleClick(contact.id)}} size="small" color="primary"><VisibilityIcon fontSize="small" /></IconButton>
                </Stack>
            </Box>
            <Typography variant="body2" color="text.secondary">Email: {contact.email}</Typography>
            <Typography variant="body2" color="text.secondary">Điện thoại: {contact.phone}</Typography>
        </Box>

    </Card>
);

interface CustomerContactSummaryProps {
    contacts: Contact[];
    isLoading?: boolean;
    handleClick: (id: string | number) => void;
}

const CustomerContact = ({ contacts, isLoading, handleClick }: CustomerContactSummaryProps) => {

    if (isLoading) {
        return (
            <Grid container spacing={2}>
                {Array.from(new Array(6)).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Skeleton variant="rounded" height={80} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    // Nếu không có user nào, hiển thị thông báo
    if (contacts.length === 0) {
        return <Typography>Không có thông tin nào để hiển thị.</Typography>
    }

    return (
        <Grid container spacing={2}>
            {contacts.map((contact) => (
                <Grid item xs={12} sm={6} md={4} key={contact.id}>
                    <CustomerContactCard contact={contact} handleClick={() => handleClick(contact.id)} />
                </Grid>
            ))}
        </Grid>
    );
};

export default CustomerContact;