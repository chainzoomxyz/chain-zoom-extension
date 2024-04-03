import { type Components, type Theme } from '@mui/material';

const checkboxOverride: Components<Omit<Theme, 'components'>>['MuiCheckbox'] = {
  defaultProps: {},
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      border: `1px solid ${theme.palette.border.dark}`,
      width: 14,
      height: 14,
      borderRadius: 2,
      padding:0,
      transition: 'all 250ms ease',
      '&:hover': {
        backgroundColor: 'transparent',
      },

      '& .MuiSvgIcon-root': {
        fill: 'transparent',
      },

      '&.Mui-focusVisible': {
        border: `1px solid ${theme.palette.border.dark} !important`,
      },
    }),
    colorPrimary: ({ theme }) => ({
      backgroundColor: 'transparent',

      '&.Mui-checked': {
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"), ${theme.functions.linearGradient(
            '#77FED6',
            '#2593A6'
        )}`,
        borderColor: theme.palette.border.dark,
      },

      '&:hover': {
        backgroundColor: 'transparent',
      },
    }),

    colorSecondary: ({ theme }) => ({
      backgroundColor: 'transparent',

      '&.Mui-checked': {
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"), ${theme.functions.linearGradient(
          theme.palette.primary.main,
          theme.palette.primary.dark,
        )}`,
        borderColor: theme.palette.primary.main,
      },

      '&:hover': {
        backgroundColor: 'transparent',
      },
    }),
  },
};

export default checkboxOverride;
