import React, { useState } from "react";
import { Box, Button, Typography, useTheme, useMediaQuery } from "@mui/material";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DataStatusUserProps } from "..";

type TabValue = 'all' | 0 | 1 ;

interface Props{
    viewMode: TabValue;
    onChange: (mode: TabValue) => void;
    DataStatusUser: DataStatusUserProps[]
}

const FilterTabs: React.FC<Props> = ({ viewMode, onChange, DataStatusUser}) => {

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const handleChange = (newValue: string | number) => {
    onChange(newValue as TabValue);
  };

    return (
        <Box 
            display="flex"
            flexDirection={isSmall ? "column" : "row"}
            alignItems='center'
            gap={2}
        >
            {DataStatusUser.map((item) => (
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
                    <Box display="flex" alignItems="center" gap={1} sx={{ cursor: 'pointer' }} onClick={() => handleChange(item.value)}>
                        <Typography
                            variant="body1"
                            sx={{ 
                                fontWeight: "bold", 
                                borderBottom: "2px solid black" 
                            }}
                        >
                            {item.label}
                            <Typography component="span" sx={{ ml: 0.5, }}>
                                {item.icon}
                            </Typography>
                        </Typography>
                    </Box>
                )
            ))}
        </Box>
    );
};

export default FilterTabs;
