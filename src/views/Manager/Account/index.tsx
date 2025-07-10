import InputSearch from "@/components/SearchBar";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AddAccountCard from "./components/AddCard";
import UserCard from "./components/UserCard";
import Grid from "@mui/material/Grid2";
import { UserProfile } from "@/types/user-types";
import { activeUser, deleteUser, getListUsers, getUser, resetUser, UserPayload } from "@/services/user-service";
import CustomPagination from "@/components/Pagination/CustomPagination";
import DialogDetailUser from "./components/DialogDetailUser";
import DialogOpenConfirmAccount from "./components/DialogOpenConfirmAccount";
import useNotification from "@/hooks/useNotification";
import DialogAddAccount from "./components/DialogAddAccount";
import DialogEditAccount from "./components/DialogEditAccount";
import DialogConfirmSuccess from "./components/DialogConfirmSuccess";
import { debounce } from "lodash";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FilterTabs from "./components/FilterTabs";
import DialogConfirmResetSuccess from "./components/DialogConfirmResetSuccess";
import Page from "@/components/Page";

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
    const notify = useNotification();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(11);
    const [total, setTotal] = useState(11);
    const [error, setError] = useState(null);
    const [listUsers, setListUsers] = useState<UserProfile[]>([]);
    const [listUser, setListUser] = useState<UserProfile | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [idUser, setIdUser] = useState<string | number>('');
    const [viewMode, setViewMode] = useState<'all' | 0 | 1>('all');

    const [loading, setLoading] = useState(false);
    const [openAddAccount, setOpenAddAccount] = useState(false);
    const [openEditAccount, setOpenEditAccount] = useState(false);
    const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
    const [openResetAccount, setOpenResetAccount] = useState(false);
    const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
    const [openResetSuccess, setOpenResetSuccess] = useState(false);
    const [openDialogDetail, setOpenDialogDetail] = useState(false);
    const [openActiveAccount, setOpenActiveAccount] = useState(false);
    const [openConfirmActiveSuccess, setOpenConfirmActiveSuccess] = useState(false);
    

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

    const debounceGetUsers = useMemo(
        () => debounce((currentPage: number, currentSize: number, status?: string | number, currentSearchTerm?: string) => {
            getUsers(currentPage, currentSize, status, currentSearchTerm);
        }, 500),
        [getUsers]
    );
    

    useEffect(() => {
        if(searchTerm){
            debounceGetUsers(page, rowsPerPage, viewMode, searchTerm)
        }else{
            debounceGetUsers.cancel(); // huỷ mọi pending call
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
            const data: UserPayload = {
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

    const handleOpenActive = (id: string | number) => {
        setOpenActiveAccount(true)
        setIdUser(id)
    }

    const handleActive = async() => {
        try {
            const data: UserPayload = {
                is_deleted: 0
            }
            await activeUser(idUser, data)
            setOpenActiveAccount(false)
            setOpenConfirmActiveSuccess(true)
        } catch (error: any) {
            notify({
                message: error.message,
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
                            />
                            <Box mt={2}>
                                <FilterTabs data={DataStatusUser} viewMode={viewMode} onChange={setViewMode} />
                            </Box>
                            <Grid container spacing={1.5} pt={2}>
                                <Grid size={{ xs:12, sm:6, md:4, lg:3}}>
                                    <AddAccountCard title="Thêm tài khoản" handleAdd={handleAddAccount} />
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
                                            handleActive={handleOpenActive}
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
                            </>
                        )}
                                
                    </Box>
                )}
            </Page>
            {openAddAccount && (
                <DialogAddAccount
                    onBack={() => {
                        setOpenAddAccount(false)
                        getUsers(page, rowsPerPage, viewMode)
                    }}
                />
            )}
            {openEditAccount &&  (
                <DialogEditAccount
                    open={openEditAccount}
                    onClose={() => {
                        setOpenEditAccount(false)
                        getUsers(page, rowsPerPage, viewMode)
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
                <DialogOpenConfirmAccount
                    open={openDeleteAccount}
                    handleClose={() => {
                        setOpenDeleteAccount(false)
                    }}
                    handleAgree={handleDelete}
                    title="Bạn chắc chắn muốn xóa tài khoản này chứ? Tài khoản này sẽ bị vô hiệu hóa"
                />
            )}
            {openDeleteSuccess && (
                <DialogConfirmSuccess
                    open={openDeleteSuccess}
                    handleClose={() => {
                        setOpenDeleteSuccess(false)
                        getUsers(page, rowsPerPage, viewMode)
                    }}
                    title="Xin chúc mừng. Bạn vừa xóa tài khoản thành công"
                />
            )}
            {openResetAccount && (
                <DialogOpenConfirmAccount
                    open={openResetAccount}
                    handleClose={() => {
                        setOpenResetAccount(false)
                    }}
                    handleAgree={handleReset}
                    title="Xác nhận đặt lại mật khẩu cho nhân viên"
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
            {openActiveAccount && (
                <DialogOpenConfirmAccount
                    open={openActiveAccount}
                    handleClose={() => {
                        setOpenActiveAccount(false)
                    }}
                    handleAgree={handleActive}
                    title="Bạn muốn khôi phục tài khoản này?"
                />
            )}
            {openConfirmActiveSuccess && (
                <DialogConfirmSuccess
                    open={openConfirmActiveSuccess}
                    handleClose={() => {
                        setOpenConfirmActiveSuccess(false)
                        getUsers(page, rowsPerPage, viewMode)
                    }}
                    title="Xin chúc mừng. Bạn vừa kích hoạt tài khoản thành công"
                />
            )}
        </Box>
    )
}
export default ManagementAccount;