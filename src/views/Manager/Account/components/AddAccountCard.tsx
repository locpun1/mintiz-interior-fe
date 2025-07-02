import React from "react";
import { Box, Card, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import IconButton from "@/components/IconButton/IconButton";

interface AddAccountCardProps{
    handleAdd: () => void;
}
const AddAccountCard: React.FC<AddAccountCardProps> = ({handleAdd}) => {
    return (
        <Card sx={{
            height: 233,
            border: '2px dashed #ccc',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer',
            borderRadius: '15px'
        }}>
            <IconButton
                handleFunt={handleAdd}
                icon={<AddIcon fontSize="large" sx={{ color: '#1C1A1B'}} />}
            />
            <Typography>Thêm tài khoản</Typography>
        </Card>
    );
};

export default AddAccountCard;