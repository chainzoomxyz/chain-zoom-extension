import {
  Box,
  Button,
  Popover,
  Stack,
  styled,
  Tab,
  Tabs,
  type TabsProps,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { pxToRem } from '@/theme/foundations';
import { ConnectWallet } from '@/components/ConnectWallet';
import { useMetaMask } from 'providers/MetamaskProvider';
import { BuyForm } from '@/components/AppBar/Trading/BuyForm';
import { SellForm } from '@/components/AppBar/Trading/SellForm';
import type { TabPanelProps } from '@/types';
import { SuccessSwapDialog } from '@/components/AppBar/Trading/SuccessSwapDialog';
import { getWalletsByNetwork, NON_EVM_WALLET_NETWORK, WALLET_TYPES } from '@/utils/wallet';
import { ComingSoon } from '@/components/ComingSoon';
import { useNetWorkContext } from 'providers/NetworkProvider';

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        height: '100%',
      }}
    >
      {value === index && (
        <Box width={1} height={1}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TabList = styled(Tabs)<TabsProps>(({ theme, ...props }) => {
  return {
    minHeight: 38,
    position: 'relative',
    '& .MuiTabs-flexContainer': {
      background: theme.palette.common.transparent,
      minHeight: 38,
      height: 38,
      position: 'absolute',
      zIndex: 10,
      width: '100%',
    },
    '& .MuiTab-root': {
      height: 38,
      minHeight: 38,
      fontSize: 12,
      fontWeight: 600,
      width: '50%',
      marginRight: 0,
      color: theme.palette.common.white,
      '&.Mui-selected': {
        color: `${theme.palette.background.default}`,
      },
    },
    '& .MuiTabs-indicator': {
      height: '100%',
      background: props.value === 1 ? theme.palette.error.main : theme.palette.background.light,
      zIndex: 5,
    },
  };
});

export const Trading = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'trading-popover' : undefined;
  const { NETWORK_CONFIG } = useNetWorkContext();
  const { isConnected, profile, connectMetaMask } = useMetaMask();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  let wallets = getWalletsByNetwork(profile, NETWORK_CONFIG.TYPE);

  const [isOpenSuccess, setIsOpenSuccess] = useState(false);
  const [hash, setHash] = useState('');
  return (
    <>
      <Button
        onClick={handleClick}
        variant={'gradient'}
        color={'secondary'}
        size={'small'}
        sx={{ width: 73 }}
      >
        <Typography fontSize={14} fontWeight={500} color={'common.white'}>
          Trade
        </Typography>
      </Button>
      <SuccessSwapDialog hash={hash} isOpen={isOpenSuccess} setIsOpen={setIsOpenSuccess} />
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        sx={{ zIndex: 1200 }}
        onClose={handleClose}
      >
        <Stack
          mt={1}
          borderRadius={pxToRem(14)}
          width={302}
          height={602}
          p={'1px'}
          sx={(theme) => ({
            boxShadow: `2px 4px 6px 0px ${theme.palette.boxShadow.main}`,
            background: theme.palette.background.popoverGradient,
          })}
          justifyContent={'center'}
          alignItems={'center'}
        >
          {NETWORK_CONFIG?.TYPE === NON_EVM_WALLET_NETWORK.SUI ? (
            <Box
              bgcolor={'background.default'}
              width={300}
              height={600}
              overflow={'hidden'}
              borderRadius={pxToRem(14)}
              position={'relative'}
            >
              <ComingSoon title={'Trading on Sui'} size={'small'} />
            </Box>
          ) : (
            <Box
              bgcolor={'background.default'}
              width={300}
              height={600}
              overflow={'hidden'}
              borderRadius={pxToRem(14)}
              position={'relative'}
            >
              {!isConnected && (
                <Box width={1} height={1} position={'absolute'} zIndex={10}>
                  <ConnectWallet
                    handleConnect={() => {
                      setAnchorEl(null);
                      connectMetaMask();
                    }}
                  />
                </Box>
              )}
              <Box
                width={1}
                height={1}
                px={pxToRem(12)}
                pt={pxToRem(20)}
                position={'absolute'}
                zIndex={5}
              >
                <Box
                  borderRadius={pxToRem(14)}
                  width={1}
                  overflow={'hidden'}
                  sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
                >
                  <TabList
                    scrollButtons={false}
                    visibleScrollbar={true}
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="BUY" {...a11yProps(0)} />
                    <Tab label="SELL" {...a11yProps(1)} />
                  </TabList>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  {wallets.length > 0 && (
                    <BuyForm
                      handleClose={handleClose}
                      wallets={wallets}
                      setIsOpenSuccess={setIsOpenSuccess}
                      setHash={setHash}
                    />
                  )}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  {wallets.length > 0 && (
                    <SellForm
                      handleClose={handleClose}
                      wallets={wallets}
                      setIsOpenSuccess={setIsOpenSuccess}
                      setHash={setHash}
                    />
                  )}
                </CustomTabPanel>
              </Box>
            </Box>
          )}
        </Stack>
      </Popover>
    </>
  );
};
