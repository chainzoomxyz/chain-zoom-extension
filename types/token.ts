export interface TokenInfoTwitter {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  network: string;
  chainId: number;
  socials: Socials;
}

export interface Socials {
  twitter: string;
  telegram: string;
  website: string;
}
