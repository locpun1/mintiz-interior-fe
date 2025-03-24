import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import HorizontalRuleSharpIcon from '@mui/icons-material/HorizontalRuleSharp';
import { Box, FormControl, TextField, TextFieldProps } from '@mui/material';

interface Props {
  fromName: string;
  toName: string;
  fromProps?: NumericFormatProps & TextFieldProps;
  toProps?: NumericFormatProps & TextFieldProps;
}

const ProNumberRange = React.forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
  const { fromName, toName, fromProps, toProps } = props;
  const { control } = useFormContext();
  const { i18n } = useTranslation();

  const getSeparators = () => {
    const formatter = new Intl.NumberFormat(i18n.language);
    const parts = formatter.formatToParts(1234.5);
    let thousandSeparator = ',';
    let decimalSeparator = '.';

    for (const part of parts) {
      if (part.type === 'group') {
        thousandSeparator = part.value;
      }
      if (part.type === 'decimal') {
        decimalSeparator = part.value;
      }
    }

    // Ensure separators are different
    if (thousandSeparator === decimalSeparator) {
      thousandSeparator = thousandSeparator === '.' ? ',' : '.';
    }

    return { thousandSeparator, decimalSeparator };
  };

  const { thousandSeparator, decimalSeparator } = getSeparators();

  return (
    <FormControl fullWidth>
      <Box sx={{ display: 'flex', alignItems: 'center' }} ref={ref}>
        <Controller
          control={control}
          name={fromName}
          render={({ field: { onChange, value, ref, ...rest } }) => (
            <NumericFormat
              placeholder='From'
              id='text-field-from'
              thousandSeparator={thousandSeparator}
              decimalSeparator={decimalSeparator}
              customInput={TextField as React.ComponentType}
              getInputRef={ref}
              {...fromProps}
              onValueChange={(values) => {
                onChange(values.floatValue ?? null);
              }}
              value={value ?? ''}
              {...rest}
            />
          )}
        />
        <HorizontalRuleSharpIcon sx={{ fontSize: '12px', margin: '0 10px' }} />
        <Controller
          control={control}
          name={toName}
          render={({ field: { onChange, value, ref, ...rest } }) => (
            <NumericFormat
              placeholder='To'
              id='text-field-to'
              customInput={TextField as React.ComponentType}
              thousandSeparator={thousandSeparator}
              decimalSeparator={decimalSeparator}
              getInputRef={ref}
              {...toProps}
              onValueChange={(values) => {
                onChange(values.floatValue ?? null);
              }}
              value={value ?? ''}
              {...rest}
            />
          )}
        />
      </Box>
    </FormControl>
  );
});

export default ProNumberRange;
