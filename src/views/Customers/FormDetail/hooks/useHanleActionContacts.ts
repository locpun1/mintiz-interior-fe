import { useCallback, useEffect } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import useContactTableColumns from '../ContactTableColumns';

import useNotification from '@/hooks/useNotification';
import { useAppSelector } from '@/store';
import { CreateCustomerForm } from '@/types/customer-types';

const useHandleActionContacts = (form: UseFormReturn<CreateCustomerForm>) => {
  const { control, getValues } = form;

  const fieldArray = useFieldArray({
    control: control,
    name: 'contacts',
    keyName: 'fieldId',
  });

  const { columns: contactColumns } = useContactTableColumns({
    form,
    fieldArray,
  });
  const { t } = useTranslation('customer');
  const notify = useNotification();
  const { customerContact: contactsResponse } = useAppSelector((state) => state.customer);
  useEffect(() => {
    if (contactsResponse) {
      fieldArray.replace(contactsResponse);
    }
  }, [contactsResponse]);

  const handleAddContact = useCallback(() => {
    const contactsData = getValues('contacts');
    if (!contactsData) return;
    const isValid = contactsData.every((contact) => contact.contactType && contact.value);
    if (!isValid) {
      notify({
        message: t('customer_contact.warning_fileds'),
        severity: 'warning',
      });
      return;
    }
    fieldArray.insert(0, {
      contactType: '',
      value: '',
    });
  }, [fieldArray.insert, getValues()]);

  return { contacts: fieldArray.fields, handleAddContact, contactColumns };
};

export default useHandleActionContacts;
