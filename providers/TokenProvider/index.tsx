import React, { createContext, type PropsWithChildren, useContext } from 'react';
import { useTokenInfo } from '@/hooks';
import { tokenStore } from '@/store/TokenStore';
import { observer } from 'mobx-react-lite';
import { useNetWorkContext } from '@/providers/NetworkProvider';

interface TokenContextData {
  tokenInfo: any;
  isLoading: boolean;
  tokenAddress: string;
}

const TokenContext = createContext<TokenContextData>({} as TokenContextData);

export const TokenContextProvider = observer(({ children }: PropsWithChildren) => {
  const { NETWORK_CONFIG } = useNetWorkContext();
  const { tokenAddress } = tokenStore;
  const { data: tokenInfo, isLoading } = useTokenInfo({
    tokenAddress,
    chainId: NETWORK_CONFIG.NETWORK_ID,
  });

  return (
    <TokenContext.Provider
      value={{
        tokenInfo,
        isLoading,
        tokenAddress,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
});

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokenContext must be used within a "TokenContextProvider"');
  }
  return context;
};
