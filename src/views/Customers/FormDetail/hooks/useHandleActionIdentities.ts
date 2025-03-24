import { useCallback, useEffect } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import useIdentityTableColumns from '../IndentityTableColumns';
import useHandleImg from './useHandleImg';

import useNotification from '@/hooks/useNotification';
import { CreateCustomerForm } from '@/types/customer-types';

const useHandleActionIdentities = (form: UseFormReturn<CreateCustomerForm>) => {
  const { control, getValues } = form;
  const { t } = useTranslation('customer');
  const notify = useNotification();

  const fieldArray = useFieldArray({
    control: control,
    name: 'identityFields',
    keyName: 'fieldId',
  });

  const { files, handleDrop, handleDelete } = useHandleImg(form);
  const { columns: identityColumns } = useIdentityTableColumns({
    onDelete: (index) => {
      fieldArray.remove(index);
    },
    files,
    handleDrop,
    handleDelete,
    form,
  });

  // useEffect(() => {
  //   if (!files.length) return;
  //   const identityFieldsData = getValues('identityFields');
  //   if (!identityFieldsData) return;
  //   identityFieldsData.forEach((field, index) => {
  //     updateIdentity(index, {
  //       ...field,
  //       files: files,
  //     });
  //   });
  // }, [files]);

  const handleAddIdentity = useCallback(() => {
    const identityFieldsData = getValues('identityFields');
    const isValid = identityFieldsData?.every(
      (field) => field.identityType && field.identityNumber,
    );
    if (!isValid) {
      notify({
        message: t('error_validate_identity_fields'),
        severity: 'warning',
      });
      return;
    }
    fieldArray.insert(0, {
      identityType: '',
      identityNumber: '',
    });
  }, [fieldArray.insert, fieldArray.fields]);

  return {
    identityFields: fieldArray.fields,
    handleAddIdentity,
    identityColumns,
  };
};

export default useHandleActionIdentities;
