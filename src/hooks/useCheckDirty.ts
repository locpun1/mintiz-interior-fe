import dayjs from 'dayjs';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { UseFormReturn } from 'react-hook-form';
import { useParams } from 'react-router-dom';

interface UseCheckDirtyProps {
  form: UseFormReturn<any>;
}

const useCheckDirty = ({ form }: UseCheckDirtyProps)   => {
  const { id } = useParams();
  const [currentFormValues, setCurrentFormValues] = useState<any>();

  useEffect(() => {
    const debouncedCb = _.debounce((formValue) => {
      setCurrentFormValues(_.cloneDeep(formValue));
    }, 300);
    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  const removeFieldIds = (obj: any): any => {
    // Handle null/undefined
    if (obj == null) {
      return obj;
    }

    // Handle strings - trim them
    if (typeof obj === 'string') {
      return obj.trim();
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(removeFieldIds);
    }

    // Handle objects
    if (typeof obj === 'object') {
      // Handle Dayjs objects
      if (dayjs.isDayjs(obj)) {
        return obj.format('YYYY-MM-DD');
      }

      const newObj = { ...obj };
      delete newObj.fieldId;

      Object.keys(newObj).forEach((key) => {
        if (newObj[key] != null) {
          newObj[key] = removeFieldIds(newObj[key]);
        }
      });

      return newObj;
    }

    // Return other types as is (numbers, booleans, etc)
    return obj;
  };

  const isDisabled = useCallback(() => {
    if (!id || !currentFormValues) return false;

    const currentValues = _.cloneDeep(currentFormValues);
    const initData = _.cloneDeep(form.getValues('initData'));

    // Remove initData from comparison
    delete currentValues.initData;

    // Remove fieldId from all nested objects and handle dates
    const cleanCurrentValues = removeFieldIds(currentValues);
    const cleanInitData = removeFieldIds(initData);

    return isEqual(cleanCurrentValues, cleanInitData);
  }, [id, currentFormValues, form]);

  return { isDisabled };
};

export default useCheckDirty;
