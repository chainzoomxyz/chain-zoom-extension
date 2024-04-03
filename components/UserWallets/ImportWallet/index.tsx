import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import { images } from '@/utils/images';
import React, { type SetStateAction, useState } from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Wallet } from 'ethers';
import { useImportWalletMutation } from '@/hooks';
import { useMetaMask } from 'providers/MetamaskProvider';
import { ALERT_MESSAGES } from '@/utils/messages';

type ImportWalletProps = {
  setIsImportWallet: React.Dispatch<SetStateAction<boolean>>;
};

const validation = Yup.object({
  walletPrivateKey: Yup.string()
    .required('Required')
    .length(64, 'Invalid private key')
    .matches(/^[A-Za-z0-9]*$/, 'Invalid private key'),
});

export const ImportWallet = ({ setIsImportWallet }: ImportWalletProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { walletPrivateKey: '' },
    // @ts-ignore
    resolver: yupResolver(validation),
    mode: 'all',
  });

  const { setOpenAlert, setAlertMessage } = useMetaMask();

  const importWalletMutation = useImportWalletMutation();

  const onSubmit = async (payload: any) => {
    try {
      const wallet = new Wallet(payload.walletPrivateKey);
      await importWalletMutation.mutateAsync({ ...payload, walletAddress: wallet.address });
      setAlertMessage(ALERT_MESSAGES.IMPORT_WALLET_SUCCESS);
      setOpenAlert(true);
      setIsImportWallet(false);
    } catch (e) {
      console.log(e);
      setAlertMessage(e.response?.data?.message ? e.response?.data?.message : e.response?.data);
      setOpenAlert(true);
    }
  };
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);

  return (
    <Stack width={1} height={1} position={'absolute'} zIndex={2} px={pxToRem(40)} py={pxToRem(30)}>
      <Stack width={1} flex={1} position={'relative'}>
        <Stack
          onClick={() => setIsImportWallet(false)}
          direction={'row'}
          gap={pxToRem(20)}
          alignItems={'center'}
          sx={{ cursor: 'pointer' }}
          position={'absolute'}
        >
          <Box width={40} height={40}>
            <img src={images.iconGoBack} alt="" />
          </Box>
          <Typography variant={'h4'} color={'common.white'}>
            Go back
          </Typography>
        </Stack>
        <Stack flex={1} justifyContent={'center'} alignItems={'center'} gap={pxToRem(40)}>
          <Typography fontSize={30} fontWeight={'bold'} color={'common.white'}>
            Import your private key
          </Typography>
          <Stack component={'form'} width={458} onSubmit={handleSubmit(onSubmit)} gap={pxToRem(12)}>
            <Box bgcolor={'common.white'} width={1} height={50} borderRadius={pxToRem(8)}>
              <Controller
                name="walletPrivateKey"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <FormControl fullWidth>
                      <TextField
                        {...field}
                        value={field.value}
                        sx={{
                          height: 1,
                        }}
                        inputProps={{
                          autoComplete: 'new-password',
                          maxLength: 64,
                        }}
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: (
                            <EndAdornmentIcon
                              showPrivateKey={showPrivateKey}
                              setShowPrivateKey={setShowPrivateKey}
                            />
                          ),
                        }}
                        helperText={fieldState?.error?.message ?? ''}
                        type={showPrivateKey ? 'text' : 'password'}
                        onChange={(event) => field.onChange(event.target.value)}
                        variant={'filled'}
                        placeholder={'Input your private key'}
                      />
                    </FormControl>
                  );
                }}
              />
            </Box>
            <Button
              disabled={isSubmitting}
              type={'submit'}
              variant={'soft'}
              color={'success'}
              fullWidth
              size={'large'}
            >
              {isSubmitting ? <CircularProgress color={'primary'} size={24} /> : 'Import Wallet'}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

const EndAdornmentIcon = ({
  showPrivateKey,
  setShowPrivateKey,
}: {
  showPrivateKey: boolean;
  setShowPrivateKey: React.Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Stack
      width={32}
      height={32}
      sx={{ cursor: 'pointer' }}
      onClick={() => setShowPrivateKey(!showPrivateKey)}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <img src={showPrivateKey ? images.iconHideKey : images.iconShowKey} alt="" />
    </Stack>
  );
};
