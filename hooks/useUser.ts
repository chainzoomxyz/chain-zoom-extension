import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { serverRequest } from '@/utils/axios';
import { QUERY_KEY } from '@/utils/query-key';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import type { IUser } from '@/interfaces';
import { getRefreshToken } from '@/utils/token';

export const useProfile = () => {
  return useQuery(
    [QUERY_KEY.USER_DETAIL],
    (): Promise<IUser> => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        return serverRequest.get('/user/detail');
      }
      return Promise.resolve(null);
    },
    {
      staleTime: Infinity,
    },
  );
};

interface LoginParams {
  walletAddress: string;
  message: string;
  signedMessage: string;
}

export const login = async (params: LoginParams) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      ...params,
      nonce: 'chim',
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  try {
    const response = await serverRequest.post(`${API_BASE_URL}/auth/logout`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const useImportWalletMutation = (
  options?: Omit<
    UseMutationOptions<
      AxiosResponse<void>,
      AxiosError,
      { walletAddress: string; walletPrivateKey: string }
    >,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      return serverRequest.post('/user/evm-wallet/import', payload);
    },
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.USER_DETAIL]);
      },
    },
  );
};
export const useUpdateRefCodeMutation = (
  options?: Omit<
    UseMutationOptions<AxiosResponse<void>, AxiosError, { refCode: string }>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      return serverRequest.post('/user/referral-code', payload);
    },
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.USER_DETAIL]);
      },
    },
  );
};

export const useUpdateRefByMutation = (
  options?: Omit<
    UseMutationOptions<AxiosResponse<void>, AxiosError, { refCode: string }>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      return serverRequest.post('/user/referral-by', payload);
    },
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.USER_DETAIL]);
      },
    },
  );
};

export const useUploadFileMutation = () => {
  return useMutation((file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return serverRequest.post('/user/profile-picture', formData);
  });
};

export const useUpdateUserDetailMutation = (
  options?: Omit<
    UseMutationOptions<AxiosResponse<void>, AxiosError, { userName: string }>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      return serverRequest.post('/user/user-name', payload);
    },
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.ACTIVITY_POINT]);
      },
    },
  );
};
export const useWithdrawMutation = (
  options?: Omit<
    UseMutationOptions<
      AxiosResponse<void>,
      AxiosError,
      {
        walletAddress: any;
        selectedWallet: string;
        recipientAddress: any;
        chainId: string;
        tokenAddress: string;
        withdrawAmount: string;
      }
    >,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      return serverRequest.post('/user/evm-wallet/withdraw', payload);
    },
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.WALLET_BALANCES]);
        queryClient.invalidateQueries([QUERY_KEY.WALLET_TRANSACTIONS]);
      },
    },
  );
};
