import { serverRequest } from '@/utils/axios';
import { API_BASE_URL } from '@/utils/constants';
import { QUERY_KEY } from '@/utils/query-key';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';

export const useUserPoint = () => {
  return useQuery(
    [QUERY_KEY.USER_POINT],
    (): Promise<any> => {
      return serverRequest.get(`${API_BASE_URL}/user/total-point`);
    },
    {
      keepPreviousData: true,
      staleTime: Infinity,
    },
  );
};

export const useLeaderboardPoint = () => {
  return useQuery(
    [QUERY_KEY.LEADERBOARD_POINT],
    (): Promise<any> => {
      return serverRequest.get(`${API_BASE_URL}/leaderbroad/point`);
    },
    {
      keepPreviousData: true,
      staleTime: Infinity,
    },
  );
};

export const useActivityPoint = () => {
  return useQuery([QUERY_KEY.ACTIVITY_POINT], (): Promise<any> => {
    return serverRequest.get(`${API_BASE_URL}/user/activity-point`);
  });
};

export const useCheckInStatus = () => {
  return useQuery([QUERY_KEY.CHECK_IN_STATUS], (): Promise<any> => {
    return serverRequest.get(`${API_BASE_URL}/check-in/status`);
  });
};

export const useCheckIn = (
  options?: Omit<
    UseMutationOptions<
      AxiosResponse<void>,
      AxiosError,
      {
        date: string;
      }
    >,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      return serverRequest.post('/check-in', payload);
    },
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.CHECK_IN_STATUS]);
        queryClient.invalidateQueries([QUERY_KEY.ACTIVITY_POINT]);
      },
    },
  );
};
