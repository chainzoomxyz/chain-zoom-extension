export type PortfolioBalance = {
  id: string;
  name: string;
  balance: string;
  value: string;
  price: string;
  tokenAddress: string;
  selectedWallet: string;
  decimals:number
};

export type PortfolioTransaction = {
  tnxHash: string;
  action: string;
  createdAt: string;
  value: string;
  tokenAddress: string;
  priceUsd: string;
};
