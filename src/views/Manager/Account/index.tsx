import InputSearch from "@/components/SearchBar";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import AddAccountCard from "./components/AddAccountCard";
import UserCard from "./components/UserCard";
import Grid from "@mui/material/Grid2";
import { UserProfile } from "@/types/user-types";
import { deleteUser, DeleteUserPayload, getListUsers, getUser } from "@/services/user-service";
import CustomPagination from "@/components/Pagination/CustomPagination";
import DialogDetailUser from "./components/DialogDetailUser";
import DialogConformDeleteAccount from "./components/DialogConformDeleteAccount";
import useNotification from "@/hooks/useNotification";
import DialogAddAccount from "./components/DialogAddAccount";
import DialogEditAccount from "./components/DialogEditAccount";
import DialogConformDeleteSuccess from "./components/DialogConformDeleteSuccess";

const ManagementAccount: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(11);
    const [total, setTotal] = useState(11);
    const [openAddAccount, setOpenAddAccount] = useState(false);
    const [openEditAccount, setOpenEditAccount] = useState(false);
    const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
    const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
    const [listUsers, setListUsers] = useState<UserProfile[]>([]);
    const [listUser, setListUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDialogDetail, setOpenDialogDetail] = useState(false);
    const [idUser, setIdUser] = useState<string | number>('');
    const notify = useNotification();

    const getUsers = useCallback(async(currentPage: number, currentSize: number) => {
        setLoading(false);
        try {
            const res = await getListUsers(currentPage, currentSize);
            setTotal(res.totalCount);
            const data = res.data as any as UserProfile[];
            setListUsers(data)
        } catch (error: any) {
            setError(error.message);
            setListUsers([])
        }finally{
            setLoading(false)
        }
    },[])

    useEffect(() => {
        getUsers(page, rowsPerPage)
    },[page, rowsPerPage])
    const handleSearch = (value: string) => {
        setSearchTerm(value.trim())
    }

    const handleAddAccount = () => {
        setOpenAddAccount(true)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleClick = async(id: string | number) => {
        try {
            const res = await getUser(id);
            const data = res as any as UserProfile;
            setListUser(data)
            setOpenDialogDetail(true)
        } catch (error) {
            setListUser(null)
        }
    }

    const handleOpenDelete = (id: string | number) => {
        setOpenDeleteAccount(true)
        setIdUser(id)
    }
    
    const handleDelete = async() => {
        try {
            const data: DeleteUserPayload = {
                is_deleted: 1
            }
            await deleteUser(idUser, data);
            setOpenDeleteAccount(false)
            getUsers(page, rowsPerPage);
            setOpenDeleteSuccess(true)
        } catch (error: any) {
            notify({
                message: error.message,
                severity: 'error' 
            })
        }
    }

    const handleOpenEdit = (id: string | number) => {
        setOpenEditAccount(true);
        setIdUser(id)
    }
    
    return(
        <Box p={2}>
            {!openAddAccount && (
                <Box px={1.5}>
                    {loading && (
                        <Box display='flex' justifyContent='center' my={3}>
                            <CircularProgress/>
                        </Box>
                    )}
                    {error && !loading && (
                        <Alert severity="error" sx={{ my: 2}}>{error}</Alert>
                    )}
                    {!loading && !error && (
                        <>
                            <InputSearch
                                initialValue={searchTerm}
                                placeholder="Tìm kiếm"
                                onSearch={handleSearch}
                                style={{ width: {xs: '100%', md:'50%'}}}
                            />
                            <Grid container spacing={2} pt={3}>
                                <Grid size={{ xs:12, sm:6, md:4, lg:3}}>
                                    <AddAccountCard handleAdd={handleAddAccount} />
                                </Grid>
                                {listUsers.length === 0 ? (
                                    <Typography sx={{ mx: 2, mt: 3}} variant="h6">Không tồn tại bản ghi nào cả</Typography>
                                ) : (
                                    listUsers.map((user, index) => (
                                    <Grid size={{ xs:12, sm:6, md:4, lg:3}} key={index}>
                                        <UserCard
                                            userProfile={user}
                                            handleClick={handleClick}
                                            handleDelete={handleOpenDelete}
                                            handleEdit={handleOpenEdit}
                                        />
                                    </Grid>
                                )))}
                            </Grid> 
                            <Box display='flex' justifyContent='center' alignItems='center'>
                                <CustomPagination
                                    count={total}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    onPageChange={handlePageChange}
                                    sx={{ mt: 2}}
                                />
                            </Box>                        
                        </>
                    )}
                              
                </Box>
            )}
            {openAddAccount && (
                <DialogAddAccount
                    onBack={() => {
                        setOpenAddAccount(false)
                        getListUsers(page, rowsPerPage)
                    }}
                />
            )}
            {openEditAccount &&  (
                <DialogEditAccount
                    open={openEditAccount}
                    onClose={() => {
                        setOpenEditAccount(false)
                    }}
                    userId={idUser}
                />
            )}
            {openDialogDetail && listUser &&  (
                <DialogDetailUser
                    open={openDialogDetail}
                    onClose={() => {
                        setOpenDialogDetail(false)
                    }}
                    userDetail={listUser}
                />
            )}
            {openDeleteAccount && (
                <DialogConformDeleteAccount
                    open={openDeleteAccount}
                    handleClose={() => {
                        setOpenDeleteAccount(false)
                    }}
                    handleAgree={handleDelete}
                />
            )}
            {openDeleteSuccess && (
                <DialogConformDeleteSuccess
                    open={openDeleteSuccess}
                    handleClose={() => {
                        setOpenDeleteSuccess(false)
                        getListUsers(page, rowsPerPage)
                    }}
                />
            )}
        </Box>
    )
}
export default ManagementAccount;