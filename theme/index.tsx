import { createTheme, type Theme } from '@mui/material/styles';
import {
  functions,
  type FunctionsType,
  GlobalStyles,
  palette,
  typography,
} from '@/theme/foundations';
import components from './components';
import { type PropsWithChildren } from 'react';
import { ThemeProvider } from '@emotion/react';
import { type PaletteColorOptions } from '@mui/material';

export const CustomThemeProvider = ({ children }: PropsWithChildren) => {
  const theme: Theme = createTheme({
    palette,
    shape: { borderRadius: 8 },
    functions,
    typography,
    // breakpoints: {},
    components,
  });

  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter: string;
    darker: string;
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }

  interface Palette {
    secondary: PaletteColor;
    border: PaletteColor;
    boxShadow: PaletteColor;
  }

  interface PaletteOptions {
    border: PaletteColorOptions;
    boxShadow: PaletteColorOptions;
  }

  interface Theme {
    functions: FunctionsType;
  }

  interface ThemeOptions {
    functions: FunctionsType;
  }

  interface CommonColors {
    transparent: string;
  }

  interface TypeBackground {
    neutral?: string;
    component?: string;
    blur?: string;
    gradient?: string;
    light?: string;
    dark?: string;
    popoverGradient?: string;
    walletGradient?: string;
    walletGradientActive?: string;
    darker?: string;
    smallDialog?: string;
    lighter?: string;
  }

  interface TypeText {
    light: string;
    dark: string;
  }
}

declare module '@mui/material' {
  interface ButtonPropsVariantOverrides {
    soft: true;
    gradient: true;
  }

  interface ChipPropsVariantOverrides {
    soft: true;
    gradient: true;
  }

  interface ButtonPropsColorOverrides {
    white: true;
    dark: true;
    darker: true;
  }
}
