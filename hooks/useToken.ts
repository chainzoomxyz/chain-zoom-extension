import { API_BASE_URL } from '@/utils/constants';
import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEY } from '@/utils/query-key';
import { request, serverRequest } from '@/utils/axios';
import { EXCHANGES, NETWORKS, NON_EVM_WALLET_NETWORK } from '@/utils/wallet';
import { AxiosError, type AxiosResponse } from 'axios';
import { isEmpty } from 'lodash';

export const useTokenInfo = (params: { tokenAddress: string; chainId: number }) => {
  return useQuery(
    [QUERY_KEY.TOKEN_INFO, params],
    (): Promise<any> => {
      return request.get(`${API_BASE_URL}/token/token-overview`, {
        params: {
          tokenAddress: params.tokenAddress,
          chainId: params.chainId,
        },
      });
    },
    {
      refetchInterval: 60 * 1000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: false,
      enabled: !isEmpty(params.tokenAddress),
    },
  );
};

export const useSearchToken = (params: { q: string }) => {
  return useQuery([QUERY_KEY.SEARCH_TOKEN, params], (): Promise<any> => {
    if (!params.q) {
      return Promise.resolve([]);
    }
    return request.get(`${API_BASE_URL}/dexscreener/search`, {
      params: {
        ...params,
        chainID: NETWORKS[0].NETWORK,
      },
    });
  });
};

export const useSearchTokenMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: { q: string }) => {
      return request.get(`${API_BASE_URL}/dexscreener/search`, {
        params: {
          ...params,
          chainID: NETWORKS[0].NETWORK,
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.SEARCH_TOKEN]);
      },
    },
  );
};
export const useMainnetTokenPrice = (params: { tokenAddress: string; networkId: number }) => {
  return useQuery([QUERY_KEY.MAIN_NET_TOKEN_PRICE, params], (): Promise<any> => {
    return request.post('/defined/token-prices/{token}', {
      tokenAddresses: [{ ...params }],
    });
  });
};

export const useSwapRoute = (params: {
  tokenOutAddress: string;
  tokenOutDecimals: string;
  amountIn: string;
  tokenInAddress: string;
  tokenInDecimals: string;
  chainId: string;
  network: string;
  type: string;
}) => {
  return useQuery([QUERY_KEY.SWAP_ROUTE, params], (): Promise<any> => {
    if (params.amountIn === '0') {
      return Promise.resolve(null);
    }
    if (params.type === NON_EVM_WALLET_NETWORK.SOLANA) {
      return serverRequest.post('/dex-swap/solana-swap-route', {
        tokenInAddress: params.tokenInAddress,
        tokenInDecimals: params.tokenInDecimals,
        tokenOutAddress: params.tokenOutAddress,
        tokenOutDecimals: params.tokenOutDecimals,
        amountIn: params.amountIn,
        slippage: '0.5',
      });
    } else {
      return serverRequest.post('/dex-swap/swap-route', {
        tokenInAddress: params.tokenInAddress,
        tokenInDecimals: params.tokenInDecimals,
        tokenOutAddress: params.tokenOutAddress,
        tokenOutDecimals: params.tokenOutDecimals,
        amountIn: params.amountIn,
        chainId: params.chainId,
        network: params.network,
      });
    }
  });
};

export const useSendSwapTransaction = (
  options?: Omit<
    UseMutationOptions<
      AxiosResponse<void>,
      AxiosError,
      {
        tokenInAddress: string;
        tokenInDecimals: string;
        tokenOutAddress: string;
        tokenOutDecimals: string;
        amountIn: string;
        userWalletAddress: string;
        selectedWalletAddress: string;
        swapSettingsDto: {
          slippage: string;
          deadline: string;
          priorityGasMultiplier?: string;
          manualGasPrice?: string;
        };
        isSimulationEnabled: boolean;
        isMevEnabled: boolean;
        chainId: string;
        network: string;
        providerNetwork: string;
        type: string;
      }
    >,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      if (payload.type === NON_EVM_WALLET_NETWORK.SOLANA) {
        return serverRequest.post('/dex-swap/send-solana-swap-transaction', {
          selectedExchange: EXCHANGES.JUPITER,
          userWalletAddress: payload.userWalletAddress,
          selectedWalletAddress: payload.selectedWalletAddress,
          swapSettingsDto: {
            slippage: payload.swapSettingsDto.slippage,
          },
          tokenInAddress: payload.tokenInAddress,
          tokenInDecimals: payload.tokenInDecimals,
          tokenOutAddress: payload.tokenOutAddress,
          tokenOutDecimals: payload.tokenOutDecimals,
          amountIn: payload.amountIn,
          isSimulationEnabled: payload.isSimulationEnabled,
        });
      } else {
        return serverRequest.post('/dex-swap/send-swap-transaction', {
          tokenInAddress: payload.tokenInAddress,
          tokenInDecimals: payload.tokenInDecimals,
          tokenOutAddress: payload.tokenOutAddress,
          tokenOutDecimals: payload.tokenOutDecimals,
          amountIn: payload.amountIn,
          userWalletAddress: payload.userWalletAddress,
          selectedWalletAddress: payload.selectedWalletAddress,
          swapSettingsDto: {
            ...payload.swapSettingsDto,
          },
          isSimulationEnabled: payload.isSimulationEnabled,
          isMevEnabled: payload.isMevEnabled,
          chainId: payload.chainId,
          network: payload.network,
          providerNetwork: payload.providerNetwork,
          selectedExchange: EXCHANGES.KYBER,
        });
      }
    },
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.USER_DETAIL]);
        queryClient.invalidateQueries([QUERY_KEY.WALLET_BALANCES]);
        queryClient.invalidateQueries([QUERY_KEY.ACTIVITY_POINT]);
      },
    },
  );
};

export const useVote = (params: { tokenAddress: string }) => {
  return useQuery(
    [QUERY_KEY.VOTE, params],
    (): Promise<any> => {
      return request.get(`/vote`, {
        params: {
          ...params,
        },
      });
    },
    { staleTime: Infinity },
  );
};

export const useAddVoteMutation = (
  options?: Omit<
    UseMutationOptions<
      AxiosResponse<void>,
      AxiosError,
      {
        tokenAddress: string;
      }
    >,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      return serverRequest.post('/vote/add-vote', {
        ...payload,
      });
    },
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.VOTE]);
      },
    },
  );
};

export const useRemoveVoteMutation = (
  options?: Omit<
    UseMutationOptions<
      AxiosResponse<void>,
      AxiosError,
      {
        tokenAddress: string;
      }
    >,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      return serverRequest.post('/vote/remove-vote', {
        ...payload,
      });
    },
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.VOTE]);
      },
    },
  );
};

export const useTokenSecurity = (params: { token: string; chain_name: string }) => {
  if (!params.token || params.chain_name === 'sui') {
    return { data: null };
  }
  return useQuery(
    [QUERY_KEY.SECURITY, params],
    (): Promise<any> => {
      return request.get(`/dextool/security`, {
        params: {
          ...params,
        },
      });
    },
    { staleTime: Infinity },
  );
};
