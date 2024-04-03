export interface IWallet {
  id: string;
  address: string;
  createdAt: string;
  isDisabled: boolean;
  isExternallyImported: boolean;
  name: string;
  _id: string;
  chain?: string;
}
