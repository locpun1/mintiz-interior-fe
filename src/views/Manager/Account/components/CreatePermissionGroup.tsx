import React, { useState } from "react";
import {
  Box, Grid, Typography, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, Button
} from "@mui/material";
import { IMenu } from "@/types/permission";
import useNotification from "@/hooks/useNotification";
import { createRoleGroup } from "@/services/permission-service";

interface CreatePermissionGroupProps{
  modules: IMenu[],
  setReloadKey?: React.Dispatch<React.SetStateAction<number>>
}


const CreatePermissionGroup: React.FC<CreatePermissionGroupProps> = ({ modules, setReloadKey }) => {
  const [groupName, setGroupName] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const notify = useNotification();
  const [error, setError] = useState<string>('')

  // tìm tất cả action unique
  const allActions = Array.from(
    new Set(modules.flatMap((m) => m.actions.map((a) => a.name)))
  );


  const handleChangeGroupName = (value: any) => {
    setGroupName(value);
    setError('')
  }

  const validateForm = () : boolean => {
    let newErrors: string = '';
    if(!groupName.trim()){
      newErrors = 'Tên nhóm quyền không được để trống'
    }
    setError(newErrors)
    return !!groupName;
  }

  const handleCheck = (moduleCode: string, actionName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = `${moduleCode}_${actionName}`;
    setChecked({
      ...checked,
      [key]: event.target.checked
    });
  };

  const handleSave = async() => {
    if(!validateForm()){
      return;
    }
    // prepare payload
    const permission = modules.map((m) => ({
      id: m.id,
      code: m.code,
      name: m.name,
      path: m.path,
      actions: m.actions
        .filter((a) => checked[`${m.code}_${a.name}`])
        .map((a) => ({
          id: a.id,
          code: a.code,
          name: a.name,
          path: a.path ? a.path : null
        }))
    })).filter(item => item.actions.length > 0);
    const data = {
      "name": groupName,
      permission
    }
    try {
      const res = await createRoleGroup(data);
      notify({
        message: res.message,
        severity: 'success'
      })
      if(setReloadKey) {
        setReloadKey(prev => prev + 1)
      }
      setChecked({})
      setGroupName('')
    } catch (error: any) {
        notify({
          message: error.message,
          severity: 'error'
        })
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Tạo nhóm quyền</Typography>
          <Box mb={2}>
            <TextField
              label="Tên nhóm"
              value={groupName}
              onChange={(e) => handleChangeGroupName(e.target.value)}
              fullWidth
              name="name"
              error={!!error}
              helperText={error}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Quyền/ Hành động</TableCell>
                  {allActions.map((action) => (
                    <TableCell key={action} align="center">{action}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map((mod, index) => (
                  <TableRow key={index}>
                    <TableCell>{mod.name}</TableCell>
                    {allActions.map((action) => (
                      <TableCell key={action} align="center">
                        {mod.actions.some((a) => a.name === action) ? (
                          <Checkbox
                            checked={checked[`${mod.code}_${action}`] || false}
                            onChange={handleCheck(mod.code, action)}
                          />
                        ) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={3}>
            <Button sx={{ width: '150px', position: 'relative', bgcolor:"#1C1A1B", color: 'white'}} variant="contained" onClick={handleSave}>Lưu nhóm quyền</Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreatePermissionGroup;
