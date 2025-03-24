import { Dayjs } from 'dayjs';
import { useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Event as EventIcon, Today as TodayIcon } from '@mui/icons-material';
import type { TextFieldProps } from '@mui/material/TextField';
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ProFormLabel from './ProFormLabel';

import { DateFormat } from '@/constants/locale';

interface Props {
  name: string;
  label?: string;
  onSelect?: (date: Dayjs | undefined) => void;
  TextFieldProps?: TextFieldProps;
  shouldDisableDate?: (date: Dayjs) => boolean;
  DatePickerProps?: Partial<DatePickerProps<Dayjs>>;
  type: 'start' | 'end';
  disabled?: boolean;
  required?: boolean;
}
export default function ProFormDate(props: Props) {
  const {
    name,
    label,
    type = 'start',
    disabled,
    required,
    onSelect,
    TextFieldProps,
    DatePickerProps,
    shouldDisableDate,
  } = props;

  const { t } = useTranslation();

  const { control } = useFormContext();

  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController({ name, control });

  const OpenPickerIcon = type === 'start' ? TodayIcon : EventIcon;

  const handleDateChange = useCallback(
    (date: Dayjs | null) => {
      if (type === 'start') {
        onChange(date?.startOf('d'));
        onSelect?.(date?.startOf('d'));
      } else {
        onChange(date?.endOf('d'));
        onSelect?.(date?.endOf('d'));
      }
    },
    [onChange, onSelect],
  );

  return (
    <ProFormLabel name={name} title={label} required={required} gutterBottom>
      <DatePicker
        disabled={disabled}
        format={DateFormat}
        shouldDisableDate={shouldDisableDate}
        onChange={handleDateChange}
        value={value || null}
        {...DatePickerProps}
        dayOfWeekFormatter={(weekday) => `${weekday.format('dd')}`}
        slots={{
          openPickerIcon: disabled ? () => null : OpenPickerIcon,
        }}
        slotProps={{
          textField: (params) => ({
            fullWidth: true,
            size: 'small',
            error: Boolean(error),
            helperText: error?.message && t(error.message),
            id: name,
            inputRef: ref,
            slotProps: {
              input: {
                ...params.InputProps,
                ...TextFieldProps?.slotProps?.input,
                placeholder: disabled ? undefined : params.inputProps?.placeholder,
              },
            },
          }),
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
    </ProFormLabel>
  );
}
