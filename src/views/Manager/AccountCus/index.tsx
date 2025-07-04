import Page from "@/components/Page";
import InputSearch from "@/components/SearchBar";
import { getContact, getContacts } from "@/services/contact-service";
import { Contact } from "@/types/contact-types";
import { Alert, Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomerContact from "../components/CustomerContactSummary";
import CustomPagination from "@/components/Pagination/CustomPagination";
import DialogDetailCustomerInfo from "./components/DetailCustomerInfo";

const CustomerInfomation: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(12);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [contactId, setIdContact] = useState<string | number>('');
    const [openDialogViewCus, setOpenDialogViewCus] = useState(false);

    const fetchContactData = async (currentSearch?: string) => {
            setLoading(true)
            try {
                const contactsResponse = await getContacts({ limit: rowPerPage, page: page, searchTerm: currentSearch });
                setContacts(contactsResponse?.data?.contacts || []);
                contactsResponse.data?.totalContact && setTotal(contactsResponse.data?.totalContact)
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }finally{
                setLoading(false);
            }
        };
    useEffect(() => {
        if(searchTerm){
            fetchContactData(searchTerm);
        }else{
            fetchContactData();
        }
    }, [page, rowPerPage, searchTerm]);

    const handleSearch = (value: string) => {
        setSearchTerm(value.trim())
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleOpenDialogViewDetail = async(id: string | number) => {
        setIdContact(id)
        setOpenDialogViewCus(true)
    }

    return(
        <Box p={2}>
            <InputSearch
                initialValue={searchTerm}
                placeholder="Tìm kiếm"
                onSearch={handleSearch}
                style={{ width: {xs: '100%', md:'50%'}}}
            />
            <Page title="Quản lý thông tin">
                {error && !loading && (
                        <Alert severity="error" sx={{ my: 2}}>{error}</Alert>
                )}
                <Stack sx={{display:'flex',flexDirection:'column'}}>
                    <Box px={1} pt={2.5}>
                        <CustomerContact
                            handleClick={handleOpenDialogViewDetail}
                            contacts={contacts}
                            isLoading={loading}
                        />  
                    </Box>
                    
                    <Box display='flex' justifyContent='center'>
                        <CustomPagination
                            page={page}
                            count={total}
                            rowsPerPage={rowPerPage}
                            onPageChange={handlePageChange}
                        />
                    </Box>
                </Stack>
            </Page>
            {openDialogViewCus && contactId && (
                <DialogDetailCustomerInfo
                    open={openDialogViewCus}
                    onClose={() => { setOpenDialogViewCus(false)}}
                    contactId={contactId}
                />
            )}
        </Box>
    )
}

export default CustomerInfomation;