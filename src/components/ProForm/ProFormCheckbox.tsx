import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { SxProps, Theme } from '@mui/material/styles';
import ProFormLabel from './ProFormLabel';

interface Props {
  name: string;
  label?: string;
  required?: boolean;
  containerSx?: SxProps<Theme>;
  labelSx?: SxProps<Theme>;
  disabled?: boolean;
}

const ProFormCheckbox = (props: Props) => {
  const { name, label, required, containerSx, labelSx, disabled } = props;
  const { t } = useTranslation();

  const { control } = useFormContext();

  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    field.onChange(checked);
  };

  return (
    <FormControl error={Boolean(error)} sx={containerSx}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ProFormLabel
          TypographyProps={{
            mb: 0,
          }}
          name={name}
          title={label}
          required={required}
          sx={{ m: 0, ...labelSx }}
        />
        <Checkbox
          checked={field.value}
          onChange={handleChange}
          name={name}
          onBlur={field.onBlur}
          ref={field.ref}
          disabled={disabled}
          sx={{
            '&.Mui-disabled': {
              backgroundColor: '#F3F4F6',
            },
          }}
        />
      </Box>
      {error?.message && <FormHelperText variant='standard'>{t(error.message)}</FormHelperText>}
    </FormControl>
  );
};

export default ProFormCheckbox;
