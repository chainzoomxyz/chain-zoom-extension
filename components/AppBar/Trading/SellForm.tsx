import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import { pxToRem } from '@/theme/foundations';
import type { IWallet } from '@/interfaces';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { images } from '@/utils/images';
import { formatAddress, roundBalance } from '@/utils/helper';
import { DEFAULT_GAS } from '@/utils/constants';
import { useTokenContext } from '@/providers/TokenProvider';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ethers } from 'ethers';
import { useSendSwapTransaction, useSwapRoute, useWalletBalances } from '@/hooks';
import { debouncedTyping } from '@/utils/debunce-typing';
import { useMetaMask } from 'providers/MetamaskProvider';
import { AccordionIcon } from '@/components/AppBar/Trading/AccordionIcon';
import type { TradingFormProps } from '@/types';
import { variantsAdvancedForm } from '@/utils/variants';
import { getErc20TokenDecimals } from '@/utils/ether';
import { ALERT_MESSAGES } from '@/utils/messages';
import { NON_EVM_WALLET_NETWORK, WALLET_TYPES } from '@/utils/wallet';
import { getSolanaTokenDecimals } from '@/utils/solana';
import { useNetWorkContext } from 'providers/NetworkProvider';

const validation = Yup.object({
  selectedWalletAddress: Yup.string().required('Required'),
  amountIn: Yup.string().max(100, 'Invalid amountIn').required('Required'),
  amountOut: Yup.number().required('Required'),
  isDefaultAdvanced: Yup.boolean().required('Required'),
  slippage: Yup.number()
    .integer('Invalid slippage')
    .max(100, 'Invalid slippage')
    .required('Required'),
  gas: Yup.number().integer('Invalid gas').required('Required'),
  isMevEnabled: Yup.boolean().required('Required'),
  isSimulationEnabled: Yup.boolean().required('Required'),
});

