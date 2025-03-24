import keys from 'lodash/keys';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  field: string;
};

function useTriggerRow<T extends FieldValues>({ form, field }: Props<T>) {
  const onFocusError = async (index: number) => {
    const path = `${field}.${index}` as Path<T>;
    await form.trigger(path);
    const fieldState = form.getFieldState(path);
    const fieldNameError = keys(fieldState.error)[0] as keyof T;
    if (fieldNameError) {
      form.setFocus(`${path}.${fieldNameError as string}` as Path<T>);
    }
    return fieldState;
  };

  return { onFocusError };
}

export default useTriggerRow;
