/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#242D3E',
        'component-base': '#2C3849',
        'xe-can': '#55D1C2',
        'button-gradient-f': '#77FED6',
        'button-gradient-t': '#2593A6',
        'red-salsa': '#F23645',
        'blur-box': 'rgba(44, 56, 73, 0.70)',
        'auro-metal-saurus': '#647387',
        'label-input': 'rgba(255, 255, 255, 0.60)',
        'line-bar-chart': '#39FFE7',
        'police-blue': '#3E4E64',
      },
      boxShadow: {
        base: '2px 4px 6px 0px #212C3D',
      },
      backdropBlur: {
        base: '3.5px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
  prefix: '',
};
