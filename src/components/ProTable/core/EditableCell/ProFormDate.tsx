import { Dayjs } from 'dayjs';
import type { AnySchema } from 'yup';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import EventIcon from '@mui/icons-material/Event';
import TodayIcon from '@mui/icons-material/Today';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { DateFormat } from '@/constants/locale';
import Validation from '@/utils/Validation';

export interface FormDateProps {
  name: string;
  onSelect?: (date: Dayjs | null) => void;
  TextFieldProps?: TextFieldProps;
  shouldDisableDate?: (date: Dayjs) => boolean;
  DatePickerProps?: Partial<DatePickerProps<Dayjs>>;
  type?: 'start' | 'end';
  disabled?: boolean;
  validate?: AnySchema;
}

const ProFormDate = (props: FormDateProps) => {
  const {
    name,
    type = 'start',
    disabled,
    onSelect,
    TextFieldProps,
    DatePickerProps,
    shouldDisableDate,
    validate,
  } = props;

  const { t } = useTranslation();

  const { control } = useFormContext();

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: validate?.getDefault(),
    rules: { validate: Validation.validate(validate) },
  });

  const OpenPickerIcon = type === 'start' ? TodayIcon : EventIcon;

  return (
    <DatePicker
      disabled={disabled}
      format={DateFormat}
      shouldDisableDate={shouldDisableDate}
      onChange={(date: Dayjs | null) => {
        onChange(date);
        onSelect?.(date);
      }}
      value={value}
      {...DatePickerProps}
      slots={{
        openPickerIcon: disabled ? () => null : OpenPickerIcon,
        textField: (params) => (
          <TextField
            {...params}
            {...TextFieldProps}
            fullWidth
            size='small'
            error={Boolean(error)}
            helperText={error?.message && t(error.message)}
            id={name}
            slotProps={{
              input: {
                ...params.InputProps,
                ...TextFieldProps?.slotProps?.input,
                placeholder: disabled ? undefined : params.inputProps?.placeholder,
              },
            }}
          />
        ),
      }}
      slotProps={{
        popper: {
          sx: {
            '& .MuiPickersDay-root': {
              borderRadius: 1,
            },
            '& .MuiPickersDay-root.Mui-disabled': {
              opacity: 0.3,
            },
          },
        },
        actionBar: {
          actions: ['today'],
        },
        openPickerButton: {
          sx: { marginRight: 0 },
        },
      }}
    />
  );
};

export default ProFormDate;