export const SellForm = (props: TradingFormProps) => {
  const [openAdvanced, setOpenAdvanced] = useState<boolean>(false);
  const [amountIn, setAmountIn] = useState('0');
  const { NETWORK_CONFIG } = useNetWorkContext();
  const { tokenInfo } = useTokenContext();
  const { wallet, setOpenAlert, setAlertMessage } = useMetaMask();
  const [isLoading, setIsLoading] = useState(false);
  const initValues = {
    amountIn: '',
    selectedWalletAddress: _.nth(props.wallets, 0)?.address,
    isDefaultAdvanced: true,
    slippage: 1,
    gas: _.nth(DEFAULT_GAS, 0).value,
    isMevEnabled: true,
    isSimulationEnabled: true,
  };

  const {
    formState: { isSubmitting },
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
  } = useForm({
    defaultValues: { ...initValues },
    // @ts-ignore
    resolver: yupResolver(validation),
    mode: 'onSubmit',
  });

  const isDefaultAdvanced = watch('isDefaultAdvanced');
  const selectedWalletAddress = watch('selectedWalletAddress');

  const { data: balances, isLoading: isLoadingBalance } = useWalletBalances({
    walletAddress: selectedWalletAddress || _.nth(props.wallets, 0)?.address,
    chain: NETWORK_CONFIG.PROVIDER_NETWORK,
  });

  const currentTokenBalance = _.get(balances, 'tokenBalances', []).find((item: any) => {
    return item.address === _.get(tokenInfo, 'token.address', '');
  });
  const currentWalletTokenBalance = _.get(currentTokenBalance, 'balance', '0');

  const [tokenDecimals, setTokenDecimals] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    if (NETWORK_CONFIG.TYPE === NON_EVM_WALLET_NETWORK.SOLANA) {
      getSolanaTokenDecimals(_.get(tokenInfo, 'token.address', ''), NETWORK_CONFIG?.RPC_URL).then(
        (response) => {
          setTokenDecimals(response);
          setIsLoading(false);
        },
      );
    } else {
      getErc20TokenDecimals(_.get(tokenInfo, 'token.address', ''), NETWORK_CONFIG?.RPC_URL)
        .then((response) => {
          setTokenDecimals(parseInt(response.toString()));
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setAlertMessage(ALERT_MESSAGES.LOGIN_ERROR_MESSENGER);
          setOpenAlert(true);
        });
    }
  }, [tokenInfo]);

  const handleChangeGas = (value: number) => {
    setValue('gas', value);
  };

  const { data: swapRouteData, isLoading: isLoadingSwapRoute } = useSwapRoute({
    chainId: NETWORK_CONFIG?.NETWORK_ID.toString(),
    network: NETWORK_CONFIG?.NETWORK,
    tokenInAddress: _.get(tokenInfo, 'token.address', ''),
    tokenInDecimals: tokenDecimals.toString(),
    tokenOutAddress: NETWORK_CONFIG?.NATIVE_TOKEN_ADDRESS,
    tokenOutDecimals: NETWORK_CONFIG?.DECIMALS.toString(),
    amountIn,
    type: NETWORK_CONFIG.TYPE,
  });

  useEffect(() => {
    if (isDefaultAdvanced) {
      reset({
        gas: _.nth(DEFAULT_GAS, 0).value,
        slippage: 1,
        isMevEnabled: true,
        isSimulationEnabled: true,
        isDefaultAdvanced: true,
      });
    }
  }, [isDefaultAdvanced]);

  useEffect(() => {
    if (NETWORK_CONFIG.TYPE === NON_EVM_WALLET_NETWORK.SOLANA) {
      const outAmount = _.get(swapRouteData, 'outAmount', '0');
      setValue(
        'amountOut',
        roundBalance(
          parseFloat(ethers.utils.formatUnits(outAmount, NETWORK_CONFIG.DECIMALS).toString()),
          5,
        ),
      );
    } else {
      setValue(
        'amountOut',
        roundBalance(
          parseFloat(
            ethers.utils
              .formatUnits(
                _.get(swapRouteData, 'routeSummary.amountOut', '0'),
                NETWORK_CONFIG?.DECIMALS,
              )
              .toString(),
          ),
          5,
        ),
      );
    }
  }, [swapRouteData]);

  const handleChangeAmountIn = (value: string) => {
    const rawValue = (parseFloat(value) / 100) * parseFloat(currentWalletTokenBalance);
    const parseUnits =
      NETWORK_CONFIG.TYPE === NON_EVM_WALLET_NETWORK.SOLANA
        ? rawValue
        : ethers.utils.parseUnits(rawValue.toString() || '0', NETWORK_CONFIG?.DECIMALS);
    debouncedTyping(parseUnits.toString(), setAmountIn);
  };

  const sendSwapTransaction = useSendSwapTransaction();

  const onSubmit = async (data: any) => {
    try {
      const swapSettingsDto = Object.assign(
        {
          slippage: data.slippage * 100,
          deadline: 60 * 60,
        },
        isDefaultAdvanced ? { priorityGasMultiplier: data.gas } : { manualGasPrice: data.gas },
      );

      const sendSwapTransactionParams = {
        tokenInAddress: _.get(tokenInfo, 'token.address', ''),
        tokenInDecimals: tokenDecimals.toString(),
        tokenOutAddress: NETWORK_CONFIG?.NATIVE_TOKEN_ADDRESS,
        tokenOutDecimals: NETWORK_CONFIG?.DECIMALS.toString(),
        amountIn,
        userWalletAddress: _.nth(_.get(wallet, 'accounts', [])),
        selectedWalletAddress: data.selectedWalletAddress,
        swapSettingsDto,
        isSimulationEnabled: data.isSimulationEnabled,
        isMevEnabled: data.isMevEnabled,
        chainId: NETWORK_CONFIG?.NETWORK_ID.toString(),
        network: NETWORK_CONFIG?.NETWORK,
        providerNetwork: NETWORK_CONFIG?.PROVIDER_NETWORK,
        type: NETWORK_CONFIG.TYPE,
      };
      await sendSwapTransaction.mutateAsync(sendSwapTransactionParams as any).then((response) => {
        props.setHash(
          NETWORK_CONFIG.TYPE === WALLET_TYPES.EVM_WALLET
            ? _.get(response, 'hash', '')
            : response.toString(),
        );
        props.setIsOpenSuccess(true);
        props.handleClose();
      });
    } catch (e) {
      console.log('Error: ', e.response?.data?.message);
      setAlertMessage(e.response?.data?.message ? e.response?.data?.message : e.response?.data);
      setOpenAlert(true);
    }
  };

  return (
    <Stack
      mt={pxToRem(14)}
      gap={pxToRem(12)}
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
      width={1}
      flex={1}
    >
      <Controller
        name="selectedWalletAddress"
        control={control}
        render={({ field }) => {
          return (
            <FormControl fullWidth>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant={'body2'}>Wallet</Typography>
                <Stack direction={'row'} alignItems={'center'} gap={pxToRem(2)}>
                  <Typography variant={'body2'}>Chain:</Typography>
                  <Box width={14} height={14} borderRadius={'50%'} overflow={'hidden'}>
                    <img
                      src={NETWORK_CONFIG?.CHAIN_IMAGE_URL}
                      alt=""
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                  <Stack direction={'row'}>
                    <Typography variant={'body2'}>{NETWORK_CONFIG?.NAME}</Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Box
                sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
                width={1}
                height={39}
                borderRadius={pxToRem(6)}
                bgcolor={'background.smallDialog'}
              >
                <Select
                  {...field}
                  variant="outlined"
                  size="small"
                  fullWidth
                  IconComponent={AccordionIcon}
                >
                  {props.wallets.map((wallet: IWallet, index) => {
                    return (
                      <MenuItem
                        key={wallet._id}
                        value={wallet.address}
                        sx={{ justifyContent: 'space-between' }}
                      >
                        <Typography variant={'body2'}>
                          Wallet {index + 1}: {formatAddress(wallet.address)}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>
            </FormControl>
          );
        }}
      />
      <Controller
        name="amountIn"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <FormControl fullWidth>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant={'body2'}>Sell</Typography>
                <Typography variant={'body2'} color={'common.white'}>
                  Balance: {currentWalletTokenBalance} {_.get(tokenInfo, 'token.symbol', '')}
                </Typography>
              </Stack>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                {...field}
                row
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto auto auto auto',
                  width: '100%',
                  columnGap: 1,
                }}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  handleChangeAmountIn(e.target.value);
                }}
              >
                <Box
                  height={30}
                  borderRadius={pxToRem(4)}
                  sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
                >
                  <FormControlLabel
                    value={100}
                    disabled={currentWalletTokenBalance <= 0}
                    control={<Radio size={'small'} />}
                    label="100%"
                  />
                </Box>
                <Box
                  height={30}
                  borderRadius={pxToRem(4)}
                  sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
                >
                  <FormControlLabel
                    value={75}
                    disabled={currentWalletTokenBalance <= 0}
                    control={<Radio size={'small'} />}
                    label="75%"
                  />
                </Box>
                <Box
                  height={30}
                  borderRadius={pxToRem(4)}
                  sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
                >
                  <FormControlLabel
                    value={50}
                    disabled={currentWalletTokenBalance <= 0}
                    control={<Radio size={'small'} />}
                    label="50%"
                  />
                </Box>
                <Box
                  height={30}
                  borderRadius={pxToRem(4)}
                  sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
                >
                  <FormControlLabel
                    value={25}
                    disabled={currentWalletTokenBalance <= 0}
                    control={<Radio size={'small'} />}
                    label="25%"
                  />
                </Box>
              </RadioGroup>
              <Stack
                direction={'row'}
                sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
                width={1}
                height={39}
                borderRadius={pxToRem(6)}
                justifyContent={'center'}
                alignItems={'center'}
                mt={1}
              >
                <Stack
                  px={2}
                  height={1}
                  justifyContent={'center'}
                  alignItems={'center'}
                  sx={(theme) => ({ borderRight: `1px solid ${theme.palette.border.dark}` })}
                >
                  <Typography variant={'body2'} color={'common.white'} sx={{ opacity: 0.6 }}>
                    %
                  </Typography>
                </Stack>

                <Box flex={1} height={1}>
                  <TextField
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleChangeAmountIn(e.target.value);
                    }}
                    inputProps={{
                      min: 1,
                      max: 100,
                    }}
                    disabled={currentWalletTokenBalance <= 0}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || ''}
                    type={'number'}
                    fullWidth
                    placeholder={'Custom, i.e 50'}
                  />
                </Box>
              </Stack>
            </FormControl>
          );
        }}
      />
      <Controller
        name="amountOut"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <FormControl fullWidth>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant={'body2'}>Receive</Typography>
              </Stack>
              <Stack
                direction={'row'}
                sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
                width={1}
                height={39}
                borderRadius={pxToRem(6)}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Stack
                  px={2}
                  height={1}
                  justifyContent={'center'}
                  alignItems={'center'}
                  sx={(theme) => ({ borderRight: `1px solid ${theme.palette.border.dark}` })}
                >
                  <Typography variant={'body2'} color={'common.white'} sx={{ opacity: 0.6 }}>
                    {NETWORK_CONFIG?.NATIVE_CURRENCY}
                  </Typography>
                </Stack>

                <Box flex={1} height={1}>
                  <TextField
                    {...field}
                    fullWidth
                    placeholder={'Custom Amount'}
                    disabled
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || ''}
                    value={field.value}
                  />
                </Box>
              </Stack>
            </FormControl>
          );
        }}
      />
      <Box
        width={1}
        borderRadius={pxToRem(6)}
        sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
      >
        <Stack
          direction={'row'}
          width={1}
          height={30}
          px={1}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={1}
          sx={{ cursor: 'pointer' }}
          onClick={() => setOpenAdvanced(!openAdvanced)}
        >
          <Box width={14} height={14}>
            <img src={images.iconSettingDark} alt="" width={'100%'} height={'100%'} />
          </Box>
          <Typography
            textAlign={'left'}
            variant={'body2'}
            color={'common.white'}
            sx={{ opacity: 0.8, flex: 1 }}
          >
            Advanced
          </Typography>
          <Box
            width={14}
            height={14}
            sx={{
              transform: openAdvanced ? 'rotate(-180deg)' : 'rotate(0deg)',
              transition: 'all 0.3s',
            }}
          >
            <img src={images.iconAccordion} alt="" width={'100%'} height={'100%'} />
          </Box>
        </Stack>
        <Box
          component={motion.div}
          initial={false}
          variants={variantsAdvancedForm}
          animate={openAdvanced ? 'show' : 'hide'}
          transition={{ delay: 0.2 }}
        >
          <Divider sx={{ height: 2 }} />
          <Stack gap={pxToRem(8)} px={pxToRem(12)} pt={pxToRem(12)} pb={pxToRem(15)}>
            <Box width={1}>
              <Controller
                name={'isDefaultAdvanced'}
                control={control}
                render={({ field }) => {
                  return (
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                      <Typography variant={'body2'} color={'common.white'} sx={{ opacity: 0.8 }}>
                        Slippage
                      </Typography>
                      <FormControlLabel
                        sx={{ fontSize: 14, gap: 0.5, opacity: 0.8 }}
                        labelPlacement={'start'}
                        checked={field.value}
                        onChange={field.onChange}
                        control={<Checkbox />}
                        label={'Default'}
                      />
                    </Stack>
                  );
                }}
              />
              <Controller
                name="slippage"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <FormControl fullWidth>
                      <Stack
                        direction={'row'}
                        sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
                        width={1}
                        height={39}
                        borderRadius={pxToRem(6)}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <TextField
                          {...field}
                          fullWidth
                          placeholder={'Slippage'}
                          disabled={getValues('isDefaultAdvanced')}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message || ''}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography
                                  variant={'body2'}
                                  color={'common.white'}
                                  sx={{ opacity: 0.6 }}
                                >
                                  %
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Stack>
                    </FormControl>
                  );
                }}
              />
            </Box>
            <Controller
              name="gas"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <FormControl fullWidth>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                      <Typography variant={'body2'}>Gas</Typography>
                    </Stack>
                    <Stack
                      direction={'row'}
                      sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
                      width={1}
                      height={39}
                      borderRadius={pxToRem(6)}
                      justifyContent={'center'}
                      alignItems={'center'}
                      overflow={'hidden'}
                    >
                      {DEFAULT_GAS.map((item) => {
                        return (
                          <Stack
                            key={item.id}
                            px={1}
                            height={1}
                            justifyContent={'center'}
                            alignItems={'center'}
                            sx={(theme) => ({
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              borderRight: `1px solid ${theme.palette.border.dark}`,
                              background:
                                field.value === item.value
                                  ? theme.functions.rgba(theme.palette.background.lighter, 0.3)
                                  : theme.palette.common.transparent,
                            })}
                            onClick={() => {
                              if (isDefaultAdvanced) {
                                return;
                              }
                              handleChangeGas(item.value);
                            }}
                          >
                            <Typography
                              variant={'body2'}
                              color={
                                field.value === item.value ? 'background.lighter' : 'common.white'
                              }
                              sx={{ opacity: 0.6 }}
                            >
                              {item.label}
                            </Typography>
                          </Stack>
                        );
                      })}

                      <Box flex={1} height={1}>
                        <TextField
                          {...field}
                          fullWidth
                          disabled={isDefaultAdvanced}
                          placeholder={'Custom'}
                          inputMode={'numeric'}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message || ''}
                          type={'number'}
                        />
                      </Box>
                    </Stack>
                  </FormControl>
                );
              }}
            />
            <Grid container>
              <Grid item xs={6}>
                <Controller
                  name={'isSimulationEnabled'}
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControlLabel
                        value={field.value}
                        {...field}
                        checked={field.value}
                        control={<Switch />}
                        sx={(theme) => ({
                          fontSize: 14,
                          '& .Mui-disabled': {
                            color: `${theme.palette.common.white} !important`,
                          },
                        })}
                        disabled={isDefaultAdvanced}
                        label="Simulation"
                        labelPlacement="end"
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name={'isMevEnabled'}
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControlLabel
                        value={field.value}
                        {...field}
                        checked={field.value}
                        disabled={isDefaultAdvanced}
                        control={<Switch />}
                        label="Anti-MEV"
                        sx={(theme) => ({
                          fontSize: 14,
                          '& .Mui-disabled': {
                            color: `${theme.palette.common.white} !important`,
                          },
                        })}
                        labelPlacement="end"
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Box>
      <Button
        disabled={isSubmitting || isLoadingSwapRoute || isLoading || isLoadingBalance}
        variant={'soft'}
        color={'success'}
        size={'large'}
        type={'submit'}
      >
        {isSubmitting || isLoadingSwapRoute || isLoading ? (
          <CircularProgress color={'primary'} size={24} />
        ) : (
          'Trade'
        )}
      </Button>
    </Stack>
  );
};
