import { type Components, type Theme } from '@mui/material/styles';

const popoverOverride: Components<Omit<Theme, 'components'>>['MuiPopover'] = {
  styleOverrides: {
    paper: ({ theme }) => ({
      backgroundColor: theme.palette.common.transparent,
      minWidth: 140,
    }),
  },
};

export default popoverOverride;
