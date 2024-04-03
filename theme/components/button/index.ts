import { type Components, type Theme } from '@mui/material';
import { pxToRem } from '@/theme/foundations';

const buttonOverride: Components<Omit<Theme, 'components'>>['MuiButton'] = {
  variants: [
    {
      props: { variant: 'gradient', color: 'primary' },
      style: ({ theme }) => ({
        color: theme.palette.common.white,
        background: 'linear-gradient(93deg, #78FFCE 5.87%, #0BC0E8 95.88%)',
        borderRadius: pxToRem(12),
      }),
    },
    {
      props: { variant: 'gradient', color: 'secondary' },
      style: ({ theme }) => ({
        color: theme.palette.common.white,
        background: 'linear-gradient(180deg, #77FED6 0%, #2593A6 100%)',
        borderRadius: pxToRem(13),
      }),
    },
    {
      props: { variant: 'gradient', color: 'info' },
      style: ({ theme }) => ({
        color: theme.palette.text.disabled,
        background: 'linear-gradient(180deg, #77FED6 0%, #2593A6 100%)',
      }),
    },
    {
      props: { variant: 'gradient', color: 'warning' },
      style: ({ theme }) => ({
        color: theme.palette.common.white,
        boxShadow: '0px 12.584px 11.798px -14.157px rgba(69, 221, 149, 0.40)',
        // border:`1.5px solid ${theme.palette.common.white}`,
        borderRadius: pxToRem(10),
        background:
          'linear-gradient(102deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.20) 21.5%, rgba(255, 255, 255, 0.28) 21.51%, rgba(255, 255, 255, 0.00) 45.14%), radial-gradient(145.35% 141.42% at 0% 0%, rgba(255, 71, 13, 0.88) 0%, rgba(255, 245, 0, 0.88) 100%)',
      }),
    },

    {
      props: { color: 'primary', variant: 'contained' },
      style: ({ theme }) => ({
        color: theme.palette.common.white,
        background: theme.palette.primary.main,
      }),
    },
    {
      props: { color: 'secondary', variant: 'contained' },
      style: ({ theme }) => ({
        color: theme.palette.common.white,
        background: theme.palette.background.dark,
        '&:hover': {
          background: theme.palette.background.dark,
          opacity: 0.8,
        },
      }),
    },
    {
      props: { color: 'white', variant: 'soft' },
      style: ({ theme }) => ({
        color: theme.palette.primary.main,
        background: theme.palette.common.white,
        '&:hover': {
          background: theme.functions.rgba(theme.palette.common.white, 0.7),
        },
      }),
    },
    {
      props: { color: 'info', variant: 'soft' },
      style: ({ theme }) => ({
        color: theme.palette.common.white,
        background: theme.palette.primary.dark,
        '&:hover': {
          background: 'linear-gradient(180deg, #78FFCE 5.87%, #0BC0E8 95.88%)',
        },
      }),
    },
    {
      props: { color: 'success', variant: 'soft' },
      style: ({ theme }) => ({
        color: theme.palette.common.white,
        background: theme.palette.primary.light,
        '&:hover': {
          background: 'linear-gradient(180deg, #78FFCE 5.87%, #0BC0E8 95.88%)',
        },
      }),
    },
    {
      props: { color: 'dark', variant: 'soft' },
      style: ({ theme }) => ({
        color: theme.palette.common.white,
        background: theme.palette.background.darker,
      }),
    },
  ],
  defaultProps: {
    color: 'inherit',
    variant: 'contained',
  },
  styleOverrides: {
    root: {
      transition: 'all 250ms ease',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    sizeLarge: ({ theme }) => ({
      height: 42,
      padding: 0,
    }),
    sizeMedium: ({ theme }) => ({
      height: 38,
      padding: 0,
    }),
    sizeSmall: ({ theme }) => ({
      height: 34,
      padding: 0,
    }),
  },
};
export default buttonOverride;
