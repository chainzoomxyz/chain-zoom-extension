import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { images } from '@/utils/images';
import React from 'react';
import { useMetaMask } from 'providers/MetamaskProvider';
import { pxToRem } from '@/theme/foundations';

type ConnectWalletProps = {
  handleConnect?: () => void;
};

export const ConnectWallet = (props: ConnectWalletProps) => {
  const { connectMetaMask, isLoading } = useMetaMask();
  return (
    <Stack
      width={1}
      height={1}
      bgcolor={'background.blur'}
      sx={{
        backdropFilter: 'blur(3.5px)',
      }}
      direction={'column'}
      gap={2}
      justifyContent={'center'}
      alignItems={'center'}
      borderRadius={pxToRem(14)}
    >
      <Box width={90}>
        <img src={images.logo2} alt="" width={'100%'} height={'100%'} />
      </Box>
      <Typography textAlign={'center'} fontSize={22} fontWeight={'bold'} component={'div'}>
        Unlock the full <br /> potential
      </Typography>
      <Typography variant={'body1'} color={'white'}>
        Log in with
      </Typography>

      <Button
        sx={{ maxWidth: 230 }}
        variant={'soft'}
        color={'white'}
        onClick={() => {
          props.handleConnect ? props.handleConnect() : connectMetaMask();
        }}
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress color={'primary'} size={32} />
        ) : (
          <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} gap={1}>
            <Box width={22} height={22}>
              <img src={images.iconMetamask} alt="" width={'100%'} height={'100%'} />
            </Box>
            Metamask
          </Stack>
        )}
      </Button>
    </Stack>
  );
};
