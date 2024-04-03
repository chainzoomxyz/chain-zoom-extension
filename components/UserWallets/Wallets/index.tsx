import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import _ from 'lodash';
import { pxToRem } from '@/theme/foundations';
import { images } from '@/utils/images';
import { formatAddress } from '@/utils/helper';
import React, { type SetStateAction } from 'react';
import type { IWallet } from '@/interfaces';

type WalletsProps = {
  profile: any;
  setOpenDeposit: React.Dispatch<SetStateAction<boolean>>;
  setOpenDepositDialog: React.Dispatch<SetStateAction<boolean>>;
  setIsImportWallet: React.Dispatch<SetStateAction<boolean>>;
  activeWallet: number;
  setActiveWallet: React.Dispatch<SetStateAction<number>>;
};

export const Wallets = ({
  profile,
  setOpenDeposit,
  activeWallet,
  setActiveWallet,
  setOpenDepositDialog,
  setIsImportWallet,
}: WalletsProps) => {
  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      width={1}
      height={1}
      position={'absolute'}
      zIndex={2}
      p={2}
    >
      <Typography color={'common.white'} fontSize={30} fontWeight={'bold'}>
        2 wallets have been created for you
      </Typography>
      <Typography sx={{ mt: 1, mb: 4 }} color={'common.white'} variant={'body1'}>
        Deposit ETH, or import your own wallet, to start trading now!
      </Typography>
      <Grid container width={1}>
        {_.get(profile, 'evmWallets', []).map((wallet: IWallet, index: number) => {
          return (
            <Grid
              sx={{ cursor: 'pointer' }}
              xs={4}
              px={1}
              key={wallet._id}
              onClick={() => setActiveWallet(index)}
            >
              <Stack
                height={315}
                width={1}
                borderRadius={pxToRem(10)}
                p={'1px'}
                sx={(theme) => ({
                  background:
                    index === activeWallet
                      ? theme.palette.background.walletGradientActive
                      : theme.palette.background.walletGradient,
                })}
              >
                <Stack
                  justifyContent={'center'}
                  alignItems={'center'}
                  sx={(theme) => ({
                    background:
                      index === activeWallet
                        ? 'radial-gradient(48.08% 59.1% at 50% 35.62%, #30455A 0%, #2C3849 100%)'
                        : theme.palette.primary.main,
                  })}
                  width={1}
                  height={1}
                  borderRadius={pxToRem(10)}
                >
                  <Box width={134} height={134} mb={pxToRem(22)}>
                    <img src={images.iconDeposit} alt="" />
                  </Box>
                  <Typography fontSize={20} fontWeight={'bold'} sx={{ opacity: 0.88 }}>
                    {`Wallet ${index + 1}`}
                  </Typography>
                  <Stack mt={1} mb={pxToRem(18)} direction={'row'} gap={1} alignItems={'center'}>
                    <Typography variant={'h4'}>
                      {formatAddress(_.get(wallet, 'address', '').substring(0, 4))}
                    </Typography>
                    <Box width={17} height={17}>
                      <img src={images.iconCopy} alt="" />
                    </Box>
                  </Stack>
                  <Button
                    variant={'soft'}
                    sx={{ width: 190, height: 42 }}
                    color={index === activeWallet ? 'success' : 'dark'}
                    onClick={() => setOpenDepositDialog(true)}
                  >
                    Deposit
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          );
        })}
        {_.get(profile, 'evmWallets', []).length < 3 && (
          <Grid xs={4} px={2}>
            <Stack
              sx={{ cursor: 'pointer' }}
              width={1}
              height={1}
              gap={2}
              justifyContent={'center'}
              alignItems={'center'}
              onClick={() => setIsImportWallet(true)}
            >
              <IconButton>
                <Box width={82} height={82}>
                  <img src={images.iconImportWallet} alt="" />
                </Box>
              </IconButton>
              <Typography fontSize={20} fontWeight={'bold'} sx={{ opacity: 0.8 }}>
                Import your wallet
              </Typography>
            </Stack>
          </Grid>
        )}
      </Grid>
      <Button
        variant={'contained'}
        color={'secondary'}
        sx={{
          mt: pxToRem(56),
          width: 221,
          height: 59,
          borderRadius: pxToRem(32),
        }}
        onClick={() => setOpenDeposit(false)}
      >
        Skip for now!
      </Button>
    </Stack>
  );
};
