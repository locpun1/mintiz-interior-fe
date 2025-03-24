import { array, boolean, number, string } from 'yup';

import { getTranslation } from '@/utils/getTranslation';
import Validation from '@/utils/Validation';

const t = getTranslation(['customer', 'error']);

export const createCustomerSchema = () =>
  Validation.shape({
    name: string().required(t('required', { name: t('name') })),
    customerType: string().required(t('required', { name: t('customer_type') })),
    customerGroupId: number().optional().nullable(),
    contacts: array()
      .of(
        Validation.shape({
          contactType: string().optional().nullable(),
          value: string().optional().nullable(),
        }),
      )
      .optional(),
    identityType: array().of(string().optional()),
    addresses: array().of(
      Validation.shape({
        postCode: string().optional(),
        address: string().optional(),
        country: string().optional(),
        province: string().optional(),
        district: string().optional(),
        area: string().optional(),
        isDefault: boolean().optional(),
      }),
    ),
  });

export const createCustomerAddressSchema = () =>
  Validation.shape({
    address: string().required(t('required', { name: t('address') })),
  });
