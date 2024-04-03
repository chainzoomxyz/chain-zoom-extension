import { images } from '@/utils/images';
import type { IWallet } from '@/interfaces';
import _ from 'lodash';

export const SIGN_CHAINZOOM_RAW_MESSAGE = `Sign in Chainzoom extension epoch: ${Math.floor(
  Date.now() / 1000,
)}`;

export const WALLET_TYPES = Object.freeze({
  EVM_WALLET: 'evmWallets',
  NON_EVM_WALLET: 'nonEvmWallets',
});

export const NON_EVM_WALLET_NETWORK = Object.freeze({
  SUI: 'SUI',
  SOLANA: 'SOL',
});

export const WALLET_ACTIONS = Object.freeze({
  SELL: 'sell',
  BUY: 'buy',
});

export const EthereumEvents = Object.freeze({
  GET_ACCOUNTS: 'eth_accounts',
  GET_BALANCE: 'eth_getBalance',
  GET_CHAIN_ID: 'eth_chainId',
  REQUEST_ACCOUNTS: 'eth_requestAccounts',
  REVOKE_PERMISSIONS: 'wallet_revokePermissions',
  CHAIN_CHANGED: 'chainChanged',
  ACCOUNTS_CHANGED: 'accountsChanged',
  SWITCH_CHAIN: 'wallet_switchEthereumChain',
  PERSONAL_SIGN: 'personal_sign',
  SEND_TRANSACTION: 'eth_sendTransaction',
  ADD_CHAIN: 'wallet_addEthereumChain',
  GAS_PRICE: 'eth_gasPrice',
  ESTIMATE_GAS: 'eth_estimateGas',
});

export const EXCHANGES = Object.freeze({
  KYBER: 'kyber',
  JUPITER: 'jupiter',
});

export const NETWORKS = [
  {
    CHAIN_ID: '0x1',
    NAME: 'Ethereum',
    CHAIN_NAME: 'Ethereum Mainnet',
    NETWORK: 'ethereum',
    NETWORK_ID: 1,
    TOKEN_ADDRESS: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    TOKEN_CONTRACT_ADDRESS: '',
    DECIMALS: 18,
    NATIVE_CURRENCY: 'ETH',
    NATIVE_TOKEN_ADDRESS: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    PROVIDER_NETWORK: 'eth-mainnet',
    RPC_URL: 'https://rpc.ankr.com/eth',
    BLOCK_EXPLORER_URL: 'https://etherscan.io/',
    CHAIN_IMAGE_URL: images.iconEthereum,
    TYPE: WALLET_TYPES.EVM_WALLET,
    TABLE_PARAM: 'eth',
  },
  {
    CHAIN_ID: '0x89',
    NAME: 'Polygon',
    CHAIN_NAME: 'Polygon Mainnet',
    NETWORK: 'polygon',
    NETWORK_ID: 137,
    TOKEN_ADDRESS: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    TOKEN_CONTRACT_ADDRESS: '',
    DECIMALS: 18,
    NATIVE_CURRENCY: 'MATIC',
    NATIVE_TOKEN_ADDRESS: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    PROVIDER_NETWORK: 'polygon-mainnet',
    RPC_URL: 'https://rpc.ankr.com/polygon',
    BLOCK_EXPLORER_URL: 'https://polygonscan.com/',
    CHAIN_IMAGE_URL: images.iconPolygonChain,
    TYPE: WALLET_TYPES.EVM_WALLET,
    TABLE_PARAM: 'polygon',
  },
  {
    CHAIN_ID: '0x7E8',
    NAME: 'Sui',
    CHAIN_NAME: 'Sui Mainnet',
    NETWORK: 'sui',
    NETWORK_ID: 2024,
    TOKEN_ADDRESS: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    TOKEN_CONTRACT_ADDRESS: '',
    DECIMALS: 18,
    NATIVE_CURRENCY: 'SUI',
    NATIVE_TOKEN_ADDRESS: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    PROVIDER_NETWORK: 'sui-mainnet',
    RPC_URL: 'https://fullnode.mainnet.sui.io:443',
    BLOCK_EXPLORER_URL: 'https://suiscan.xyz/mainnet/',
    CHAIN_IMAGE_URL: images.suiLogo,
    TYPE: NON_EVM_WALLET_NETWORK.SUI,
    TABLE_PARAM: 'sui',
  },
  {
    CHAIN_ID: '0x2105',
    NAME: 'Base',
    CHAIN_NAME: 'Base Mainnet',
    NETWORK: 'base',
    NETWORK_ID: 8453,
    TOKEN_ADDRESS: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    TOKEN_CONTRACT_ADDRESS: '',
    DECIMALS: 18,
    NATIVE_CURRENCY: 'ETH',
    NATIVE_TOKEN_ADDRESS: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    PROVIDER_NETWORK: 'base-mainnet',
    RPC_URL: 'https://mainnet.base.org',
    BLOCK_EXPLORER_URL: 'https://basescan.org/',
    CHAIN_IMAGE_URL: images.baseLogo,
    TYPE: WALLET_TYPES.EVM_WALLET,
    TABLE_PARAM: 'base',
  },
  {
    CHAIN_ID: '0x7EA',
    NAME: 'Solana',
    CHAIN_NAME: 'Solana Mainnet',
    NETWORK: 'solana',
    NETWORK_ID: 2026,
    TOKEN_ADDRESS: '',
    TOKEN_CONTRACT_ADDRESS: '',
    DECIMALS: 9,
    NATIVE_CURRENCY: 'SOL',
    NATIVE_TOKEN_ADDRESS: 'So11111111111111111111111111111111111111112',
    PROVIDER_NETWORK: 'solana-mainnet',
    RPC_URL: 'https://solana-mainnet.g.alchemy.com/v2/bkNf5RJfn6MHdDcdlY8qm60rS_qmtLJZ',
    BLOCK_EXPLORER_URL: 'https://explorer.solana.com/',
    CHAIN_IMAGE_URL: images.solanaLogo,
    TYPE: NON_EVM_WALLET_NETWORK.SOLANA,
    TABLE_PARAM: 'solana',
  },
];

export const getWalletsByNetwork = (profile: any, type: string) => {
  if (type === NON_EVM_WALLET_NETWORK.SOLANA) {
    const nonEvmWallets = _.get(profile, WALLET_TYPES.NON_EVM_WALLET, []);
    return nonEvmWallets.filter((wallet: IWallet) => {
      return wallet.chain === NON_EVM_WALLET_NETWORK.SOLANA;
    });
  } else if (type === NON_EVM_WALLET_NETWORK.SUI) {
    const nonEvmWallets = _.get(profile, WALLET_TYPES.NON_EVM_WALLET, []);
    return nonEvmWallets.filter((wallet: IWallet) => {
      return wallet.chain === NON_EVM_WALLET_NETWORK.SUI;
    });
  } else {
    return _.get(profile, WALLET_TYPES.EVM_WALLET, []);
  }
};
