import { ScreenPopupWrapper } from '@/components/ScreenPopupWrapper/ScreenPopupWrapper';
import { pxToRem } from '@/theme/foundations';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { PortfolioBalance } from '@/types';
import _ from 'lodash';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { type SetStateAction } from 'react';
import { roundBalance } from '@/utils/helper';
import { ethers } from 'ethers';
import { useMetaMask } from 'providers/MetamaskProvider';
import { useWithdrawMutation } from '@/hooks';

type PopupWithdrawProps = {
  withDrawData: PortfolioBalance;
  closePopup: () => void;
  selectedWallet: string;
  setTnxHash: React.Dispatch<SetStateAction<any>>;
  setIsOpenSuccess: React.Dispatch<SetStateAction<boolean>>;
};
export const PopupWithdraw = (props: PopupWithdrawProps) => {
  const validation = Yup.object({
    numberToken: Yup.string().required('Required'),
  });
  const { configChain, wallet, setAlertMessage, setOpenAlert } = useMetaMask();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    watch,
  } = useForm({
    defaultValues: { numberToken: '' },
    // @ts-ignore
    resolver: yupResolver(validation),
    mode: 'all',
  });
  const numberMainnet = watch('numberToken');

  const withdrawMutation = useWithdrawMutation();

  const onSubmit = async (data: any) => {
    try {
      const valueInWei = ethers.utils.parseUnits(
        data.numberToken.toString(),
        _.get(props.withDrawData, 'decimals', 18),
      );
      const withdrawParams = {
        walletAddress: _.nth(_.get(wallet, 'accounts', [])),
        selectedWallet: props.selectedWallet,
        chainId: configChain?.NETWORK_ID.toString(),
        recipientAddress: _.nth(_.get(wallet, 'accounts', [])),
        tokenAddress: props.withDrawData.tokenAddress,
        withdrawAmount: valueInWei.toString(),
      };
      await withdrawMutation.mutateAsync(withdrawParams).then((tnxHash) => {
        props.setTnxHash(tnxHash);
        props.setIsOpenSuccess(true);
        props.closePopup();
      });
    } catch (e) {
      console.log(e);
      setAlertMessage(e.response?.data?.message ? e.response?.data?.message : e.response?.data);
      setOpenAlert(true);
    }
  };

  return (
    <ScreenPopupWrapper title="Withdraw" close={props.closePopup}>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          px={pxToRem(12)}
          mt={pxToRem(12)}
        >
          <Typography variant={'body2'} color={'common.white'}>
            Token
          </Typography>
          <Box
            sx={{
              borderRadius: '6px',
              border: '1px solid #647387',
              p: pxToRem(10),
              width: '216px',
              height: '40px',
            }}
          >
            <Typography fontSize={pxToRem(16)} fontWeight={'700'} color={'#fff'}>
              {_.get(props.withDrawData, 'name', '')}
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          px={pxToRem(12)}
          mt={pxToRem(12)}
        >
          <Typography variant={'body2'} color={'common.white'}>
            Amount
          </Typography>
          <Stack
            width={216}
            height={38}
            borderRadius={pxToRem(6)}
            sx={(theme) => ({ border: `1px solid ${theme.palette.border.darker}` })}
            justifyContent={'center'}
          >
            <Controller
              name="numberToken"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <FormControl fullWidth>
                    <TextField
                      value={field.value}
                      sx={{
                        height: 1,
                      }}
                      type={'number'}
                      helperText={fieldState?.error?.message ?? ''}
                      onChange={(event) => {
                        field.onChange(event.target.value ? Number(event.target.value) : null);
                      }}
                      inputProps={{
                        max: _.get(props.withDrawData, 'balance', 0),
                      }}
                    />
                  </FormControl>
                );
              }}
            />
          </Stack>
        </Stack>
        <Stack
          px={pxToRem(12)}
          mt={1}
          mb={2}
          direction={'row'}
          justifyContent={'flex-end'}
          alignItems={'center'}
        >
          <Typography fontSize={16} fontWeight={'bold'}>
            ~
            {numberMainnet
              ? roundBalance(
                  parseFloat(numberMainnet) * parseFloat(_.get(props.withDrawData, 'price', '0')),
                  2,
                )
              : 0}
            $
          </Typography>
        </Stack>
        <div style={{ padding: pxToRem(12) }}>
          <Button
            disabled={isSubmitting}
            type={'submit'}
            sx={{ width: '100%' }}
            variant="soft"
            color="success"
          >
            {isSubmitting ? (
              <CircularProgress color={'primary'} size={24} />
            ) : (
              <Typography fontSize={pxToRem(16)} fontWeight={'700'} color={'#fff'}>
                Withdraw
              </Typography>
            )}
          </Button>
        </div>
      </form>
    </ScreenPopupWrapper>
  );
};
