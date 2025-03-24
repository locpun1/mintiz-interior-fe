import type { Direction, Theme } from '@mui/material';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import base from './palette/base';
import dark from './palette/dark';
import light from './palette/light';
import typography from './typography';
import { viVN } from '@mui/material/locale';

interface Neutral {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Neutral;
  }

  interface PaletteOptions {
    neutral: Neutral;
  }

  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}

interface ThemeConfig {
  direction?: Direction;
  mode: 'light' | 'dark';
}

const createGlobalTheme = (config: ThemeConfig): Theme => {
  const { mode, direction } = config;
  const palette = mode === 'dark' ? dark : light;

  const theme = createTheme(base, palette, typography, { direction }, viVN);

  return responsiveFontSizes(theme);
};

export default createGlobalTheme;
