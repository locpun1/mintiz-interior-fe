import { forwardRef, HTMLAttributes } from 'react';
import { NumericFormat } from 'react-number-format';

interface Props {
  onChange: (event: { target: { value: string } }) => void;
}

export const NumericInput = forwardRef<HTMLAttributes<HTMLInputElement>, Props>(
  (props, ref) => {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$"
      />
    );
  }
);
