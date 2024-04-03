import { Stack, Typography } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import { icons } from '@/utils/icons';
import { WalletManagement } from './WalletManagement';
import { ScreenWrapper } from '@/components/ScreenWrapper/ScreenWrapper';
import { PortfolioTable } from './PortfolioTable';
import React, { useEffect, useMemo, useState } from 'react';
import { PopupQr } from './PopupQr';
import { useWalletBalances, useWalletTransactions } from '@/hooks';
import { useMetaMask } from 'providers/MetamaskProvider';
import { DepositDialog } from '@/components/DepositDialog';
import _ from 'lodash';
import { type IWallet } from '@/interfaces';
import { substringAddress } from '@/utils/helper';
import { PopupWithdraw } from '@/screens/portfolio/PopupWithdraw';
import type { PortfolioBalance } from '@/types';
import { SuccessSwapDialog } from '@/components/AppBar/Trading/SuccessSwapDialog';
import { ComingSoon } from '@/components/ComingSoon';
import { getWalletsByNetwork, NON_EVM_WALLET_NETWORK, WALLET_TYPES } from '@/utils/wallet';
import { useNetWorkContext } from 'providers/NetworkProvider';

export enum Popup {
  DEPOSIT = 'DEPOSIT',
  PRIVATE_KEY = 'PRIVATE_KEY',
  QR = 'QR',
  WITHDRAW = 'WITHDRAW',
}

const TRANSACTION_LIMIT = 8;

