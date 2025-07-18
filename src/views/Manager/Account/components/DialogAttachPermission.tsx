import React, { useEffect, useState } from "react";
import {
  Box,
  List, ListItemIcon, Checkbox, ListItemText,
  Button, Grid, Paper,
  ListItemButton,
  Typography,
  Collapse,
  ListItem
} from "@mui/material";
import { ArrowLeft, ArrowRight, ExpandLess, ExpandMore } from "@mui/icons-material";
import DialogComponent from "@/components/DialogComponent";
import { UserProfile } from "@/types/user-types";
import CreatePermissionGroup from "./CreatePermissionGroup";
import { DATA_ALL_GROUPS } from "@/constants/data";
import CircleIcon from '@mui/icons-material/Circle';
import { assignedGroupToUser, getAllModules, getAllRoleGroups, getRoleGroupToUser } from "@/services/permission-service";
import { GroupPermission, IMenu } from "@/types/permission";
import useNotification from "@/hooks/useNotification";


interface Props {
  open: boolean;
  onClose: () => void;
  user: UserProfile
}

const AssignGroupsDialog: React.FC<Props> = ({ open, onClose, user }) => {
  const notify = useNotification();
  const [checked, setChecked] = useState<number | null>(null);
  const [assignedGroups, setAssignedGroups] = useState<GroupPermission | null>(null);
  const [allRoleGroups, setAllRoleGroups] = useState<GroupPermission[]>([]);
  const [openCollapse, setOpenCollapse] = useState<Record<number, boolean>>({});

  const [modules, setModules] = useState<IMenu[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string>('')

  const getModules = async() => {
    const res = await getAllModules();
    const data = res.data as any as IMenu[];
    setModules(data);
  };

  const getAllRoleGroupd = async() => {
    const res = await getAllRoleGroups();
    const data = res.data as any as GroupPermission[];
    setAllRoleGroups(data)
  }

  const getRoleGroupAssignedUser = async(id: string | number) => {
    const res = await getRoleGroupToUser(id);
    const data = res.data as any as GroupPermission;
    setAssignedGroups(data)
  }

  useEffect(() => {
    if(open && user){
      getModules();
      getAllRoleGroupd();
      getRoleGroupAssignedUser(user.id)
    }
  },[open,user])

useEffect(() => {
  if(reloadKey){
    getAllRoleGroupd();
  }
},[reloadKey])


  //Danh sách id nhóm chưa gán
  const unassignedGroups = allRoleGroups.filter(
    (group) => assignedGroups?.id !== group.id
  )

  const handleToggle = (value: number) => {
    if (checked === value) {
      setChecked(null); // bỏ chọn
    } else {
      setChecked(value);
      setError('')
    }
  };

  const handleExpandClick = (groupId: number) => {
    setOpenCollapse(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleAdd = () => {
    if (checked === null) return;
    const newAssigned = unassignedGroups.find(g => checked === g.id)
    if(!newAssigned) return;
    setAssignedGroups(newAssigned);
    setChecked(null)
    setError('')
  };

  const handleRemove = () => {
    if (checked === null) return;
  if (assignedGroups?.id === checked) {
      setAssignedGroups(null);
      setChecked(null);
  }
  };

  const handleSave = async() => {
    if(!assignedGroups){
      setError("Bạn chưa chọn nhóm quyền");
      return;
    }
    const data = {
      userId: user.id,
      roleGroupId: assignedGroups.id
    }
    try {
      const res = await assignedGroupToUser(data);
      notify({
        message: res.message,
        severity: 'success'
      })
    } catch (error: any) {
      notify({
        message: error.message,
        severity: 'error'
      })
    }
    
  }

  const handleClose = () => {
    onClose()
  }

  const renderGroupListLeft = (groups: GroupPermission[]) => (
    <List dense>
      {groups.map((group) => (
        <React.Fragment key={group.id}>
          <ListItemButton 
            disabled={!!assignedGroups} 
            onClick={() => {
              if(!assignedGroups) handleToggle(group.id)
            }}
            >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked === group.id}
                disabled={checked !== null && checked !== group.id || !!assignedGroups}
              />
            </ListItemIcon>
            <ListItemText primary={group.name} />
            <Box onClick={(e) => { e.stopPropagation(); handleExpandClick(group.id)}}>
              {openCollapse[group.id] ? <ExpandLess/> : <ExpandMore/>}
            </Box>
          </ListItemButton>
          <Collapse in={openCollapse[group.id]} timeout='auto' unmountOnExit>
            <List disablePadding>
              {group.permission.map((child) => (
                <ListItem key={child.id} sx={{ pl:10}}>
                  <ListItemIcon><CircleIcon sx={{ fontSize: '10px'}}/></ListItemIcon>
                  <Typography variant="subtitle2">{child.name}</Typography>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  )

    const renderGroupListRight = (group: GroupPermission | null) => (
    <List dense>
      {group && (
        <React.Fragment key={group.id}>
          <ListItemButton onClick={() => handleToggle(group.id)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked === group.id}
                disabled={checked !== null && checked !== group.id}
              />
            </ListItemIcon>
            <ListItemText primary={group.name} />
            <Box onClick={(e) => { e.stopPropagation(); handleExpandClick(group.id)}}>
              {openCollapse[group.id] ? <ExpandLess/> : <ExpandMore/>}
            </Box>
          </ListItemButton>
          <Collapse in={openCollapse[group.id]} timeout='auto' unmountOnExit>
            <List disablePadding>
              {group.permission?.map((child) => (
                <ListItem key={child.id} sx={{ pl:10}}>
                  <ListItemIcon><CircleIcon sx={{ fontSize: '10px'}}/></ListItemIcon>
                  <Typography variant="subtitle2">{child.name}</Typography>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      )}
    </List>
  )

  return (
    <DialogComponent maxWidth='md' fullWidth={true} dialogKey={open} handleClose={handleClose} isActiveFooter={false} isCenter={false} isActiveHeader={false}>
        <CreatePermissionGroup modules={modules} setReloadKey={setReloadKey}/>
        <Typography sx={{ p: 1 }} variant="h6" fontWeight={600} gutterBottom>{`Gán nhóm quyền cho ${user.fullName}`}</Typography>
        {allRoleGroups.length === 0 ? (
          <Typography mt={1} variant="body2" fontWeight={600}>Không tồn tại nhóm quyền nào cả, vui lòng tạo nhóm quyền ở trên</Typography>
        ) : (
          <>
          {error && (
            <Typography mb={2} variant="body2" fontWeight={600} color="error">{error}</Typography>
          )}
          <Grid container spacing={2}>
            {/* LEFT LIST */}
            <Grid item xs={5}>
              <Paper variant="outlined" sx={{ overflow: "auto" }}>
                <Typography variant="subtitle2" fontWeight={600} py={1} borderBottom='solid 1px #d3cfd1ff'>Danh sách nhóm quyền chưa được gán</Typography>
                {renderGroupListLeft(unassignedGroups)}
              </Paper>
            </Grid>

            {/* CENTER BUTTONS */}
            <Grid item xs={2}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                <Button
                  variant="outlined"
                  onClick={handleAdd}
                  disabled={checked === null || !unassignedGroups.some(g => g.id === checked)}
                  sx={{ mb: 2 }}
                >
                  <ArrowRight 
                    fontSize="large" 
                    sx={{
                      color: checked === null || !unassignedGroups.some(g => g.id === checked) ? 'grey.400' : 'primary.main'
                    }}
                  />
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRemove}
                  disabled={checked === null || assignedGroups?.id !== checked}
                >
                  <ArrowLeft 
                    fontSize="large"
                    sx={{
                      color: checked === null || assignedGroups?.id !== checked ? 'grey.400' : 'primary.main'
                    }}
                  />
                </Button>
              </Box>
            </Grid>

            {/* RIGHT LIST */}
            <Grid item xs={5}>
              <Paper variant="outlined" sx={{ height: 185, overflow: "auto" }}>
                <Typography variant="subtitle2" fontWeight={600} py={1} borderBottom='solid 1px #d3cfd1ff'>Danh sách nhóm quyền được gán</Typography>
                {renderGroupListRight(assignedGroups)}
              </Paper>
            </Grid>
          </Grid>
          <Box mt={2} display='flex' justifyContent='center'>
            <Button disabled={!!error} onClick={handleSave} sx={{ width: '100px', position: 'relative', bgcolor:"#1C1A1B", color: 'white', mr: 2}}>Lưu</Button>
            <Button onClick={handleClose} variant="outlined" sx={{ border: 'solid 1px #1C1A1B', color: '#1C1A1B', width: '100px'}}>Hủy</Button>
          </Box>
          </>
        )}
    </DialogComponent>
  );
};

export default AssignGroupsDialog;
