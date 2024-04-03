import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { pxToRem } from '@/theme/foundations';
import React, { type SetStateAction } from 'react';
import { images } from '@/utils/images';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import { ethers } from 'ethers';
import { useMetaMask } from 'providers/MetamaskProvider';
import { roundBalance } from '@/utils/helper';
import { useWalletBalances } from '@/hooks';
import { useNetWorkContext } from 'providers/NetworkProvider';

type DepositDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  wallet: any;
};

const validation = Yup.object({
  numberMainnetToken: Yup.string().required('Required'),
});

export const DepositDialog = (props: DepositDialogProps) => {
  const { NETWORK_CONFIG } = useNetWorkContext();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
  } = useForm({
    defaultValues: { numberMainnetToken: '' },
    // @ts-ignore
    resolver: yupResolver(validation),
    mode: 'all',
  });

  const numberMainnetToken = watch('numberMainnetToken');

  const { deposit, setOpenAlert, setAlertMessage } = useMetaMask();

  const onSubmit = async (data: any) => {
    try {
      const walletAddress = props.wallet.address;
      const valueInWei = ethers.utils.parseEther(data.numberMainnetToken.toString());
      deposit({
        targetAddress: walletAddress,
        value: data.numberMainnetToken.toString(),
        valueInWei,
      });
      props.setIsOpen(false);
    } catch (e) {
      console.log(e);
      setAlertMessage(e.response?.data?.message ? e.response?.data?.message : e.response?.data);
      setOpenAlert(true);
    }
  };

  const { data: mainNetTokenPrice, isFetching } = useWalletBalances({
    walletAddress: props.wallet.address,
    chain: NETWORK_CONFIG?.PROVIDER_NETWORK,
  });

  return (
    <Dialog
      sx={(theme) => {
        return {
          '& .MuiDialog-paper': {
            backgroundColor: `${theme.palette.common.transparent} !important`,
            padding: '0 !important',
            maxWidth: 288,
            borderRadius: `${pxToRem(14)} !important`,
            boxShadow: 'none !important',
          },
        };
      }}
      open={props.isOpen}
      onClose={() => props.setIsOpen(false)}
    >
      <Stack width={288} bgcolor={'background.smallDialog'} height={205}>
        <DialogTitle>
          <Stack
            px={pxToRem(12)}
            py={pxToRem(10)}
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            width={1}
            height={1}
          >
            Deposit
            <IconButton onClick={() => props.setIsOpen(false)}>
              <Box width={16} height={16}>
                <img src={images.iconClose} alt="" width={'100%'} height={'100%'} />
              </Box>
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box
            component={'form'}
            onSubmit={handleSubmit(onSubmit)}
            width={1}
            px={pxToRem(12)}
            mt={pxToRem(20)}
          >
            <Stack
              gap={pxToRem(12)}
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography variant={'body1'}>Amount</Typography>
              <Stack
                flex={1}
                height={38}
                borderRadius={pxToRem(6)}
                sx={(theme) => ({ border: `1px solid ${theme.palette.border.darker}` })}
                justifyContent={'center'}
              >
                <Controller
                  name="numberMainnetToken"
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <FormControl fullWidth>
                        <TextField
                          value={field.value}
                          sx={{
                            height: 1,
                          }}
                          InputProps={{
                            endAdornment: (
                              <Typography variant={'body1'}>
                                {NETWORK_CONFIG?.NATIVE_CURRENCY}
                              </Typography>
                            ),
                          }}
                          type={'number'}
                          helperText={fieldState?.error?.message ?? ''}
                          onChange={(event) => {
                            field.onChange(event.target.value ? Number(event.target.value) : null);
                          }}
                        />
                      </FormControl>
                    );
                  }}
                />
              </Stack>
            </Stack>
            <Stack
              mt={1}
              mb={2}
              direction={'row'}
              justifyContent={'flex-end'}
              alignItems={'center'}
            >
              <Typography fontSize={16} fontWeight={'bold'}>
                ~
                {numberMainnetToken
                  ? roundBalance(
                      _.get(mainNetTokenPrice, 'nativeTokenPriceUsd', 0) *
                        parseFloat(numberMainnetToken),
                      2,
                    )
                  : 0}
                $
              </Typography>
            </Stack>
            <Button
              disabled={isFetching || isSubmitting}
              type={'submit'}
              variant={'soft'}
              color={'success'}
              fullWidth
              size={'large'}
            >
              {isSubmitting || isFetching ? (
                <CircularProgress color={'primary'} size={24} />
              ) : (
                'Deposit'
              )}
            </Button>
          </Box>
        </DialogContent>
      </Stack>
    </Dialog>
  );
};
