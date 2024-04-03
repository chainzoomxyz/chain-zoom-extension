import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import { linearGradient, pxToRem, rgba } from '@/theme/foundations';
import { images } from '@/utils/images';
import React from 'react';
import { Loading } from '@/components/Loading';
import _ from 'lodash';
import {
  copyToClipboard,
  ellipsisString,
  formatAddress,
  formatBalance,
  formatSymbolCurrency,
  numberFormat,
  parseSafeJson,
  scientificToDecimal,
} from '@/utils/helper';
import { useMetaMask } from '@/providers/MetamaskProvider';
import stc from 'string-to-color';
import { useTokenContext } from '@/providers/TokenProvider';
import { ALERT_MESSAGES } from '@/utils/messages';
import { useAddVoteMutation, useRemoveVoteMutation, useVote } from '@/hooks';
import { MAX_LENGTH_SHOW_FULL_NAME, STORAGE_KEY } from '@/utils/constants';
import { Security } from '@/screens/Overview/OverviewHeader/Security';
import { useStorage } from '@plasmohq/storage/hook';
import { Storage } from '@plasmohq/storage';
import type { Pair } from '@/types/pair';
import { useNetWorkContext } from '@/providers/NetworkProvider';

export const OverviewHeader = () => {
  const { tokenInfo, isLoading: loading } = useTokenContext();
  const [pairInStorage] = useStorage(
    {
      key: STORAGE_KEY.OPEN_POPUP_TOKEN_INFO,
      instance: new Storage({
        area: 'local',
      }),
    },
    '{}',
  );

  const pair: Pair = parseSafeJson(pairInStorage);
  console.log('🚀 ~ lamnn ~ OverviewHeader ~ pair:', pair);
  const priceUsd = scientificToDecimal(_.get(tokenInfo, 'priceUSD', 0)).toString();
  const countZeroInPrice =
    parseFloat(priceUsd) > 0 ? -Math.floor(Math.log(parseFloat(priceUsd)) / Math.log(10) + 1) : 0;
  const { NETWORK_CONFIG } = useNetWorkContext();
  const { isConnected, wallet, setAlertMessage, setOpenAlert } = useMetaMask();

  const { data: votedData, isLoading: isLoadingVote } = useVote({
    tokenAddress: _.get(tokenInfo, 'token.address', ''),
  });

  const listWalletVoted = _.get(votedData, 'voters', []);

  const isVoted = listWalletVoted.includes(_.nth(_.get(wallet, 'accounts', [])));
  const marketCap = _.get(tokenInfo, 'fdv', 0);
  const tokenName = _.get(tokenInfo, 'token.name', '');

  const addVoteMutation = useAddVoteMutation();
  const removeVoteMutation = useRemoveVoteMutation();

  const handleVote = async () => {
    try {
      if (isVoted) {
        await removeVoteMutation
          .mutateAsync({
            tokenAddress: _.get(tokenInfo, 'token.address', ''),
          })
          .then(() => {
            setAlertMessage(ALERT_MESSAGES.REMOVE_VOTE_SUCCESS);
            setOpenAlert(true);
          });
      } else {
        await addVoteMutation
          .mutateAsync({ tokenAddress: _.get(tokenInfo, 'token.address', '') })
          .then(() => {
            setAlertMessage(ALERT_MESSAGES.ADD_VOTE_SUCCESS);
            setOpenAlert(true);
          });
      }
    } catch (e) {
      console.log('Error: ', e.response?.data);
      setAlertMessage(e.response?.data?.message ? e.response?.data?.message : e.response?.data);
      setOpenAlert(true);
    }
  };

  return (
    <Stack
      direction={'row'}
      height={82}
      px={1.5}
      py={1}
      bgcolor={'background.default'}
      sx={{ borderRadius: pxToRem(14) }}
      justifyContent={'space-between'}
      alignItems={'center'}
      flex={1}
    >
      {loading && <Loading width={50} height={50} />}
      {!loading && !_.isEmpty(tokenInfo) && (
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} flex={1}>
          {/* Token Name */}
          <Stack direction={'row'} gap={pxToRem(10)}>
            <Stack
              direction={'row'}
              width={66}
              height={1}
              borderRadius={'50%'}
              position={'relative'}
              mt={0.5}
            >
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'50%'}
                width={18}
                height={18}
                position={'absolute'}
                top={0}
                right={0}
                overflow={'hidden'}
              >
                <img
                  src={NETWORK_CONFIG.CHAIN_IMAGE_URL}
                  width={'100%'}
                  height={'100%'}
                  style={{ objectFit: 'contain' }}
                  alt=""
                />
              </Stack>
              <Box width={1} height={1} borderRadius={'50%'} overflow={'hidden'}>
                {_.get(tokenInfo, 'token.info.imageLargeUrl', null) && (
                  <img src={_.get(tokenInfo, 'token.info.imageLargeUrl', '')} alt="" />
                )}
                {!_.get(tokenInfo, 'token.info.imageLargeUrl', null) && (
                  <Box
                    width={1}
                    height={1}
                    sx={{
                      background: linearGradient(rgba(stc(tokenName), 1), rgba(stc(tokenName), 0)),
                    }}
                  />
                )}
              </Box>
            </Stack>
            <Stack direction={'column'} justifyContent={'space-evenly'}>
              <Stack direction={'row'} gap={1}>
                <Typography
                  noWrap
                  variant={'body1'}
                  sx={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                  color={'white'}
                  fontWeight={'bold'}
                >
                  {tokenName?.length > MAX_LENGTH_SHOW_FULL_NAME
                    ? ellipsisString(tokenName)
                    : tokenName}
                </Typography>
                <Typography
                  variant={'body1'}
                  color={'white'}
                  sx={{
                    opacity: 0.8,
                  }}
                >
                  {`(${_.get(tokenInfo, 'token.symbol', '')})`}
                </Typography>
              </Stack>
              <Stack
                onClick={() => {
                  setAlertMessage(ALERT_MESSAGES.COPY_TOKEN_ADDRESS_SUCCESS);
                  setOpenAlert(true);
                  copyToClipboard(_.get(tokenInfo, 'token.address', ''));
                }}
                sx={{ cursor: 'pointer' }}
                direction={'row'}
                gap={1}
                alignItems={'center'}
              >
                <Typography variant={'body2'} color={'white'} sx={{ opacity: 0.8 }}>
                  {formatAddress(_.get(tokenInfo, 'token.address', ''))}
                </Typography>
                <Box width={16} height={16}>
                  <img src={images.iconCopy} alt="" />
                </Box>
              </Stack>
              <Stack direction={'row'} gap={1.5}>
                <IconButton
                  sx={{ p: 0 }}
                  onClick={() => {
                    window.open(_.get(tokenInfo, 'socials.twitter', ''), '_blank');
                  }}
                >
                  <img src={images.iconTwitter} alt="" width={16} height={16} />
                </IconButton>
                <IconButton
                  sx={{ p: 0 }}
                  onClick={() => {
                    window.open(_.get(tokenInfo, 'socials.telegram', ''), '_blank');
                  }}
                >
                  <img src={images.iconTelegram} alt="" width={16} height={16} />
                </IconButton>
                <IconButton
                  sx={{ p: 0 }}
                  onClick={() => {
                    window.open(_.get(tokenInfo, 'socials.website', ''), '_blank');
                  }}
                >
                  <img src={images.iconWebsite} alt="" width={16} height={16} />
                </IconButton>
                {/*<Stack*/}
                {/*  width={35}*/}
                {/*  height={15}*/}
                {/*  borderRadius={pxToRem(5)}*/}
                {/*  justifyContent={'center'}*/}
                {/*  alignItems={'center'}*/}
                {/*  position={'relative'}*/}
                {/*  bgcolor={'common.white'}*/}
                {/*  ml={pxToRem(10)}*/}
                {/*>*/}
                {/*  <Typography color={'background.default'} fontSize={10} fontWeight={600}>*/}
                {/*    #24*/}
                {/*  </Typography>*/}
                {/*  <Box width={19} height={19} position={'absolute'} bottom={0} left={-10}>*/}
                {/*    <img src={images.iconFlame} alt="" />*/}
                {/*  </Box>*/}
                {/*</Stack>*/}
              </Stack>
            </Stack>
          </Stack>
          {/* Vote */}
          <Stack
            direction={'column'}
            alignItems={'flex-center'}
            gap={1.5}
            justifyContent={'space-between'}
          >
            <Stack direction={'row'} gap={1.5} alignItems={'center'}>
              <IconButton>
                <Box width={26} height={26}>
                  <img src={images.iconAlert} alt="" width={'100%'} height={'100%'} />
                </Box>
              </IconButton>
              <IconButton>
                <Box width={26} height={26}>
                  <img src={images.iconStar} alt="" width={'100%'} height={'100%'} />
                </Box>
              </IconButton>
              <Security />
            </Stack>
            <Button
              variant={isVoted ? 'gradient' : 'soft'}
              color={isVoted ? 'secondary' : 'info'}
              disabled={!isConnected || isLoadingVote}
              sx={{ width: 100, height: 26 }}
              onClick={() => handleVote()}
            >
              <Stack
                px={pxToRem(8)}
                direction={'row'}
                width={1}
                height={1}
                alignItems={'center'}
                gap={pxToRem(8)}
                justifyContent={'center'}
              >
                <Box width={17} height={17}>
                  <img src={images.iconLike} alt="" />
                </Box>
                <Typography variant={'body2'} color={'white'}>
                  Vote
                </Typography>
              </Stack>
            </Button>
          </Stack>
          {/* Price */}
          <Stack direction={'row'} alignItems={'center'} justifyContent={'flex-center'}>
            <Stack direction={'column'} justifyContent={'space-between'}>
              {countZeroInPrice > 4 ? (
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant={'h4'}>
                    $
                    {
                      // @ts-ignore
                      priceUsd.substring(0, 2)
                    }
                    0
                  </Typography>
                  <Typography mt={pxToRem(10)} fontSize={10} color={'common.white'}>
                    {countZeroInPrice}
                  </Typography>
                  <Typography variant={'h4'}>
                    {/*// @ts-ignore*/}
                    {/* làm tròn 6 số sau dãy số 0 */}
                    {priceUsd.substring(countZeroInPrice + 2, countZeroInPrice + 8)}
                  </Typography>
                </Stack>
              ) : (
                <Typography variant={'h4'}>
                  ${formatBalance(_.get(tokenInfo, 'priceUSD', 0), 10)}
                </Typography>
              )}
              <Stack direction={'row'} gap={2}>
                <Stack direction={'column'}>
                  <Typography color={'text.secondary'} variant={'body2'}>
                    24H VOLUME
                  </Typography>
                  <Typography color={'white'} variant={'body1'}>
                    ${formatSymbolCurrency(_.get(tokenInfo, 'volume24', 0), 3)}
                  </Typography>
                </Stack>
                {marketCap > 0 && (
                  <Stack direction={'column'}>
                    <Typography color={'text.secondary'} variant={'body2'}>
                      FDV
                    </Typography>
                    <Typography color={'white'} variant={'body1'}>
                      ${formatSymbolCurrency(marketCap, 0)}
                    </Typography>
                  </Stack>
                )}
                <Stack direction={'column'}>
                  <Typography color={'text.secondary'} variant={'body2'}>
                    Liquidity
                  </Typography>
                  <Typography color={'white'} variant={'body1'}>
                    ${formatSymbolCurrency(_.get(tokenInfo, 'liquidity', 0), 0)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          {/* Changed */}
          <Stack>
            <Box
              width={210}
              height={1}
              bgcolor={'primary.main'}
              borderRadius={pxToRem(14)}
              sx={(theme) => ({
                border: `1px solid ${theme.palette.primary.dark}`,
              })}
              px={pxToRem(20)}
              py={pxToRem(12)}
              flex={1}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Grid container>
                <Grid item xs={6}>
                  <Stack direction={'row'} gap={1}>
                    <Typography color={'text.secondary'} variant={'body2'}>
                      {'5M'}
                    </Typography>
                    <PricePercentChange percent={_.get(tokenInfo, 'change5m', 0)} />
                  </Stack>
                </Grid>
                <Grid item xs={6} pl={pxToRem(14)}>
                  <Stack direction={'row'} gap={1}>
                    <Typography color={'text.secondary'} variant={'body2'}>
                      {'1H'}
                    </Typography>
                    <PricePercentChange percent={_.get(tokenInfo, 'change1h', 0)} />
                  </Stack>
                </Grid>
                <Grid item xs={6} mt={pxToRem(8)}>
                  <Stack direction={'row'} gap={1}>
                    <Typography color={'text.secondary'} variant={'body2'}>
                      6H
                    </Typography>
                    <PricePercentChange percent={_.get(tokenInfo, 'change6h', 0)} />
                  </Stack>
                </Grid>
                <Grid item xs={6} mt={pxToRem(8)} pl={pxToRem(14)}>
                  <Stack direction={'row'} gap={1}>
                    <Typography color={'text.secondary'} variant={'body2'}>
                      24H
                    </Typography>
                    <PricePercentChange percent={_.get(tokenInfo, 'change24h', 0)} />
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

const PricePercentChange = ({ percent }: { percent: number }) => {
  return (
    <Typography color={percent >= 0 ? 'text.light' : 'error.main'} variant={'body2'}>
      {numberFormat(percent)}%
    </Typography>
  );
};
