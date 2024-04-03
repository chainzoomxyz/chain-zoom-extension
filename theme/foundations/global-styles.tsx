import { GlobalStyles as MUIGlobalStyles } from '@mui/material';

export function GlobalStyles() {
  return (
    <MUIGlobalStyles
      styles={{
        '*, *::before, *::after': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          margin: 0,
          padding: 0,
        },
        'a, a:link, a:visited': {
          textDecoration: 'none',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          display: 'block',
          maxWidth: '100%',
        },
        ul: {
          margin: 0,
          padding: 0,
        },
        'input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus,input:-webkit-autofill:active':
          {
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': '#ffffff',
            // transition: ' background-color 5000s ease-in-out 0s',
            // boxShadow: 'inset 0 0 20px 20px #23232329',
          },
        '*::-webkit-scrollbar': {
          width: 5,
        },
        '*::-webkit-scrollbar-track': {
          background: '#364257',
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#6D7182',
          borderRadius: '2px',
        },
      }}
    />
  );
}
