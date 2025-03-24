import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import CheckIcon from '@mui/icons-material/Check';
import { Box, FormControl, IconButton, SxProps } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import ProFormLabel from './ProForm/ProFormLabel';

const colors = [
  '',
  '#f44336',
  '#ff9800',
  '#ffeb3b',
  '#4caf50',
  '#00bcd4',
  '#2196f3',
  '#3f51b5',
  '#9c27b0',
  '#795548',
];

type Props = {
  name: string;
  label?: string;
  formControlSx?: SxProps;
  required?: boolean;
} & TextFieldProps;

const ColorPicker = ({ name, label, formControlSx, required, sx }: Props) => {
  const { control } = useFormContext();

  const {
    field: { value, onChange },
  } = useController({ name, control });

  const [selectedColor, setSelectedColor] = useState(value || '');
  const [customColor, setCustomColor] = useState('');

  useEffect(() => {
    if (value === '') {
      setSelectedColor('');
    } else {
      setSelectedColor(value);
    }
  }, [value]);

  const handleCustomColorChange = (event: any) => {
    const customColor = event.target.value;
    setCustomColor(customColor);
    setSelectedColor(customColor);
    onChange(customColor);
  };

  const handleColorSelect = (color: string) => {
    setCustomColor('');
    setSelectedColor(color);
    onChange(color);
  };

  return (
    <FormControl fullWidth sx={formControlSx}>
      <ProFormLabel name={name} title={label as string} required={required} gutterBottom>
        <Box display='flex' alignItems='center'>
          <Box position='relative'>
            <IconButton style={{ width: 28, height: 28, margin: '0 8px', padding: '0' }}>
              <input
                type='color'
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 1,
                }}
                onChange={handleCustomColorChange}
              />
              <Box
                sx={{
                  backgroundImage: customColor
                    ? 'none'
                    : 'linear-gradient(135deg, #f44336, #ff9800, #ffeb3b, #4caf50, #00bcd4, #2196f3, #9c27b0)',
                  backgroundColor: customColor || 'transparent',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: customColor ? '2px solid #000' : 'none',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 0,
                  ...sx,
                }}
              >
                {!customColor && (
                  <Box
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      width: 12,
                      height: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                    }}
                  >
                    <Box
                      component='span'
                      sx={{
                        color: '#000',
                        fontSize: 14,
                        lineHeight: 1,
                      }}
                    >
                      +
                    </Box>
                  </Box>
                )}
                {customColor && <CheckIcon style={{ color: '#fff', fontSize: 20 }} />}
              </Box>
            </IconButton>
          </Box>

          {colors.slice(1).map((color, index) => (
            <Box key={index} position='relative'>
              <IconButton
                onClick={() => handleColorSelect(color)}
                sx={{
                  borderRadius: '50%',
                  backgroundColor: color,
                  width: 28,
                  height: 28,
                  margin: '0 8px',
                  border: selectedColor === color ? '2px solid #000' : 'none',
                  '&:hover': {
                    backgroundColor: color,
                  },
                  ...sx,
                }}
              >
                {selectedColor === color && <CheckIcon style={{ color: '#fff', fontSize: 20 }} />}
              </IconButton>
            </Box>
          ))}
        </Box>
      </ProFormLabel>
    </FormControl>
  );
};

export default ColorPicker;
