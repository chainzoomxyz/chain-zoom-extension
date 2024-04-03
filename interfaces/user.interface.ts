import type { IWallet } from '@/interfaces/wallet.interface';

export interface IUser {
  _id: string;
  walletAddress: string;
  __v: number;
  createdAt: string;
  dexSwaps: [];
  evmWallets: IWallet[];
  nonEvmWallets: [];
  id: string;
}
