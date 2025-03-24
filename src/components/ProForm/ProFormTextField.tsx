import { MouseEventHandler } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SxProps } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import VisibilityIcon from '../VisibilityIcon';
import ProFormLabel from './ProFormLabel';

import type { Dictionary } from '@/types/common';

type Props = {
  interpolation?: Dictionary;
  name: string;
  VisibilityIconProps?: {
    show: boolean;
    onClick: MouseEventHandler<HTMLButtonElement> | undefined;
  };
  formControlSx?: SxProps;
} & TextFieldProps;

const ProFormTextField = (props: Props) => {
  const {
    VisibilityIconProps,
    name,
    placeholder,
    disabled,
    required,
    interpolation,
    label,
    type,
    formControlSx,
    ...rest
  } = props;

  const { t } = useTranslation();

  const { control } = useFormContext();

  const {
    field: { value, ref, onBlur, onChange },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <FormControl error={Boolean(error)} fullWidth sx={formControlSx}>
      <ProFormLabel name={name} title={label as string} required={required} gutterBottom>
        <TextField
          id={name}
          fullWidth
          required={required}
          error={Boolean(error)}
          helperText={error?.message && t(error.message, interpolation)}
          placeholder={disabled ? void 0 : placeholder}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          value={value ?? ''}
          name={name}
          inputRef={ref}
          autoComplete='new-password'
          {...rest}
          type={type === 'password' ? (VisibilityIconProps?.show ? 'text' : 'password') : type}
          slotProps={{
            input: {
              endAdornment:
                type === 'password' ? <VisibilityIcon {...VisibilityIconProps} /> : null,
              ...(rest?.slotProps?.input || {}),
            },
          }}
        />
      </ProFormLabel>
    </FormControl>
  );
};

export default ProFormTextField;
