import type {} from '@mui/lab/themeAugmentation';
import type { ThemeOptions } from '@mui/material';
import type {} from '@mui/x-date-pickers/themeAugmentation';

const base: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 1750,
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
        variant: 'outlined',
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: 14,
            fontWeight: 400,
            minHeight: '1.4375em',
            height: 'auto',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        noOptions: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontWeight: 400,
        },
        subtitle2: {
          lineHeight: 1.5,
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
      },
    },
    MuiInputLabel: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiAvatar: {
      defaultProps: {
        variant: 'rounded',
      },
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
        size: 'small',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiLoadingButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
        size: 'small',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          '&.Mui-disabled.MuiPickersDay-root:not(.Mui-selected)': {
            backgroundColor: '#efefef4d',
            color: '#1010104d',
            borderColor: '#7676764d',
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: 'small',
        color: 'primary',
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: 0,
        },
      },
    },
    MuiChip: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          overflow: 'hidden',
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        input: {
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // backgroundImage: 'none',
        },
      },
    },
    MuiPopover: {
      defaultProps: {
        elevation: 16,
      },
    },
    MuiRadio: {
      defaultProps: {
        size: 'small',
        color: 'primary',
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: 'small',
        color: 'primary',
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiIcon: {
      defaultProps: {
        fontSize: 'small',
      },
    },
    MuiSvgIcon: {
      defaultProps: {
        fontSize: 'small',
      },
    },
    MuiAlert: {
      defaultProps: {
        variant: 'filled',
      },
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      },
    },
    MuiStack: {
      defaultProps: {
        direction: 'row',
        spacing: 1,
      },
    },
    MuiMenu: {
      defaultProps: {
        PaperProps: {
          sx: { mt: 1 },
          elevation: 0,
          variant: 'outlined',
        },
      },
    },
  },
  direction: 'ltr',
  shape: {
    borderRadius: 5,
  },
};

export default base;
