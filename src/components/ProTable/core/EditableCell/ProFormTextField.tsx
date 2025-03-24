import type { AnySchema } from 'yup';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';

import type { Dictionary } from '@/types/common';
import Validation from '@/utils/Validation';

export interface FormTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  interpolation?: Dictionary;
  validate?: AnySchema;
}

const ProFormTextField = (props: FormTextFieldProps) => {
  const { name, placeholder, disabled, required, interpolation, validate, defaultValue, ...rest } =
    props;

  const { t } = useTranslation();

  const { control } = useFormContext();

  const {
    field: { value, ref, onBlur, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: validate ? validate.getDefault() : defaultValue,
    rules: { validate: Validation.validate(validate) },
  });

  return (
    <TextField
      id={name}
      required={required}
      error={Boolean(error)}
      helperText={error?.message && t(error.message, interpolation)}
      placeholder={disabled ? void 0 : placeholder}
      disabled={disabled}
      onChange={(e) => {
        onChange(e);
      }}
      onBlur={onBlur}
      value={value ?? ''}
      name={name}
      inputRef={ref}
      autoComplete='new-password'
      {...rest}
    />
  );
};

export default ProFormTextField;
