import { images } from '@/utils/images';

export const MOCK_DATA = false;

export const CHART_WIDTH = 866;
export const CHART_HEIGHT = 342;
export const TABLE_HEIGHT = 250;
export const MAX_LENGTH_SHOW_FULL_NAME = 17;

export const API_BASE_URL = process.env.PLASMO_PUBLIC_BASE_URL;
export const DEXSCREENNER_BASE_URL = 'https://api.dexscreener.com';

export const API_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRBZGRyZXNzIjoiMHhmMzlGZDZlNTFhYWQ4OEY2RjRjZTZhQjg4MjcyNzljZmZGYjkyMjY2Iiwic3ViIjp7IndhbGxldEFkZHJlc3MiOiIweGYzOUZkNmU1MWFhZDg4RjZGNGNlNmFCODgyNzI3OWNmZkZiOTIyNjYifSwiaWF0IjoxNzA1NTYwNDM3LCJleHAiOjE3MDgxNTI0Mzd9.jnYn0VCcp6Oc_f6jCVcCeFWA6BWHcg3oIsZFWSEGrI8';

export const MENU_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: images.logoDark,
    iconActive: images.logoLight,
  },
  {
    id: 'fresh-wallet',
    label: 'Fresh Wallet',
    icon: images.iconFreshWalletDark,
    iconActive: images.iconFreshWalletLight,
  },
  {
    id: 'top-holder',
    label: 'Top Holders',
    icon: images.iconTopHolderDark,
    iconActive: images.iconTopHolderLight,
  },
  // {
  //   id: 'top-calls',
  //   label: 'Top Calls',
  //   icon: images.iconTopPnlDark,
  //   iconActive: images.iconTopPnlLight,
  // },
];

export enum STORAGE_KEY {
  TOKEN_ADDRESS = 'TOKEN_ADDRESS',
  SHOW_MAIN_POPUP = 'SHOW_MAIN_POPUP',
  TWITTER = 'TWITTER', // for twitter post
  OPEN_POPUP_NETWORK = 'OPEN_POPUP_NETWORK',
  OPEN_POPUP_ADDRESS = 'OPEN_POPUP_ADDRESS',
  OPEN_POPUP_TOKEN_INFO = 'OPEN_POPUP_TOKEN_INFO',
}

export const DEFAULT_GAS = [
  { id: 1, value: 1, label: 'Default' },
  { id: 2, value: 2, label: '2x' },
  { id: 3, value: 5, label: '5x' },
];

export const WATERMARK_BASE64 =
  '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';

export const FEATURE_FLAG = {
  ENABLED_PORTFOLIO: true,
};
