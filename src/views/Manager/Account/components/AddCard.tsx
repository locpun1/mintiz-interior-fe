import React from "react";
import { Box, Card, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import IconButton from "@/components/IconButton/IconButton";

interface AddAccountCardProps{
    handleAdd: () => void;
    title: string;
    isDisabled?: boolean;
    from?: string;
}
const AddCard: React.FC<AddAccountCardProps> = ({handleAdd, title, isDisabled, from}) => {
    return (
        <Card sx={{
            height: from ? 100 : 226,
            border: '2px dashed #ccc',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer',
            borderRadius: '15px'
        }}>
            <IconButton
                handleFunt={handleAdd}
                icon={<AddIcon fontSize="large" sx={{ color: '#1C1A1B'}} />}
                disabled={isDisabled}
            />
            <Typography>{title}</Typography>
        </Card>
    );
};

export default AddCard;