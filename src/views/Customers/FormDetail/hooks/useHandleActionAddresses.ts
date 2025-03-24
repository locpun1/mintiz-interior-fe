import { useCallback, useEffect } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import useAddressTableColumns from '../AddressTableColumns';

import { useAppSelector } from '@/store';
import { CreateCustomerForm } from '@/types/customer-types';

const useHandleActionAddresses = (form: UseFormReturn<CreateCustomerForm>) => {
  const { control, getValues } = form;

  const fieldArray = useFieldArray({
    control: control,
    name: 'addresses',
    keyName: 'fieldId',
  });

  const { columns: addressColumns } = useAddressTableColumns({
    form,
    fieldArray,
  });

  const { data: addressesResponse } = useAppSelector((state) => state.customerAddress);

  useEffect(() => {
    if (addressesResponse) {
      fieldArray.replace(addressesResponse);
    }
  }, [addressesResponse]);

  const handleAddAddress = useCallback(() => {
    fieldArray.insert(0, {
      postCode: '',
      address: '',
      area: '',
      district: '',
      province: '',
      country: '',
      isDefault: false,
    });
  }, [fieldArray.insert]);

  return {
    addresses: fieldArray.fields,
    handleAddAddress,
    addressColumns,
  };
};

export default useHandleActionAddresses;
