import InputSearch from "@/components/SearchBar";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import AddAccountCard from "./components/AddAccountCard";
import UserCard from "./components/UserCard";

const ManagementAccount: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const handleSearch = (value: string) => {
        setSearchTerm(value.trim())
    }
    const users = Array(11).fill({
        name: "Nguyễn Văn Quyết",
        email: "ABC123@mintz.vn",
        password: "*******",
        avatarUrl: "https://i.pravatar.cc/150?img=1"
    });
    return(
        <Box p={2}>
            <InputSearch
                initialValue={searchTerm}
                placeholder="Tìm kiếm"
                onSearch={handleSearch}
                width='50%'
            />
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                p: 2,
            }}>
                <AddAccountCard />
                {users.map((user, index) => (
                    <UserCard
                        key={index}
                        name={user.name}
                        email={user.email}
                        password={user.password}
                        avatarUrl={user.avatarUrl}
                    />
                ))}
            </Box>
        </Box>
    )
}
export default ManagementAccount;