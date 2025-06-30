import React from "react";
import { Box, Card, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const AddAccountCard: React.FC = () => {
    return (
        <Card sx={{
            width: 240, height: 220, m: 1,
            border: '2px dashed #ccc',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer',
            borderRadius: '15px'
        }}>
            <AddIcon fontSize="large" />
            <Typography>Thêm tài khoản</Typography>
        </Card>
    );
};

export default AddAccountCard;