import React, { createContext, type PropsWithChildren, useContext } from 'react';
import { tokenStore } from '@/store/TokenStore';
import { observer } from 'mobx-react-lite';
import _ from 'lodash';
import { NETWORKS } from '@/utils/wallet';

interface NetworkProviderData {
  NETWORK_CONFIG: any;
  getConfigChain: (network: string) => any;
}

const NetworkConText = createContext<NetworkProviderData>({} as NetworkProviderData);

export const NetworkContextProvider = observer(({ children }: PropsWithChildren) => {
  const { network } = tokenStore;

  const getConfigChain = (network: string) => {
    return _.find(NETWORKS, (item) => {
      return item.NETWORK === network;
    });
  };

  return (
    <NetworkConText.Provider
      value={{
        NETWORK_CONFIG: getConfigChain(network || NETWORKS[0].NETWORK),
        getConfigChain,
      }}
    >
      {children}
    </NetworkConText.Provider>
  );
});

export const useNetWorkContext = () => {
  const context = useContext(NetworkConText);
  if (context === undefined) {
    throw new Error('useNetWorkContext must be used within a "NetworkContextProvider"');
  }
  return context;
};
