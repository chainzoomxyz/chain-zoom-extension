export enum TimeRange {
  '3D' = '3D',
  '7D' = '7D',
  '14D' = '14D',
  '30D' = '30D',
}

export const timeRangeToParams = {
  [TimeRange['3D']]: {
    timeframe: 3,
    interval: 'hour',
  },
  [TimeRange['7D']]: {
    timeframe: 7,
    interval: 'hour',
  },
  [TimeRange['14D']]: {
    timeframe: 14,
    interval: 'hour',
  },
  [TimeRange['30D']]: {
    timeframe: 30,
    interval: 'day',
  },
};

export interface OhlcPrice {
  date_open: string;
  date_close: string;
  price_open: number;
  price_high: number;
  price_low: number;
  price_close: number;
  volume: number;
  num_trades: number;
}

export interface FreshWallet {
  timestamp: string;
  amount: number;
}

export interface TopHolder {
  timestamp: string;
  netflow: number;
}

export interface ChartData {
  time: number | string;
  value: number;
}

export interface FreshWalletTable {
  address: string;
  balance: number;
  created_timestamp: string;
  value_usd: number;
  entry: number;
  token: string;
}

export interface TopHolderTable {
  rank: number;
  address: string;
  balance: number;
  type: string;
  name: string;
  symbol: string;
  label: string;
  value_usd: number;
  entry?: number;
  token: string;
}


export interface TopCallsTable {
  callers: string;
  time: number;
  price: number;
  mCap: number;
  roi: number;
}