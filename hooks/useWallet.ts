import { serverRequest } from '@/utils/axios';
import { API_BASE_URL } from '@/utils/constants';
import { QUERY_KEY } from '@/utils/query-key';
import { useQuery } from '@tanstack/react-query';

export const useEvmWallets = () => {
  return useQuery(
    [QUERY_KEY.EVM_WALLETS],
    (): Promise<any> => {
      return serverRequest.get(`${API_BASE_URL}/user/evm-wallet/all`);
    },
    {
      refetchInterval: 60 * 1000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: false,
    },
  );
};

export const useWalletBalances = (params: { walletAddress: string; chain: string }) => {
  return useQuery([QUERY_KEY.WALLET_BALANCES, params], (): Promise<any> => {
    return serverRequest.get(`${API_BASE_URL}/user/wallet-balance`, {
      params: {
        ...params,
      },
    });
  });
};

export const useWalletTransactions = (params: {
  walletAddress: string;
  chain: string;
  page: number;
  limit: number;
}) => {
  return useQuery(
    [QUERY_KEY.WALLET_TRANSACTIONS, params],
    (): Promise<any> => {
      return serverRequest.get(`${API_BASE_URL}/dex-swap/transactions`, {
        params: {
          ...params,
        },
      });
    },
    {
      keepPreviousData: true,
      staleTime: Infinity,
    },
  );
};

export const useTradeVolumeByWallet = (params: { walletAddress: string; chain: string }) => {
  return useQuery(
    [QUERY_KEY.WALLET_VOLUME, params],
    (): Promise<any> => {
      return serverRequest.get(`${API_BASE_URL}/dex-swap/trade-volume`, {
        params: {
          ...params,
        },
      });
    },
    {
      refetchInterval: 60 * 1000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: false,
    },
  );
};
