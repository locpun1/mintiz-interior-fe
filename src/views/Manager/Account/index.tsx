import InputSearch from "@/components/SearchBar";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import AddAccountCard from "./components/AddAccountCard";
import UserCard from "./components/UserCard";
import Grid from "@mui/material/Grid2";
import { UserProfile } from "@/types/user-types";
import { deleteUser, DeleteUserPayload, getListUsers, getUser, resetUser } from "@/services/user-service";
import CustomPagination from "@/components/Pagination/CustomPagination";
import DialogDetailUser from "./components/DialogDetailUser";
import DialogConformDeleteAccount from "./components/DialogConformDeleteAccount";
import useNotification from "@/hooks/useNotification";
import DialogAddAccount from "./components/DialogAddAccount";
import DialogEditAccount from "./components/DialogEditAccount";
import DialogConformDeleteSuccess from "./components/DialogConformDeleteSuccess";
import { debounce } from "lodash";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import FilterTabs from "./components/FilterTabs";
import DialogOpenConfirmResetAccount from "./components/DialogOpenConfirmResetAccount";
import DialogConfirmResetSuccess from "./components/DialogConfirmResetSuccess";
import Page from "@/components/Page";

const debounceFetchFile = debounce(
  (
    fn: (page: number, limit: number, status?: string | number, searchTerm?: string) => void,
    page: number,
    limit: number,
    status?: string | number,
    searchTerm?: string
  ) => {
    fn(page, limit, status, searchTerm);
  },
  500
);

export interface DataStatusUserProps {
    id: number | string;
    value: number | string,
    label: string,
    icon: React.ReactNode
}

const DataStatusUser: DataStatusUserProps[] = [
    {
        id: 1,
        value: 'all',
        label: 'Tất cả',
        icon:<FilterAltOutlinedIcon fontSize="small"/>
    },
    {
        id: 2,
        value: 0,
        label: 'Đang hoạt động',
        icon:<CheckCircleOutlineIcon color="success" fontSize="small"/>
    },
    {
        id: 3,
        value: 1,
        label: 'Không hoạt động',
        icon:<CancelOutlinedIcon color="error" fontSize="small"/>
    },
]

const ManagementAccount: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(11);
    const [total, setTotal] = useState(11);
    const [openAddAccount, setOpenAddAccount] = useState(false);
    const [openEditAccount, setOpenEditAccount] = useState(false);
    const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
    const [openResetAccount, setOpenResetAccount] = useState(false);
    const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
    const [openResetSuccess, setOpenResetSuccess] = useState(false);
    const [listUsers, setListUsers] = useState<UserProfile[]>([]);
    const [listUser, setListUser] = useState<UserProfile | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDialogDetail, setOpenDialogDetail] = useState(false);
    const [idUser, setIdUser] = useState<string | number>('');
    const notify = useNotification();
    const [viewMode, setViewMode] = useState<'all' | 0 | 1>('all');

    const getUsers = useCallback(async(currentPage: number, currentSize: number, status?: string | number, currentSearchTerm?: string) => {
        setLoading(false);
        try {
            const res = await getListUsers(currentPage, currentSize, status, currentSearchTerm);
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
        if(searchTerm){
            // debounceFetchFile(getUsers, page, rowsPerPage, viewMode, searchTerm)
            getUsers(page, rowsPerPage, viewMode, searchTerm)
        }else{
            getUsers(page, rowsPerPage, viewMode)
        }
    },[page, rowsPerPage, searchTerm, viewMode])

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

    const handleOpenReset = (id: string | number) => {
        setOpenResetAccount(true)
        setIdUser(id)
    }

    const handleReset = async() => {
        try {
            const res = await resetUser(idUser);
            console.log("res: ", res);
            const data = res.data as any as UserProfile;
            setUser(data);
            setOpenResetAccount(false)
            setOpenResetSuccess(true)
        } catch (error: any) {
            notify({
                message: "Reset mật khẩu thất bại",
                severity: 'error' 
            })
        }
    }

    return(
        <Box p={2}>
            <Page title="Quản lý tài khoản">
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
                            <Box mt={2}>
                                <FilterTabs DataStatusUser={DataStatusUser} viewMode={viewMode} onChange={setViewMode} />
                            </Box>
                            <Grid container spacing={1.5} pt={2}>
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
                                            handleReset={handleOpenReset}
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
                                    sx={{ mt: 1.5}}
                                />
                                <Box mt={2}>
                                    <FilterTabs DataStatusUser={DataStatusUser} viewMode={viewMode} onChange={setViewMode} />
                                </Box>
                                <Grid container spacing={1.5} pt={2}>
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
                                                handleReset={handleOpenReset}
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
                                        sx={{ mt: 1.5}}
                                    />
                                </Box> 
                            </Box>                       
                            </>
                        )}
                                
                    </Box>
                )}
            </Page>
            {openAddAccount && (
                <DialogAddAccount
                    onBack={() => {
                        setOpenAddAccount(false)
                        getListUsers(page, rowsPerPage, viewMode)
                    }}
                />
            )}
            {openEditAccount &&  (
                <DialogEditAccount
                    open={openEditAccount}
                    onClose={() => {
                        setOpenEditAccount(false)
                        getListUsers(page, rowsPerPage, viewMode)
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
                        getListUsers(page, rowsPerPage, viewMode)
                    }}
                />
            )}
            {openResetAccount && (
                <DialogOpenConfirmResetAccount
                    open={openResetAccount}
                    handleClose={() => {
                        setOpenResetAccount(false)
                    }}
                    handleAgree={handleReset}
                />
            )}
            {openResetSuccess && user && (
                <DialogConfirmResetSuccess
                    open={openResetSuccess}
                    handleClose={() => {
                        setOpenResetSuccess(false)
                    }}
                    user={user}
                />
            )}
        </Box>
    )
}
export default ManagementAccount;