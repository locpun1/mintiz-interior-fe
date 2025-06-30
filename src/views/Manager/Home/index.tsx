import InputSearch from "@/components/SearchBar";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";

const HomeDashboardManager: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const handleSearch = (value: string) => {
        setSearchTerm(value.trim())
    }
    return(
        <Box>
            <InputSearch
                initialValue={searchTerm}
                placeholder="Tìm kiếm"
                onSearch={handleSearch}
            />
        </Box>
    )
}

export default HomeDashboardManager;