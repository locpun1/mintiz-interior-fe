import { useMemo } from 'react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import useFetchData from './hooks/useFetchData';
import useGetOptions from './hooks/useGetOptions';
import {
  ActionRowParams,
  CreateActionRowParams,
  useBaseColumns,
} from '@/components/DynamicFormTable/BaseColumns';

import useDialog from '@/hooks/useDialog';
import useNotification from '@/hooks/useNotification';
import {
  createCustomerContact,
  deleteCustomerContact,
  updateCustomerContact,
} from '@/services/customer-service';
import {
  ContactType,
  CreateCustomerContactRequest,
  CreateCustomerForm,
  CustomerContact,
} from '@/types/customer-types';

interface Props {
  form: UseFormReturn<CreateCustomerForm>;
  fieldArray: UseFieldArrayReturn<CreateCustomerForm, 'contacts', 'fieldId'>;
}

const useContactTableColumns = ({ form, fieldArray }: Props) => {
  const { t } = useTranslation('customer');
  const { contactTypeOptions } = useGetOptions();
  const { getValues } = form;
  const dialog = useDialog();
  const notify = useNotification();
  const { id } = useParams();
  const { remove: removeContact } = fieldArray;
  const { fetchCustomerContacts } = useFetchData({ form });

  const onDelete = async ({ row }: ActionRowParams<CustomerContact>) => {
    if (!row.original.id) {
      removeContact(row.index);
    } else {
      if (!row.original.id) return;
      dialog({
        headline: t('customer_contact.delete_contact'),
        supportingText: t('customer_contact.delete_contact_content'),
        onConfirm: async () => {
          try {
            const res = await deleteCustomerContact(Number(row.original.id));
            if (res.statusCode === 200) {
              fetchCustomerContacts();
              notify({
                message: t('customer_contact.delete_contact_success'),
                severity: 'success',
              });
            }
          } catch (error) {
            console.error(error);
            notify({
              message: t('customer_contact.error_delete_contact'),
              severity: 'error',
            });
          }
        },
      });
    }
  };

  const onUpdate = async ({ row, setEditId }: ActionRowParams<CustomerContact>) => {
    const contacts = getValues('contacts');
    if (!id || !contacts) return;
    const contact = contacts[row.index];
    if (!contact) return;
    if (!contact.contactType) {
      form.setError(`contacts.${row.index}.contactType`, {
        message: t('customer_contact.contact_type_required'),
      });
      return;
    }
    try {
      const res = await updateCustomerContact(Number(contact.id), {
        contactType: Object.values(ContactType).find(
          (type) => type === contact.contactType,
        ) as ContactType,
        value: contact.value,
      });
      if (res?.statusCode === 200) {
        setEditId(null);
        fetchCustomerContacts();
        notify({
          message: t('customer_contact.update_contact_success'),
          severity: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      notify({
        message: t('customer_contact.error_update_contact'),
        severity: 'error',
      });
    }
  };

  const onCreate = async ({ row, setEditId }: CreateActionRowParams<CustomerContact>) => {
    const contacts = getValues('contacts');
    if (!contacts) return;
    const contact = contacts[row.index];
    if (!contact) return;
    if (!contact.contactType) {
      form.setError(`contacts.${row.index}.contactType`, {
        message: t('customer_contact.contact_type_required'),
      });
      return;
    }
    const payload: CreateCustomerContactRequest = {
      contactType: contact.contactType as ContactType,
      value: contact.value,
      customerId: Number(id) || 0,
    };
    try {
      const res = await createCustomerContact(payload);
      if (res?.statusCode === 200) {
        setEditId(null);
        fetchCustomerContacts();
        notify({
          message: t('customer_contact.create_contact_success'),
          severity: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      notify({
        message: t('customer_contact.create_contact_error'),
        severity: 'error',
      });
    }
  };

  const { createBaseSelectColumn, createBaseTextColumn, actionColumn } = useBaseColumns<
    CustomerContact,
    CreateCustomerForm
  >({
    onDelete,
    onUpdate,
    onCreate: id ? onCreate : undefined,
    key: 'contacts',
    form,
  });

  const columns = useMemo(
    () => [
      createBaseSelectColumn(
        'contactType',
        t('contact_type'),
        contactTypeOptions.map((option) => ({
          value: option.value,
          label: option.label,
        })),
        200,
      ),
      createBaseTextColumn('value', t('contact_value'), 200),
      actionColumn,
    ],
    [t, contactTypeOptions, createBaseSelectColumn],
  );

  return { columns };
};

export default useContactTableColumns;
