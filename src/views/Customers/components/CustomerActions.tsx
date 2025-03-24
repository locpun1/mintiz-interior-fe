import { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, TextField, Typography } from '@mui/material';
import CreateCustomerButton from './CreateCustomerButton';
import BaseActionComponent from '@/components/BaseActionComponent';
import DialogComponent from '@/components/DialogComponent';
import LoadingScreen from '@/components/LoadingScreen';
import ActionButton from '@/components/ProButton/ActionButton';
import { TableRef } from '@/components/ProTable/types/refs';

import useDialog from '@/hooks/useDialog';
import useNotification from '@/hooks/useNotification';
import { deleteManyCustomer, exportCustomers, importCustomer } from '@/services/customer-service';
import { KEY_OPEN_DIALOG } from '@/types/dialog';

interface CustomerActionsProps {
  selectedRows: number[];
  refetch: () => void;
  setSelected: (rows: number[]) => void;
  tableRef: TableRef | null;
}

const CustomerActions = ({
  selectedRows,
  refetch,
  setSelected,
  tableRef,
}: CustomerActionsProps) => {
  const { t } = useTranslation(['customer', 'common']);
  const dialog = useDialog();
  const notify = useNotification();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogKey, setDialogKey] = useState<KEY_OPEN_DIALOG | null>(null);

  const handleUploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      await importCustomer(formData);
      notify({
        message: t('upload_success', { ns: 'customer' }),
        severity: 'success',
      });
      refetch();
      setDialogKey(null);
    } catch (error: any) {
      notify({
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteManyCustomer(selectedRows);
      refetch();
      notify({
        message: t('delete_selected_success', { ns: 'customer' }),
        severity: 'success',
      });
      setSelected([]);
      tableRef?.resetRowSelection();
    } catch (error) {
      notify({
        message: t('delete_selected_fail', { ns: 'customer' }),
        severity: 'error',
      });
    }
  };

  const additionalMenuItems = useMemo(
    () => [
      {
        label: t('upload_form_excel', { ns: 'customer' }),
        value: 1,
        actionType: 'description',
        onSelect: () => setDialogKey(KEY_OPEN_DIALOG.UPLOAD_CUSTOMER),
      },
      {
        label: t('actions.delete_selected', { ns: 'common' }),
        value: 2,
        actionType: 'delete',
        disabled: selectedRows.length === 0,
        onSelect: () => {
          dialog({
            headline: t('delete_selected_dialog.title', { ns: 'customer' }),
            supportingText: (
              <Fragment>{t('delete_selected_dialog.content', { ns: 'customer' })}</Fragment>
            ),
            onConfirm: handleDeleteSelected,
          });
        },
      },
    ],
    [selectedRows, refetch, setSelected, tableRef, t, dialog, handleDeleteSelected],
  );

  return (
    <>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
        <CreateCustomerButton />
        <BaseActionComponent
          exportFunction={exportCustomers}
          fileName='customers-export'
          additionalMenuItems={additionalMenuItems}
        />
      </Box>

      <DialogComponent
        dialogKey={dialogKey === KEY_OPEN_DIALOG.UPLOAD_CUSTOMER}
        handleClose={() => setDialogKey(null)}
        dialogTitle={t('upload', { ns: 'customer' })}
        dialogContentHeight={'100%'}
        customButtons={
          <ActionButton onClick={handleUploadFile} actionType='upload'>
            {t('upload', { ns: 'customer' })}
          </ActionButton>
        }
      >
        <TextField
          type='file'
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setFile(target.files ? target.files[0] : null);
          }}
          fullWidth
          variant='outlined'
        />
        <Typography marginTop={1} variant='caption'>
          {t('warning_upload', { ns: 'customer' })}
        </Typography>
        {loading && <LoadingScreen />}
      </DialogComponent>
    </>
  );
};

export default CustomerActions;
