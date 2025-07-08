import React, { useState } from "react";
import { Box, Button, Typography, useTheme, useMediaQuery } from "@mui/material";

interface Props{
    viewMode: any;
    onChange: (mode: any) => void;
    data: any[]
}

const FilterTabs: React.FC<Props> = ({ viewMode, onChange, data}) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const handleChange = (newValue: string | number) => {
        onChange(newValue as any);
    };

    return (
        <Box 
            display="flex"
            flexDirection={isSmall ? "column" : "row"}
            alignItems='center'
            gap={2}
        >
            {data.map((item) => (
                viewMode === item.value ? (
                    <Button
                        fullWidth={isSmall}
                        variant="outlined"
                        endIcon={item.icon}
                        onClick={() => handleChange(item.value)}
                        sx={{
                            borderRadius: "20px",
                            borderColor: "black",
                            color: "black",
                            fontSize: '14px'
                        }}
                    >
                        {item.label}
                    </Button>
                ) : (
                    <Box display="flex" alignItems="center" gap={1} sx={{ cursor: 'pointer',borderBottom: "2px solid black", pb: '2px' }} onClick={() => handleChange(item.value)}>
                        <Typography
                            variant="body1"
                            sx={{ 
                                fontWeight: "bold",  
                            }}
                        >
                            {item.label}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {item.icon}
                        </Box>
                    </Box>
                )
            ))}
        </Box>
    );
};

export default FilterTabs;
