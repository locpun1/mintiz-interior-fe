import { ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Chip, FormControl } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PlaceHolder from './components/PlaceHolder';
import ProFormLabel from './ProFormLabel';

import useScrollbar from '@/hooks/useScrollbar';

interface Value<T> {
  value: T;
  label: string;
  key: number;
  color?: string;
}

interface Props<O extends FieldValues, V extends string | number>
  extends Omit<TextFieldProps, 'name' | 'onSelect'> {
  name: string;
  label?: string;
  options: O[];
  renderLabel: (option: O) => string;
  renderValue: (option: O) => V;
  renderColor?: (option: O) => string;
  renderTags?: (value: V[], getTagProps: any, entries: any) => ReactNode;
  getOptionDisabled?: (option: V) => boolean;
  onSelect?: (id: V[] | null) => Promise<void> | void;
  onInputSearch?: (inputValue: string) => Promise<void> | void;
  placeholder: string;
  actionText?: string;
  size?: 'small' | 'medium';
  disableCloseOnSelect?: boolean;
}

const ProFormAutocompleteTags = <O extends FieldValues, V extends string | number>(
  props: Props<O, V>,
) => {
  const {
    name,
    label,
    options,
    renderLabel,
    renderValue,
    renderColor,
    renderTags,
    getOptionDisabled,
    disabled,
    placeholder,
    actionText,
    onSelect,
    onInputSearch,
    required,
    size,
    disableCloseOnSelect,
    renderTags: _renderTags,
    ...rest
  } = props;

  const { t } = useTranslation('common');
  const scrollbar = useScrollbar();

  const { control } = useFormContext();

  const {
    field: { value, onChange, ...others },
    fieldState: { error },
  } = useController({ name, control });

  //Convert Array to object set value!!!! Warning
  const entries = options.reduce<Record<string | number, Value<V>>>((acc, option, i) => {
    const value = renderValue(option);
    const label = renderLabel(option);
    const color = renderColor ? renderColor(option) : '';
    acc[value] = { value, label, key: i, color };
    return acc;
  }, {});

  return (
    <FormControl error={Boolean(error)} fullWidth>
      <ProFormLabel name={name} title={label} required={required} gutterBottom>
        <Autocomplete
          id={name}
          disableCloseOnSelect={disableCloseOnSelect}
          disabled={disabled}
          multiple
          {...(disabled && {
            forcePopupIcon: false,
            readOnly: true,
          })}
          options={options.map(renderValue).filter(Boolean)}
          getOptionLabel={(option) => entries[option].label}
          renderTags={(_value, getTagProps) => {
            if (_renderTags) {
              return _renderTags(value, getTagProps, entries);
            } else {
              return _value.map((option, index) => {
                const { label, color } = entries[option];
                const tagProps = getTagProps({ index });
                const { key, ...restTagProps } = tagProps;
                if (color) {
                  return (
                    <Chip
                      key={key}
                      label={label}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px',
                        margin: '2px',
                        borderRadius: '4px',
                        backgroundColor: color,
                        color: 'white',
                      }}
                      {...restTagProps}
                    />
                  );
                }
                return <Chip key={key} label={label} {...restTagProps} />;
              });
            }
          }}
          noOptionsText={
            <PlaceHolder>{!options.length && actionText ? actionText : t('no_option')}</PlaceHolder>
          }
          slotProps={{
            paper: {
              elevation: 16,
              sx: scrollbar,
            },
          }}
          getOptionDisabled={getOptionDisabled}
          onInputChange={(event, newInputValue) => {
            if (onInputSearch) {
              onInputSearch(newInputValue);
            }
          }}
          size={size}
          renderInput={(params) => (
            <TextField
              error={Boolean(error)}
              helperText={error?.message && t(error.message)}
              placeholder={disabled ? void 0 : placeholder}
              {...params}
              {...rest}
            />
          )}
          renderOption={(props, option) => {
            const { value, label, key, color } = entries[option];
            if (color) {
              return (
                <Box component='li' {...props} value={value} key={key}>
                  <Typography
                    variant='subtitle2'
                    bgcolor={color}
                    color='#fff'
                    borderRadius='5px'
                    padding='2px 6px'
                  >
                    {label}
                  </Typography>
                </Box>
              );
            }
            return (
              <Box component='li' {...props} value={value} key={key}>
                <Typography variant='subtitle2' bgcolor={color}>
                  {label}
                </Typography>
              </Box>
            );
          }}
          {...others}
          value={value || []}
          onChange={(_event, value) => {
            // if (typeof isValid !== 'function' || isValid(value)) {
            onChange(value);
            onSelect?.(value);
            // }
          }}
        />
      </ProFormLabel>
    </FormControl>
  );
};

export default ProFormAutocompleteTags;
