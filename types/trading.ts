import React, { type SetStateAction } from 'react';
import { type IWallet } from '@/interfaces';

export type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export type TradingFormProps = {
  wallets: IWallet[];
  handleClose: () => void;
  setIsOpenSuccess: React.Dispatch<SetStateAction<boolean>>;
  setHash: React.Dispatch<SetStateAction<string>>;
};