export const Portfolio = () => {
  const [activePopup, setActivePopup] = useState(null);
  const { NETWORK_CONFIG } = useNetWorkContext();
  const { profile, isConnected } = useMetaMask();

  const [withDrawData, setWithdrawData] = useState<PortfolioBalance | null>(null);

  const wallets = getWalletsByNetwork(profile, NETWORK_CONFIG.TYPE);

  const walletOptions = wallets.map((wallet: IWallet, index: number) => {
    return {
      label: `Wallet ${index + 1}: ${substringAddress(wallet.address as `0x${string}`, 5, 5)}`,
      value: wallet.address,
    };
  });
  const [selectedWalletAddress, setSelectedWalletAddress] = useState('');
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);
  const [tnxHash, setTnxHash] = useState<string>('');
  const [pageTransaction, setPageTransaction] = useState<number>(1);

  useEffect(() => {
    if (_.nth(wallets, 0)) {
      setSelectedWalletAddress(_.get(_.nth(wallets, 0), 'address', ''));
    }
  }, [profile]);

  const { data: balances, isFetching: isFetchingBalances } = useWalletBalances({
    walletAddress: selectedWalletAddress,
    chain: NETWORK_CONFIG?.PROVIDER_NETWORK,
  });

  const { data: transactions, isFetching: isFetchingTransactions } = useWalletTransactions({
    walletAddress: selectedWalletAddress,
    chain: NETWORK_CONFIG?.NETWORK,
    page: pageTransaction,
    limit: TRANSACTION_LIMIT,
  });

  const nativeTokenBalance = {
    id: NETWORK_CONFIG?.NETWORK_ID * 100,
    name: NETWORK_CONFIG?.NATIVE_CURRENCY,
    price: _.get(balances, 'nativeTokenPriceUsd', 0),
    balance: _.get(balances, 'nativeBalance', 0),
    value: _.get(balances, 'nativeTokenPriceUsd', 0) * _.get(balances, 'nativeBalance', 0),
    tokenAddress: '',
    selectedWallet: selectedWalletAddress,
    decimals: NETWORK_CONFIG?.DECIMALS,
  };

  const tokenBalances = _.get(balances, 'tokenBalances', []).map((item: any, index: number) => {
    return {
      id: index,
      name: item.name,
      price: item.priceUsd,
      balance: item.balance,
      value: item.priceUsd * item.balance,
      tokenAddress: item.address,
      selectedWallet: selectedWalletAddress,
      decimals: item.decimals,
    };
  });

  const walletTransactions = transactions
    ? transactions?.data?.map((item: any, index: number) => {
        return {
          id: index,
          tnxHash: item.transactionHash,
          action: item.action,
          createdAt: item.createdAt,
          value: item.tokenAmount,
          tokenAddress: item.tokenAddress,
          priceUsd: item.tokenAmountUsd,
        };
      })
    : [];

  const closePopup = () => {
    setActivePopup(false);
  };

  const openPopup = (popup: Popup) => {
    setActivePopup(popup);
  };

  const renderPopup = useMemo(() => {
    switch (activePopup) {
      case Popup.DEPOSIT:
        return (
          <DepositDialog
            isOpen={activePopup === Popup.DEPOSIT}
            setIsOpen={setActivePopup}
            wallet={{ address: selectedWalletAddress }}
          />
        );
      case Popup.PRIVATE_KEY:
        return <div>Private key</div>;
      case Popup.QR:
        return <PopupQr closePopup={closePopup} selectedWalletAddress={selectedWalletAddress} />;
      case Popup.WITHDRAW:
        return (
          <PopupWithdraw
            withDrawData={withDrawData}
            closePopup={closePopup}
            selectedWallet={selectedWalletAddress}
            setTnxHash={setTnxHash}
            setIsOpenSuccess={setIsOpenSuccess}
          />
        );
      default:
        return null;
    }
  }, [activePopup]);

  return (
    <ScreenWrapper title={'Portfolio'} icon={icons.walletIcon}>
      {isConnected && (
        <>
          {/* Wallet & Deposit & Private key */}
          <WalletManagement
            openPopup={openPopup}
            selectedWalletAddress={selectedWalletAddress}
            setSelectedWalletAddress={setSelectedWalletAddress}
            walletOptions={walletOptions}
            isChainWithEvmWallet={NETWORK_CONFIG?.TYPE === WALLET_TYPES.EVM_WALLET}
          />
          {/* Volume & Balance */}
          <Stack direction={'row'} gap={pxToRem(40)}>
            {/*<Stack direction={'row'} gap={pxToRem(4)}>*/}
            {/*  <Typography fontSize={pxToRem(16)} fontWeight={'400'} color={'#6D7182'}>*/}
            {/*    VOLUME:*/}
            {/*  </Typography>*/}
            {/*  <Typography fontSize={pxToRem(16)} fontWeight={'500'} color={'#fff'}>*/}
            {/*    ${`${_.get(volume, 'totalVolumeUsd', 0)}`}*/}
            {/*  </Typography>*/}
            {/*</Stack>*/}
            <Stack direction={'row'} gap={pxToRem(4)}>
              <Typography fontSize={pxToRem(16)} fontWeight={'400'} color={'#6D7182'}>
                BALANCE:
              </Typography>
              <Typography fontSize={pxToRem(16)} fontWeight={'500'} color={'#fff'}>
                {`${_.get(balances, 'nativeBalance', 0)} ${NETWORK_CONFIG?.NATIVE_CURRENCY}`}
              </Typography>
            </Stack>
          </Stack>
          {/* Table */}
          {NETWORK_CONFIG?.TYPE === NON_EVM_WALLET_NETWORK.SUI ? (
            <ComingSoon title={'Sui transactions and balances'} />
          ) : (
            <PortfolioTable
              openPopup={openPopup}
              tokenBalances={[nativeTokenBalance, ...tokenBalances]}
              walletTransactions={walletTransactions}
              setWithdrawData={setWithdrawData}
              page={pageTransaction}
              setPage={setPageTransaction}
              maxPage={transactions?.maxpage || 1}
              isFetchingBalances={isFetchingBalances}
              isFetchingTransactions={isFetchingTransactions}
            />
          )}
          {/* Popup */}
          {renderPopup}
          <SuccessSwapDialog hash={tnxHash} isOpen={isOpenSuccess} setIsOpen={setIsOpenSuccess} />
        </>
      )}
    </ScreenWrapper>
  );
};
