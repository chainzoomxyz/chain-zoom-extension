import { type ThemeOptions } from '@mui/material';
import buttonOverride from './button';
import popoverOverride from './popover';
import checkboxOverride from '@/theme/components/checkbox';
import { color } from 'framer-motion';

const components: ThemeOptions['components'] = {
  MuiAccordion: {},
  MuiAccordionActions: {},
  MuiAccordionDetails: {},
  MuiAccordionSummary: {},
  MuiAlert: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
      },
    },
  },
  MuiAlertTitle: {},
  MuiAppBar: {},
  MuiAutocomplete: {},
  MuiAvatar: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.grey[200],
        width: 34,
        height: 34,
      }),
    },
  },
  MuiAvatarGroup: {},
  MuiBackdrop: {},
  MuiBadge: {},
  MuiBottomNavigation: {},
  MuiBottomNavigationAction: {},
  MuiBreadcrumbs: {},
  MuiButton: buttonOverride,
  MuiButtonBase: {},
  MuiButtonGroup: {},
  MuiCard: {},
  MuiCardActionArea: {},
  MuiCardActions: {},
  MuiCardContent: {},
  MuiCardHeader: {},
  MuiCardMedia: {},
  MuiCheckbox: checkboxOverride,
  MuiChip: {
    variants: [
      {
        props: { variant: 'filled', color: 'success' },
        style: ({ theme }) => ({
          background: theme.palette.primary.light,
          color: theme.palette.common.white,
        }),
      },
      {
        props: { variant: 'filled', color: 'error' },
        style: ({ theme }) => ({
          background: theme.palette.error.main,
          color: theme.palette.common.white,
        }),
      },
    ],
  },
  MuiCircularProgress: {},
  MuiCollapse: {},
  MuiContainer: {},
  MuiCssBaseline: {},
  MuiDialog: {
    defaultProps: {
      fullWidth: true,
      maxWidth: 'md',
    },
  },
  MuiDialogActions: {},
  MuiDialogContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 0,
      }),
    },
  },
  MuiDialogContentText: {},
  MuiDialogTitle: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 0,
        background: theme.palette.background.default,
      }),
    },
  },
  MuiDivider: {
    defaultProps: {},
    styleOverrides: {
      root: {
        height: 4,
        background: 'rgba(89, 106, 130, 0.30)',
      },
    },
  },
  MuiDrawer: {},
  MuiFab: {},
  MuiFilledInput: {},
  MuiFormControl: {
    styleOverrides: {
      root: {
        height: '100%',
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      root: {
        marginRight: 0,
        marginLeft: 0,
        width: '100%',
        height: '100%',
      },
      label: { fontSize: 14 },
    },
  },
  MuiFormGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiFormControlLabel-root': {
          justifyContent: 'space-between',
          padding: '0 8px',
        },
        '& .MuiFormControlLabel-label': {
          fontSize: '12px !important',
          opacity: 0.6,
        },
        '& .Mui-disabled': {
          color: `${theme.palette.common.white} !important`,
          opacity: 0.6,
        },
      }),
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.error.main,
      }),
    },
  },
  MuiFormLabel: {},
  MuiGrid: {},
  MuiGrid2: {},
  MuiIcon: {},
  MuiIconButton: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiImageList: {},
  MuiImageListItem: {},
  MuiImageListItemBar: {},
  MuiInput: {
    // styleOverrides: {
    //   underline: ({ theme }) => ({
    //     '&:before': {
    //       borderBottomColor: theme.functions.rgba(theme.palette.grey[500], 0.56),
    //     },
    //   }),
    // },
  },
  MuiInputAdornment: {},
  MuiInputBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&.Mui-disabled': {
          '& svg': { color: theme.palette.common.white },
        },
        height: '100%',
      }),
      input: ({ theme }) => ({
        '&.Mui-disabled': {
          '-webkit-text-fill-color': `${theme.palette.common.white} !important`,
          opacity: 0.8,
        },
        fontSize: theme.spacing(14 / 8),
        '&::placeholder': {
          opacity: 0.6,
          color: theme.palette.common.white,
        },
      }),
    },
  },
  MuiInputLabel: {},
  MuiLinearProgress: {},
  MuiLink: {},
  MuiList: {
    styleOverrides: {
      root: ({ theme }) => ({
        background: '#52637B',
      }),
    },
  },
  MuiListItem: {},
  MuiListItemAvatar: {},
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.spacing(1),
      }),
    },
  },
  MuiListItemIcon: {},
  MuiListItemSecondaryAction: {},
  MuiListItemText: {},
  MuiListSubheader: {},
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: 6,
      },
    },
  },
  MuiMenuItem: {},
  MuiMenuList: {},
  MuiMobileStepper: {},
  MuiModal: {},
  MuiNativeSelect: {},
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '&.Mui-disabled': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.action.disabledBackground,
          },
        },
      }),
    },
  },
  MuiPagination: {
    styleOverrides: {},
  },
  MuiPaginationItem: {
    styleOverrides: {
      root: {},
      selected: ({ theme }) => ({
        color: theme.palette.common.white,
        backgroundColor: theme.palette.grey[800],
      }),
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        background: 'white',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: theme.spacing(2),
        backgroundImage: 'none',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      }),
    },
  },
  MuiPopover: popoverOverride,
  MuiPopper: {},
  MuiRadio: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: 14,
        height: 14,
        padding: 0,
        color: theme.palette.border.dark,
        '&.Mui-checked': {
          background: 'linear-gradient(159deg, #F4FFD6 -27.41%, #78FFD6 33.6%, #006391 94.62%)',
          borderRadius: '50%',
          color: theme.palette.common.transparent,
        },
      }),
    },
  },
  MuiRating: {},
  MuiScopedCssBaseline: {},
  MuiSelect: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiPaper-root': {},
        '& .MuiMenu-list': {},
      }),
      select: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    },
  },
  MuiSkeleton: {},
  MuiSlider: {},
  MuiSnackbar: {},
  MuiSnackbarContent: {},
  MuiSpeedDial: {},
  MuiSpeedDialAction: {},
  MuiSpeedDialIcon: {},
  MuiStack: {},
  MuiStep: {},
  MuiStepButton: {},
  MuiStepConnector: {},
  MuiStepContent: {},
  MuiStepIcon: {},
  MuiStepLabel: {},
  MuiStepper: {},
  MuiSvgIcon: {
    styleOverrides: {
      root: {
        width: 14,
        height: 14,
      },
    },
  },
  MuiSwipeableDrawer: {},
  MuiSwitch: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: 37,
        height: 19,
        padding: 0,
        marginRight: 8,
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 17,
          height: 17,
          backgroundColor: '#242D3E',
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          backgroundColor: '#3E4E64',
          opacity: 1,
        },
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: 1,
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(18px)',
            color: theme.palette.background.lighter,
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.background.lighter,
              opacity: 0.3,
              border: 0,
            },
            '& .MuiSwitch-thumb': {
              backgroundColor: theme.palette.background.lighter,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: theme.palette.background.lighter,
            border: '6px solid #fff',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color: '#242D3E',
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
          },
        },
      }),
    },
  },
  MuiTab: {
    defaultProps: {
      disableRipple: true,
      iconPosition: 'start',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: 0,
        padding: 0,
        marginRight: theme.spacing(3),
        minHeight: theme.spacing(6),
        [theme.breakpoints.up('md')]: {
          marginRight: theme.spacing(5),
        },
        '&.Mui-selected': {
          color: theme.palette.text.primary,
        },
      }),
    },
  },
  MuiTable: {
    defaultProps: {
      stickyHeader: true,
    },
  },
  MuiTableBody: {},
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(1.5, 2),
      }),
      head: ({ theme }) => ({
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.grey[200],
      }),
    },
  },
  MuiTableContainer: {},
  MuiTableFooter: {},
  MuiTableHead: {},
  MuiTablePagination: {},
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.action.hover,
        borderBottomStyle: 'dashed',
      }),
    },
  },
  MuiTableSortLabel: {},
  MuiTabs: {
    defaultProps: {
      variant: 'scrollable',
      scrollButtons: 'auto',
    },
    styleOverrides: {
      flexContainer: ({ theme }) => ({
        background: 'white',
        minHeight: theme.spacing(6),
      }),
      indicator: ({ theme }) => ({
        backgroundColor: theme.palette.text.primary,
      }),
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiInputBase-root.Mui-focused fieldset': {
          borderColor: theme.palette.text.primary,
        },
        '& .MuiInputBase-input': {
          height: '100%',
        },
        '& label': {
          fontSize: '14px',
          color: theme.palette.text.disabled,
          '&.Mui-focused': {
            color: theme.palette.text.primary,
            fontWeight: 'bold',
            fontSize: '15px',
          },
        },
      }),
    },
    variants: [
      {
        props: { variant: 'filled' },
        style: ({ theme }) => ({
          '& .MuiInputBase-input': {
            color: theme.palette.text.secondary,
            padding: '0 16px',
            margin: 0,
            fontSize: 16,
          },
          '& .MuiInputBase-input::placeholder': {
            color: theme.palette.text.secondary,
          },
        }),
      },
    ],
  },
  MuiToggleButton: {},
  MuiToggleButtonGroup: {},
  MuiToolbar: {},
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        padding: theme.spacing(3 / 8, 6 / 8),
        backgroundColor: theme.palette.grey[800],
      }),
      arrow: ({ theme }) => ({
        color: theme.palette.grey[800],
      }),
    },
  },
  MuiTouchRipple: {},
  MuiTypography: {
    styleOverrides: {
      paragraph: ({ theme }) => ({
        marginBottom: theme.spacing(2),
      }),
      gutterBottom: ({ theme }) => ({
        marginBottom: theme.spacing(1),
      }),
    },
  },
  MuiUseMediaQuery: {},
};

export default components;
