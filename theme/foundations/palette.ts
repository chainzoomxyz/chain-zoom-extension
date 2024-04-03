import { type PaletteOptions } from '@mui/material';

export const palette: PaletteOptions = {
  common: {
    black: '#000000',
    white: '#FFFFFF',
    transparent: 'transparent',
  },
  primary: {
    main: '#242D3E',
    light: '#55D1C2',
    dark: '#596A82',
  },
  text: {
    primary: '#ffffff',
    secondary: '#6D7182',
    light: '#78FFCE',
    disabled: '#2F4053',
    dark: '#7A91B1',
  },
  background: {
    default: '#2C3849',
    component: '#6D7182',
    blur: 'rgba(44, 56, 73, 0.70)',
    gradient: 'linear-gradient(93deg, #78FFCE 5.87%, #0BC0E8 95.88%)',
    light: '#78FFCE',
    dark: '#364157',
    popoverGradient:
      'linear-gradient(to bottom, #f4ffd6, #b9dabe, #87b5a8, #608e91, #456875, #3b5b6d, #324f64, #2c425a, #2a4a67, #255275, #1b5a83, #006391)',
    walletGradient:
      'linear-gradient(180deg, rgba(244,255,214,0.5) 0%, rgba(120,255,214,0.5) 50%, rgba(0,99,145,0.5) 100%)',
    walletGradientActive:
      'linear-gradient(180deg, rgba(244,255,214,1) 0%, rgba(120,255,214,1) 50%, rgba(0,99,145,1) 100%)',
    darker: '#364257',
    smallDialog: '#405066',
    lighter:'#39FFE7'
  },
  error: {
    main: '#F23645',
  },
  boxShadow: {
    main: '#212C3D',
  },
  border: {
    main: '#F4FFD6',
    light: 'linear-gradient(0deg, #F4FFD6 100%, #2C3849 0%,#006391 100%)',
    dark: '#647387',
    darker: '#7A91B1',
  },
};
