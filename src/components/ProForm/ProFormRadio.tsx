import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CollectionsBookmarkRounded } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import type { RadioGroupProps } from '@mui/material/RadioGroup';
import RadioGroup from '@mui/material/RadioGroup';
import ProFormLabel from './ProFormLabel';

import { convertStringToBoolean } from '@/utils/convertStringToBoolean';

interface Option {
  value: string | number | boolean;
  label: string;
}

interface Props extends Omit<FormControlLabelProps, 'control' | 'label' | 'onSelect'> {
  name: string;
  options: Option[];
  row?: RadioGroupProps['row'];
  onSelect?: (value: string | number | boolean) => void;
  label: string;
  required?: boolean;
}

const ProFormRadio = (props: Props) => {
  const { name, options, row, onSelect, sx, label, required, ...rest } = props;
  const { t } = useTranslation();

  const { control } = useFormContext();

  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <FormControl error={Boolean(error)} fullWidth>
      <ProFormLabel name={name} title={label as string} required={required} gutterBottom>
        <RadioGroup
          row={row}
          sx={sx}
          {...field}
          onChange={(event) => {
            const { value } = event.target;
            let newValue: string | number | boolean = value;
            if (['true', 'false'].includes(value)) {
              newValue = convertStringToBoolean(value);
            }
            field.onChange(newValue);
            onSelect?.(newValue);
          }}
        >
          {options.map(({ value, label }) => (
            <FormControlLabel
              {...rest}
              sx={{
                '.MuiFormControlLabel-label': {
                  fontSize: '14px',
                },
              }}
              key={value as string}
              value={value}
              control={<Radio />}
              label={label}
            />
          ))}
        </RadioGroup>
        {error?.message && <FormHelperText variant='standard'>{t(error.message)}</FormHelperText>}
      </ProFormLabel>
    </FormControl>
  );
};

export default ProFormRadio;
