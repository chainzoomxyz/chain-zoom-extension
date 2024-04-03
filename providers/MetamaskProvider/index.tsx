import React, {
  createContext,
  type PropsWithChildren,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import hexer from 'browser-string-hexer';
import { formatBalance } from '@/utils/helper';
import { createExternalExtensionProvider, initializeProvider } from '@metamask/providers';
import { BrowserRuntimePostMessageStream } from '@metamask/post-message-stream';
import { EthereumEvents, SIGN_CHAINZOOM_RAW_MESSAGE, WALLET_TYPES } from '@/utils/wallet';
import _ from 'lodash';
import { clearTokens, setAccessToken, setRefreshToken } from '@/utils/token';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/utils/query-key';
import { login, logout, useProfile } from '@/hooks';
import type { IUser } from '@/interfaces';
import type { DepositParams } from '@/types';
import { ALERT_MESSAGES } from '@/utils/messages';
import { useNetWorkContext } from '@/providers/NetworkProvider';

const metamaskStream = new BrowserRuntimePostMessageStream({
  name: 'inpage',
  target: 'contentscript',
});

initializeProvider({
  connectionStream: metamaskStream,
});

interface WalletState {
  accounts: any[];
  balance: number;
  chainId: string;
}

interface MetaMaskContextData {
  wallet: WalletState;
  isConnected: boolean;
  isLoading: boolean;
  connectMetaMask: () => void;
  disconnectMetamask: () => void;
  switchChain: (chainId: number) => void;
  deposit: (params: DepositParams) => void;
  profile: IUser | null;
  openRef: boolean;
  setOpenRef: React.Dispatch<SetStateAction<boolean>>;
  openDeposit: boolean;
  setOpenDeposit: React.Dispatch<SetStateAction<boolean>>;
  openAlert: boolean;
  setOpenAlert: React.Dispatch<SetStateAction<boolean>>;
  openProfileSetting: boolean;
  setOpenProfileSetting: React.Dispatch<SetStateAction<boolean>>;
  alertMessage: string;
  setAlertMessage: React.Dispatch<SetStateAction<string>>;
}

const disconnectedState: WalletState = { accounts: [], balance: 0, chainId: '' };

const MetaMaskContext = createContext<MetaMaskContextData>({} as MetaMaskContextData);

export const MetaMaskContextProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const provider = createExternalExtensionProvider();
  const { NETWORK_CONFIG } = useNetWorkContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: profile } = useProfile();
  const [wallet, setWallet] = useState(disconnectedState);
  const [openRef, setOpenRef] = useState<boolean>(false);
  const [openDeposit, setOpenDeposit] = useState<boolean>(false);
  const [openProfileSetting, setOpenProfileSetting] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  // useCallback ensures that you don't uselessly recreate the _updateWallet function on every render
  const _updateWallet = useCallback(async (providedAccounts?: any) => {
    const accounts =
      providedAccounts || (await provider.request({ method: EthereumEvents.GET_ACCOUNTS }));

    if (accounts.length === 0 && !profile) {
      // If there are no accounts, then the user is disconnected
      setWallet(disconnectedState);
      return;
    }

    const balance = formatBalance(
      await provider.request({
        method: EthereumEvents.GET_BALANCE,
        params: [accounts[0], 'latest'],
      }),
      5,
    );
    const chainId: any = await provider.request({
      method: EthereumEvents.GET_CHAIN_ID,
    });

    setWallet({ accounts, balance, chainId });
  }, []);

  const updateWalletAndAccounts = useCallback(() => _updateWallet(), [_updateWallet]);
  const updateWallet = useCallback((accounts: any) => _updateWallet(accounts), [_updateWallet]);

  /**
   * This logic checks if MetaMask is installed. If it is, some event handlers are set up
   * to update the wallet state when MetaMask changes. The function returned by useEffect
   * is used as a "cleanup": it removes the event handlers whenever the MetaMaskProvider
   * is unmounted.
   */
  useEffect(() => {
    if (provider) {
      updateWalletAndAccounts();
      provider.on(EthereumEvents.ACCOUNTS_CHANGED, updateWallet);
      provider.on(EthereumEvents.CHAIN_CHANGED, updateWalletAndAccounts);
    }

    return () => {
      provider?.removeListener(EthereumEvents.ACCOUNTS_CHANGED, updateWallet);
      provider?.removeListener(EthereumEvents.CHAIN_CHANGED, updateWalletAndAccounts);
    };
  }, [updateWallet, updateWalletAndAccounts]);

  const disconnectMetamask = async (isErrorOnConnect = false) => {
    setIsLoading(true);
    try {
      // Runs only they are brand new, or have hit the disconnect button
      await provider.request({
        method: EthereumEvents.REVOKE_PERMISSIONS,
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      await logout();
      setAlertMessage(
        isErrorOnConnect ? ALERT_MESSAGES.LOGIN_ERROR_MESSENGER : ALERT_MESSAGES.LOGOUT_SUCCESS,
      );
      setOpenAlert(true);
      clearTokens();
    } catch (error: any) {
      console.log(error);
      clearTokens();
    }
    setWallet(disconnectedState);
    setIsLoading(false);
  };

  const connectMetaMask = async () => {
    setIsLoading(true);
    clearTokens();
    try {
      const accounts = await provider.request({
        method: EthereumEvents.REQUEST_ACCOUNTS,
      });

      if (NETWORK_CONFIG.TYPE === WALLET_TYPES.EVM_WALLET) {
        await switchChain();
      }

      const hexMessage = hexer(SIGN_CHAINZOOM_RAW_MESSAGE);
      const address = accounts[0];
      const signResult = await provider.request({
        method: EthereumEvents.PERSONAL_SIGN,
        params: [hexMessage, address],
      });

      if (signResult && accounts) {
        await login({
          walletAddress: address,
          message: SIGN_CHAINZOOM_RAW_MESSAGE,
          signedMessage: signResult as string,
        })
          .then((response) => {
            setAccessToken(response.data?.accessToken);
            setRefreshToken(response.data?.refreshToken);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_DETAIL] });
            updateWallet(accounts);
            setAlertMessage(ALERT_MESSAGES.LOGIN_SUCCESS);
            setOpenAlert(true);
            setOpenRef(true);
          })
          .catch(() => {
            disconnectMetamask(true);
          });
      }
    } catch (error: any) {
      console.log('Error login: ', error);
      await disconnectMetamask(true);
    }
    setIsLoading(false);
  };

  const switchChain = async () => {
    try {
      await provider.request({
        method: EthereumEvents.SWITCH_CHAIN,
        params: [
          {
            chainId: NETWORK_CONFIG.CHAIN_ID,
          },
        ],
      });
    } catch (error) {
      if (error.code === 4902) {
        await addChain();
      } else {
        console.log('Switch chain error: ', error);
      }
    }
  };

  const deposit = async ({ targetAddress, value, valueInWei }) => {
    try {
      console.log(wallet, parseInt(valueInWei.toString()));
      await switchChain();
      const walletBalance = wallet.balance;
      if (!walletBalance || parseInt(valueInWei.toString()) > walletBalance) {
        setAlertMessage(ALERT_MESSAGES.NOT_ENOUGH_BALANCE);
        setOpenAlert(true);
        return;
      }
      await provider
        .request({
          method: EthereumEvents.GAS_PRICE,
          params: [],
        })
        .then((responseGasPrice) => {
          provider
            .request({
              method: EthereumEvents.ESTIMATE_GAS,
              params: [
                {
                  from: _.nth(_.get(wallet, 'accounts', [])),
                  to: targetAddress,
                  value: hexer(value),
                  gasPrice: responseGasPrice,
                },
              ],
            })
            .then((responseEstimateGas) => {
              provider
                .request({
                  method: EthereumEvents.SEND_TRANSACTION,
                  params: [
                    {
                      from: _.nth(_.get(wallet, 'accounts', [])),
                      to: targetAddress,
                      value: valueInWei._hex,
                      gas: responseEstimateGas,
                      gasPrice: responseGasPrice,
                      // maxPriorityFeePerGas: response,
                      // Customizable by the user during MetaMask confirmation.
                      // maxFeePerGas: response,
                    },
                  ],
                })
                .then((txHash) => {
                  return txHash;
                })
                .catch((errorSendTransaction) => {
                  console.log(errorSendTransaction);
                  setAlertMessage(errorSendTransaction?.message ?? '');
                  setOpenAlert(true);
                });
            })
            .catch((errorEstimateGas) => {
              console.log(errorEstimateGas);
              setAlertMessage(errorEstimateGas?.data?.message ?? '');
              setOpenAlert(true);
            });
        });
    } catch (errorGasPrice) {
      console.log(errorGasPrice);
      setAlertMessage(errorGasPrice?.message ?? '');
      setOpenAlert(true);
    }
  };

  const addChain = async () => {
    await provider
      .request({
        method: EthereumEvents.ADD_CHAIN,
        params: [
          {
            chainId: NETWORK_CONFIG.CHAIN_ID,
            chainName: NETWORK_CONFIG.CHAIN_NAME,
            rpcUrls: [NETWORK_CONFIG.RPC_URL],
            nativeCurrency: {
              name: NETWORK_CONFIG.NATIVE_CURRENCY,
              symbol: NETWORK_CONFIG.NATIVE_CURRENCY,
              decimals: NETWORK_CONFIG.DECIMALS,
            },
            blockExplorerUrls: [NETWORK_CONFIG.BLOCK_EXPLORER_URL],
          },
        ],
      })
      .then(() => {
        switchChain();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <MetaMaskContext.Provider
      value={{
        wallet,
        isConnected: _.get(wallet, 'accounts', []).length > 0 && !!profile,
        isLoading,
        connectMetaMask,
        disconnectMetamask,
        switchChain,
        deposit,
        profile,
        openRef,
        setOpenRef,
        openDeposit,
        setOpenDeposit,
        openAlert,
        setOpenAlert,
        alertMessage,
        setAlertMessage,
        openProfileSetting,
        setOpenProfileSetting,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a "MetaMaskContextProvider"');
  }
  return context;
};
