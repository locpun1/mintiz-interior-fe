import type { HTMLAttributes, ReactNode, SyntheticEvent } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import SearchIcon from '@mui/icons-material/Search';
import type { AutocompleteCloseReason } from '@mui/material/Autocomplete';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Popover from '@mui/material/Popover';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PlaceHolder from './components/PlaceHolder';
import ProFormLabel from './ProFormLabel';

import type { ChangeEvent } from '@/types/react';
import TypedArrray from '@/utils/TypedArrray';

interface Value<T> {
  key: string | number;
  label: string;
  subLabel?: string;
  value: T;
  disabled: boolean;
}

interface Props<O extends FieldValues, V extends string | number>
  extends Omit<TextFieldProps, 'name' | 'onSelect'> {
  name: string;
  options: O[];
  renderLabel?: (option: O) => string | ReactNode;
  renderSubLabel?: (option: O) => string;
  renderValue?: (option: O) => V;
  getOptionDisabled?: (option: O) => boolean;
  onSelect?: (value: V) => void;
  placeholder: string;
  actionText?: string; // Like placeholder, but for instruction
  confirmButton?: string;
  onConfirm?: () => void;
  disableCloseOnSelect?: boolean;
  renderSelectedValues?: (selectedValues: V[], entries: Map<string | number, Value<V>>) => string;
}

const ProFormCheckboxSelect = <O extends FieldValues, V extends string | number>(
  props: Props<O, V>,
) => {
  const {
    name,
    label,
    options,
    renderLabel = (option) => option.label,
    renderValue = (option) => option.value,
    renderSubLabel,
    disabled,
    placeholder,
    actionText,
    getOptionDisabled,
    onSelect,
    required,
    confirmButton,
    onConfirm,
    disableCloseOnSelect,
    ...rest
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [selectWidth, setSelectWidth] = useState<number>(0);
  const { t } = useTranslation('common');

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClosePopup = (_event: SyntheticEvent, reason: AutocompleteCloseReason) => {
    if (reason === 'escape') {
      handleClose();
    }
  };

  const { control, setValue, getValues } = useFormContext();

  const {
    field: { value, onChange, ...others },
  } = useController({ name, control });

  const entries = options.reduce<Map<string | number, Value<V>>>((acc, option, i) => {
    const value = renderValue(option);
    const label = renderLabel(option);
    const subLabel = renderSubLabel?.(option);
    const disabled = getOptionDisabled?.(option) || false;
    acc.set(value, { value, label, subLabel, disabled, key: i });
    return acc;
  }, new Map());

  const isValid = Array.isArray(value) && value.every((item) => entries.has(item));

  const handleChange: ChangeEvent = (event) => {
    const checked = event.target.checked;

    if (!checked) {
      setValue(name, []);
    } else {
      setValue(name, Array.from(entries.keys()));
    }

    setChecked(checked);
  };

  useEffect(() => {
    const values = getValues(name) || [];
    const allSelected = values.length === entries.size;
    setChecked(allSelected);
  }, [value, entries, name, getValues]);

  // Rollback
  useEffect(() => {
    if (isValid || value === null || TypedArrray.isEmpty(value)) {
      return;
    }
    setValue(name, []);
  }, [value, isValid, name, setValue]);

  // Add this useEffect to measure the Select component's width
  useEffect(() => {
    if (ref.current) {
      const width = ref.current.offsetWidth;
      setSelectWidth(width);
    }
  }, []);

  const handleButtonClick = () => {
    // Add your button click logic here
    onConfirm?.();
    handleClose();
  };

  return (
    <ProFormLabel name={name} title={label} required={required}>
      <Box ref={ref}>
        <Select
          value=''
          open={false}
          displayEmpty
          onClick={handleClick}
          renderValue={() => {
            const selectedValues = getValues(name) || [];
            const value = getValues(name) || [];
            if (!value.length) {
              return <PlaceHolder>{placeholder}</PlaceHolder>;
            }
            if (props.renderSelectedValues) {
              return props.renderSelectedValues(selectedValues, entries);
            }
            // return t('selected', { name: value.length });
            return t('selected', { name: selectedValues.length });
          }}
        />
      </Box>
      <Popover
        anchorEl={ref.current}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          variant: 'outlined',
          sx: { mt: 1, width: selectWidth || 300 }, // Use selectWidth here
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Autocomplete<V, true>
          id={name}
          open
          multiple
          disableCloseOnSelect
          disabledItemsFocusable
          onClose={handleClosePopup}
          disabled={disabled}
          {...(disabled && {
            forcePopupIcon: false,
          })}
          ListboxComponent={ListboxComponent}
          options={options.map(renderValue)}
          getOptionLabel={(option) => entries.get(option)?.label || ''}
          noOptionsText={!options.length && !actionText ? t('empty') : actionText}
          getOptionDisabled={(option) => entries.get(option)?.disabled || false}
          PopperComponent={PopperComponent}
          renderTags={() => null}
          forcePopupIcon={false}
          componentsProps={{
            paper: {
              elevation: 0,
              sx: { bgcolor: 'transparent' },
            },
          }}
          renderInput={(params) => (
            <Box
              ref={params.InputProps.ref}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
              }}
            >
              <Checkbox
                sx={{ mr: 1 }}
                checked={checked}
                onChange={handleChange}
                indeterminate={Array.from(entries.keys()).some((value) => {
                  const values = getValues(name) || [];
                  const isSelectedAll = values.length !== entries.size;
                  return isSelectedAll && values.includes(value);
                })}
              />
              <TextField
                autoFocus
                inputProps={params.inputProps}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder='Tìm kiếm'
                {...rest}
              />
            </Box>
          )}
          renderOption={(props, option, { selected }) => {
            const label = entries.get(option)?.label;
            const subLabel = entries.get(option)?.subLabel;
            const { key, ...optionProps } = props;
            return (
              <Box key={option} component='li' {...optionProps}>
                <Checkbox sx={{ mr: 1 }} checked={selected} />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='subtitle2'>{label}</Typography>
                  {subLabel && <Typography variant='caption'>{subLabel}</Typography>}
                </Box>
              </Box>
            );
          }}
          {...others}
          value={isValid ? value : []}
          onChange={(_event, value) => {
            onChange(value);
          }}
        />
        {confirmButton && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <Button variant='contained' onClick={handleButtonClick}>
              {confirmButton}
            </Button>
          </Box>
        )}
      </Popover>
    </ProFormLabel>
  );
};

// Popper
const AutocompletePopper = styled('div')({
  [`& .${autocompleteClasses.listbox}`]: {
    paddingTop: 0,
  },
  [`&.${autocompleteClasses.popperDisablePortal}`]: {
    position: 'relative',
  },
});

interface PopperComponentProps {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}
const PopperComponent = (props: PopperComponentProps) => {
  const { disablePortal, anchorEl, open, ...other } = props;
  return <AutocompletePopper {...other} />;
};

// Dropdown list
const ListboxComponent = forwardRef((props: HTMLAttributes<HTMLUListElement>, ref) => {
  return (
    <Box
      ref={ref}
      component='ul'
      sx={{
        maxHeight: 36 * 10 + 16,
        overflowY: 'auto',
        [`& > li.${autocompleteClasses.option}`]: {
          pl: 1,
        },
      }}
      {...props}
    />
  );
});
export default ProFormCheckboxSelect;
