import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import DynamicFormTable from '@/components/DynamicFormTable';
import Page from '@/components/Page';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import PageWrapper from '@/components/PageWrapper';
import ActionButton from '@/components/ProButton/ActionButton';
import ProForm from '@/components/ProForm';
import ProFormSelect from '@/components/ProForm/Label/ProFormSelect';
import ProFormContent from '@/components/ProForm/ProFormContent';
import ProFormHeader from '@/components/ProForm/ProFormHeader';
import ProFormTextField from '@/components/ProForm/ProFormTextField';
import LoadingOverlay from '@/components/ProTable/core/LoadingOverlay';
import { Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper/Paper';
import { createCustomerSchema } from '../utils/schema.ts';
import useGetOptions from './hooks/useGetOptions.ts';
import useHandleActionAddresses from './hooks/useHandleActionAddresses';
import useHandleActionIdentities from './hooks/useHandleActionIdentities';
import useHandleSubmit from './hooks/useHandleSubmit.ts';
import useHandleActionContacts from './hooks/useHanleActionContacts.ts';

import { ROUTE_PATH } from '@/constants/routes';
import useReactiveTranslatedForm from '@/hooks/useReactiveTranslatedForm';
import useRefresh from '@/hooks/useRefresh';
import { useAppSelector } from '@/store';
import {
  CreateCustomerForm,
  CustomerAddress,
  CustomerContact,
  CustomerIdentityType,
  CustomerType,
} from '@/types/customer-types';

const CreateCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation(['customer', 'error']);
  const profile = useAppSelector((state) => state.auth.profile);
  const loading = useAppSelector((state) => state.customer.loading);
  const { customerGroupOptions } = useGetOptions();
  const [, refetch] = useRefresh();

  const form = useReactiveTranslatedForm<CreateCustomerForm>(createCustomerSchema, {
    mode: 'onSubmit',
    defaultValues: {
      createdById: profile?.username,
      customerType: CustomerType.CUSTOMER,
      contacts: [],
      identityFields: [],
      addresses: [],
    },
  });

  const { contacts, handleAddContact, contactColumns } = useHandleActionContacts(form);
  const { addresses, handleAddAddress, addressColumns } = useHandleActionAddresses(form);
  const { identityFields, handleAddIdentity, identityColumns } = useHandleActionIdentities(form);

  const { onSubmit } = useHandleSubmit();
  const {
    formState: { dirtyFields },
  } = form;

  const isDisabled = useMemo(() => {
    if (!id) return false;

    return !(dirtyFields.name || dirtyFields.customerType || dirtyFields.customerGroupId);
  }, [id, dirtyFields.name, dirtyFields.customerType, dirtyFields.customerGroupId]);

  return (
    <Page>
      <LoadingOverlay visible={loading} />
      <PageWrapper title={t('title_create')}>
        <PageBreadcrumbs
          title={id ? t('title_edit') : t('title_create')}
          items={[{ link: `${ROUTE_PATH.CUSTOMERS_LIST}`, text: t('customer') }]}
        />
        <Paper sx={{ width: '100%' }}>
          <ProForm form={form} onFinish={(data) => onSubmit(data)}>
            <Stack direction={'column'} sx={{ gridArea: 'left', minHeight: '100%' }}>
              <ProFormContent sx={{ minHeight: '100%' }}>
                <Paper
                  elevation={12}
                  sx={{
                    display: 'grid',
                    gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
                    height: 1,
                    p: 2,
                  }}
                >
                  <Box className='flex justify-between mb-4 items-center'>
                    <ProFormHeader>{id ? t('title_edit') : t('title_create')}</ProFormHeader>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <ActionButton
                        variant='contained'
                        color='inherit'
                        actionType='cancel'
                        onClick={() => navigate(ROUTE_PATH.CUSTOMERS_LIST)}
                      >
                        {t('actions.cancel', { ns: 'common' })}
                      </ActionButton>
                      <ActionButton
                        loading={loading}
                        variant='contained'
                        actionType='save'
                        type='submit'
                        disabled={isDisabled}
                      >
                        {id
                          ? t('actions.update', { ns: 'common' })
                          : t('actions.save', { ns: 'common' })}
                      </ActionButton>
                    </Box>
                  </Box>
                  <Grid container spacing={2} marginBottom={2}>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <ProFormTextField
                        label={t('name')}
                        required
                        name='name'
                        placeholder={t('name')}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <ProFormSelect
                        label={t('customer_group')}
                        name='customerGroupId'
                        placeholder={t('customer_group')}
                        options={customerGroupOptions}
                        renderLabel={(option) => option.label || ''}
                        renderValue={(option) => option.value || ''}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <ProFormTextField label={t('author')} name='createdById' disabled />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <ProFormSelect
                        label={t('customer_type')}
                        required
                        name='customerType'
                        placeholder={t('customer_type')}
                        options={[
                          { value: 'CUSTOMER', label: t('customer') },
                          { value: 'AGENCY', label: t('agency') },
                        ]}
                        renderLabel={(option) => option.label}
                        renderValue={(option) => option.value}
                      />
                    </Grid>
                  </Grid>
                </Paper>
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <DynamicFormTable<CustomerIdentityType>
                      fieldArrayName='identityFields'
                      columns={identityColumns}
                      addButtonText={t('add_more_identity')}
                      refetch={refetch}
                      onAdd={handleAddIdentity}
                      data={identityFields}
                      form={form}
                      initialstate={{
                        hiddenVisibilityColumns: true,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <DynamicFormTable<CustomerContact>
                      fieldArrayName='contacts'
                      columns={contactColumns}
                      addButtonText={t('add_more_contact')}
                      refetch={refetch}
                      data={contacts}
                      onAdd={handleAddContact}
                      initialstate={{
                        hiddenVisibilityColumns: true,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, lg: 12 }}>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <DynamicFormTable<CustomerAddress>
                      fieldArrayName='addresses'
                      columns={addressColumns}
                      addButtonText={t('add_more_address')}
                      refetch={refetch}
                      data={addresses}
                      onAdd={handleAddAddress}
                      initialstate={{
                        hiddenVisibilityColumns: true,
                      }}
                    />
                  </Box>
                </Grid>
              </ProFormContent>
            </Stack>
          </ProForm>
        </Paper>
      </PageWrapper>
    </Page>
  );
};

export default CreateCustomer;
