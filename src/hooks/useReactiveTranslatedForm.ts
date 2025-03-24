import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { AnyObject, ObjectSchema } from 'yup';
import { useEffect, useMemo } from 'react';
import { FieldValues, Path, Resolver, useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const useReactiveTranslatedForm = <T extends FieldValues>(
  schemaFunction: () => ObjectSchema<AnyObject>,
  rest?: Omit<UseFormProps<T>, 'resolver'>,
): UseFormReturn<T> => {
  const { i18n } = useTranslation();
  const memoizedSchema = useMemo(() => schemaFunction(), [i18n.language]);

  const form = useForm<T>({
    ...rest,
    resolver: yupResolver(memoizedSchema) as unknown as Resolver<T, any>,
  });

  useEffect(() => {
    if (form.formState.isSubmitted) {
      form.trigger();
    } else if (!_.isEmpty(form.formState.errors)) {
      form.trigger(_.keys(form.formState.errors) as Path<T>[]);
    }
  }, [i18n.language]);
  return form;
};

export default useReactiveTranslatedForm;
