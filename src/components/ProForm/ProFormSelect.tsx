import { forwardRef, Fragment } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SxProps } from '@mui/material';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import type { MenuItemProps } from '@mui/material/MenuItem';
import MenuItem from '@mui/material/MenuItem';
import type { SelectProps } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import PlaceHolder from './components/PlaceHolder';
import ProFormLabel from './ProFormLabel';

import useScrollbar from '@/hooks/useScrollbar';

interface Value<T> {
  key: string | number;
  label: string;
  value: T;
  disabled: boolean;
}

interface Props<O extends FieldValues, V extends string | number>
  extends Omit<SelectProps<V>, 'name' | 'renderValue' | 'onSelect' | 'value'> {
  name: string;
  label?: string;
  options: O[];
  renderLabel: (option: O) => string;
  renderValue: (option: O) => V;
  getOptionDisabled?: (option: O) => boolean;
  onSelect?: (value: V) => void;
  placeholder: string;
  actionText?: string;
  controlProps?: Partial<FormControlProps>;
}

const ProFormSelect = <O extends FieldValues, V extends string | number>(props: Props<O, V>) => {
  const {
    name,
    label,
    options,
    renderLabel,
    renderValue,
    disabled,
    placeholder,
    actionText,
    getOptionDisabled,
    onSelect,
    required,
    controlProps,
    ...rest
  } = props;

  const { t } = useTranslation();
  const scrollbar = useScrollbar();

  const { control } = useFormContext();

  const {
    field: { value, onChange, ...others },
    fieldState: { error },
  } = useController({ name, control });

  const { labels, entries } = options.reduce<{
    labels: Record<string | number, string>;
    entries: Value<V>[];
  }>(
    (acc, option, i) => {
      const value = renderValue(option);
      const label = renderLabel(option);
      const disabled = getOptionDisabled?.(option) || false;
      acc.labels[value] = label;
      acc.entries.push({ value, label, disabled, key: i });
      return acc;
    },
    { labels: {}, entries: [] },
  );

  return (
    <ProFormLabel name={name} title={label} required={required} gutterBottom>
      <FormControl fullWidth error={Boolean(error)} disabled={disabled} {...controlProps}>
        <Select<V>
          id={name}
          {...(disabled && {
            IconComponent: () => null,
          })}
          required={required}
          multiple={false}
          MenuProps={{
            MenuListProps: { dense: true },
            PaperProps: { sx: scrollbar },
          }}
          renderValue={(value) => {
            if (!(value in labels)) {
              return <PlaceHolder>{!disabled && placeholder}</PlaceHolder>;
            }
            return <Fragment>{labels[value]}</Fragment>;
          }}
          {...others}
          {...rest}
          value={value in labels ? value : -1}
          onChange={(event) => {
            onChange(event);
            onSelect?.(event.target.value as V);
          }}
        >
          {options.length > 0 && placeholder && (
            <PlainMenuItem value={-1} sx={{ display: 'none' }}>
              {placeholder}
            </PlainMenuItem>
          )}
          {!options.length && !actionText && (
            <PlainMenuItem value={-1}>{t('Không có lựa chọn')}</PlainMenuItem>
          )}
          {!options.length && actionText && <PlainMenuItem value={-1}>{actionText}</PlainMenuItem>}
          {entries.map((entry) => {
            const { value, label, disabled, key } = entry;
            return (
              <MenuItem key={key} value={value} disabled={disabled}>
                <Typography variant='subtitle2'>{label}</Typography>
              </MenuItem>
            );
          })}
        </Select>
        {error?.message && <FormHelperText variant='outlined'>{t(error.message)}</FormHelperText>}
      </FormControl>
    </ProFormLabel>
  );
};

const PlainMenuItem = forwardRef<HTMLLIElement, MenuItemProps>((props, ref) => {
  const { selected, ...rest } = props;
  return <MenuItem ref={ref} disabled selected={false} {...rest} />;
});

export default ProFormSelect;
