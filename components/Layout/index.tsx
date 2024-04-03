import React, { type SetStateAction, useEffect } from 'react';
import { Box, Dialog, Snackbar, Stack } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import { AppBar } from '@/components/AppBar';
import { useStorage } from '@plasmohq/storage/hook';
import { STORAGE_KEY } from '@/utils/constants';
import { useMetaMask } from 'providers/MetamaskProvider';
import { UserWallets } from '@/components/UserWallets';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Storage } from '@plasmohq/storage';
import { RefBox } from '@/components/RefBox';
import { ProfileSettings } from '@/components/ProfileSettings';

type LayoutProps = {
  children: React.ReactNode;
  activePage: string;
  setActivePage: React.Dispatch<SetStateAction<string>>;
  defaultPage: string;
};

export const Layout = (props: LayoutProps) => {
  const [isOpen, setIsOpen] = useStorage(
    {
      key: STORAGE_KEY.SHOW_MAIN_POPUP,
      instance: new Storage({
        area: 'local',
      }),
    },
    false,
  );

  const [tokenAddressFromTwitter] = useStorage(
    {
      key: STORAGE_KEY.TWITTER,
      instance: new Storage({
        area: 'local',
      }),
    },
    '',
  );

  useEffect(() => {
    if (props.activePage !== props.defaultPage) {
      props.setActivePage(props.defaultPage);
    }
  }, [tokenAddressFromTwitter]);

  const {
    openProfileSetting,
    profile,
    openRef,
    openAlert,
    alertMessage,
    setOpenAlert,
    openDeposit,
    isConnected,
  } = useMetaMask();
  return (
    <Dialog
      sx={(theme) => {
        return {
          '& .MuiDialog-paper': {
            backgroundColor: `${theme.palette.primary.main} !important`,
            padding: '0 !important',
          },
          zIndex: 1000,
        };
      }}
      maxWidth={'md'}
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Box width={900} height={700} p={2}>
        <Box width={1} height={1}>
          <Stack direction={'column'} height={1} gap={pxToRem(12)}>
            <AppBar activePage={props.activePage} setActivePage={props.setActivePage} />
            <Stack flex={1} width={1} position={'relative'}>
              {!isConnected && props.activePage !== 'overview' && (
                <Box width={1} height={1} position={'absolute'} zIndex={10}>
                  <ConnectWallet />
                </Box>
              )}
              {openRef && <RefBox />}
              {openDeposit && <UserWallets />}
              {openProfileSetting && <ProfileSettings />}
              {props.children}
            </Stack>
          </Stack>
        </Box>
      </Box>
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
        message={alertMessage}
      />
    </Dialog>
  );
};
