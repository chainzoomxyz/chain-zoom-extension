import React, { useState } from 'react';
import { Box, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useSearchToken } from '@/hooks';
import { debouncedTyping } from '@/utils/debunce-typing';
import { images } from '@/utils/images';
import _ from 'lodash';
import { pxToRem } from '@/theme/foundations';
import { formatBalance, formatSymbolCurrency } from '@/utils/helper';
import { motion } from 'framer-motion';
import { getTokenInfoOverview } from '@/services/chainzoomApi';

export const PopupContent = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(keyword);
  const { data: tokens, isFetching } = useSearchToken({ q: keyword });
  const handleChange = (value: string) => {
    setSearchTerm(value);
    debouncedTyping(value, setKeyword);
  };
  return (
    <Stack
      width={330}
      height={600}
      overflow={'hidden'}
      bgcolor={'primary.main'}
      position={'relative'}
    >
      <Box width={235} height={238} position={'absolute'} zIndex={1} top={0} left={0}>
        <img src={images.popupTop} alt="" />
      </Box>
      <Box width={332} height={266} position={'absolute'} zIndex={1} right={0} bottom={0}>
        <img src={images.popupBottom} alt="" />
      </Box>
      <Stack width={1} height={1} px={pxToRem(20)} position={'absolute'} zIndex={2}>
        <Stack
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={2}
          px={pxToRem(10)}
          mt={pxToRem(30)}
        >
          <Box width={66} height={99}>
            <img src={images.logoUnion} alt="" width={'100%'} height={'100%'} />
          </Box>
          <Typography fontSize={27} sx={{ flex: 1 }} fontWeight={'bold'} color={'common.white'}>
            The 1st Degen Layer on X
          </Typography>
        </Stack>
        <Box width={1} height={52} mt={pxToRem(24)}>
          <Box
            width={1}
            height={52}
            borderRadius={pxToRem(13)}
            border={(theme) => `1px solid ${theme.palette.border.darker}`}
            bgcolor={'#1E2736'}
          >
            <TextField
              sx={(theme) => ({
                height: 1,
                '& .MuiInputBase-input::placeholder': {
                  color: theme.palette.border.darker,
                  fontSize: 18,
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.border.darker,
                  fontSize: 18,
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box width={16} height={16}>
                      <img src={images.iconSearch} alt="" width={'100%'} height={'100%'} />
                    </Box>
                  </InputAdornment>
                ),
              }}
              type={'text'}
              value={searchTerm}
              onChange={(e) => {
                handleChange(e?.target?.value);
              }}
              placeholder={'Search'}
            />
          </Box>
        </Box>
        <Stack mt={pxToRem(12)} maxHeight={355} flex={1}>
          <Box height={1} width={1} overflow={'auto'}>
            {keyword &&
              tokens &&
              tokens.map((token: any, index: number) => {
                return <SearchItem key={index} token={token} />;
              })}
            {keyword && _.isEmpty(tokens) && !isFetching && (
              <Stack
                width={1}
                height={1}
                gap={1}
                direction={'row'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Box width={24} height={24}>
                  <img src={images.notFoundToken} alt="" />
                </Box>
                <Typography variant={'body2'} color={'common.white'}>
                  Sorry, We can't find information you want
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};
const SearchItem = ({ token }: { token: any }) => {
  const countZeroInPrice =
    _.get(token, 'priceUsd', 0) > 0
      ? -Math.floor(Math.log(_.get(token, 'priceUsd', 0)) / Math.log(10) + 1)
      : 0;
  const [isHovered, setHovered] = useState(false);

  const handleClick = async () => {
    try {
      const response = await getTokenInfoOverview(_.get(token, 'baseToken.address', ''));
      if (_.get(response, 'socials.twitter', '')) {
        window.open(`https://twitter.com/${_.get(response, 'socials.twitter', '')}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Stack
      component={motion.div}
      mb={pxToRem(4)}
      direction={'row'}
      height={55}
      width={1}
      alignItems={'center'}
      borderRadius={pxToRem(8)}
      justifyContent={'center'}
      p={pxToRem(1)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={(theme) => ({
        background: isHovered
          ? theme.palette.background.popoverGradient
          : theme.palette.common.transparent,
        cursor: 'pointer',
      })}
      onClick={() => handleClick()}
    >
      <Stack
        alignItems={'center'}
        gap={1}
        px={pxToRem(8)}
        direction={'row'}
        width={1}
        height={1}
        borderRadius={pxToRem(8)}
        sx={(theme) => ({
          background: isHovered
            ? theme.palette.background.default
            : theme.palette.common.transparent,
        })}
      >
        <Box width={25} height={25} borderRadius={'50%'} overflow={'hidden'}>
          <img src={images.iconEthereum} alt="" />
        </Box>
        <Stack flex={1} height={1} justifyContent={'center'}>
          <Stack direction={'row'} gap={0.5} alignItems={'center'}>
            <Typography variant={'body1'} color={'common.white'}>
              {_.get(token, 'baseToken.name', '')}
            </Typography>
            <Typography variant={'body1'} color={'common.white'}>
              ({_.get(token, 'baseToken.symbol', '')})
            </Typography>
          </Stack>
          <Stack width={1} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            {countZeroInPrice > 4 ? (
              <Stack direction={'row'} alignItems={'center'}>
                <Typography variant={'body1'} color={'background.lighter'}>
                  ${_.get(token, 'priceUsd', 0).substring(0, 2)}0
                </Typography>
                <Typography mt={pxToRem(10)} fontSize={10} color={'background.lighter'}>
                  {countZeroInPrice}
                </Typography>
                <Typography variant={'body1'} color={'background.lighter'}>
                  {_.get(token, 'priceUsd', 0).substring(countZeroInPrice + 2)}
                </Typography>
              </Stack>
            ) : (
              <Typography variant={'body1'} color={'background.lighter'}>
                ${formatBalance(_.get(token, 'priceUsd', 0), 6)}
              </Typography>
            )}
            <Stack direction={'row'} gap={0.5}>
              <Typography variant={'body2'} color={'text.secondary'}>
                Liquidity:
              </Typography>
              <Typography variant={'body2'} color={'common.white'}>
                ${formatSymbolCurrency(_.get(token, 'liquidity.usd', 0), 0)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
