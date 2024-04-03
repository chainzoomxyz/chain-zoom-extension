import { linearGradient, pxToRem, rgba } from '@/theme/foundations';
import { Box, InputAdornment, Popover, Stack, TextField, Typography } from '@mui/material';
import { images } from '@/utils/images';
import React, { useState } from 'react';
import { useSearchToken } from '@/hooks';
import { debouncedTyping } from '@/utils/debunce-typing';
import _ from 'lodash';
import { formatAddress, formatBalance, formatSymbolCurrency } from '@/utils/helper';
import stc from 'string-to-color';
import { tokenStore } from '@/store/TokenStore';

export const Search = () => {
  const { setTokenAddress, setChainId } = tokenStore;
  const [keyword, setKeyword] = useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>(keyword);

  const { data: tokens } = useSearchToken({ q: keyword });

  const handleChange = (value: string) => {
    setSearchTerm(value);
    debouncedTyping(value, setKeyword);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const selectToken = (tokenAddress: string) => {
    setTokenAddress(tokenAddress);
    setChainId(1);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'search-popover' : undefined;
  return (
    <>
      <Stack
        width={190}
        height={1}
        borderRadius={pxToRem(14)}
        sx={(theme) => ({ border: `1px solid ${theme.palette.border.darker}` })}
        justifyContent={'center'}
        position={'relative'}
        onClick={handleClick}
      >
        <TextField
          sx={{
            height: 1,
            '& .MuiInputBase-input::placeholder': (theme) => ({ color: theme.palette.text.dark }),
          }}
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
      </Stack>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        id={id}
        anchorEl={anchorEl}
        open={open}
        sx={{ zIndex: 10000 }}
        onClose={handleClose}
        disableAutoFocus
      >
        <Stack
          mt={1}
          borderRadius={pxToRem(14)}
          width={480}
          p={'1px'}
          minHeight={68}
          maxHeight={340}
          sx={(theme) => ({
            boxShadow: `2px 4px 6px 0px ${theme.palette.boxShadow.main}`,
            background: theme.palette.background.popoverGradient,
          })}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Stack
            gap={0.5}
            bgcolor={'background.default'}
            width={1}
            flex={1}
            borderRadius={pxToRem(14)}
            position={'relative'}
            p={0.5}
            overflow={'auto'}
          >
            {!_.isEmpty(tokens) ? (
              tokens.map((token: any, index: number) => {
                return <SearchItem key={index} token={token} onClick={selectToken} />;
              })
            ) : (
              <Stack
                width={1}
                flex={1}
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
          </Stack>
        </Stack>
      </Popover>
    </>
  );
};

type SearchItemProps = {
  token: any;
  onClick: (tokenAddress: string) => void;
};

const SearchItem = ({ token, onClick }: SearchItemProps) => {
  const countZeroInPrice =
    _.get(token, 'priceUsd', 0) > 0
      ? -Math.floor(Math.log(_.get(token, 'priceUsd', 0)) / Math.log(10) + 1)
      : 0;
  return (
    <Stack
      alignItems={'center'}
      bgcolor={'primary.main'}
      borderRadius={pxToRem(8)}
      direction={'row'}
      width={1}
      height={60}
      gap={pxToRem(12)}
      px={2}
      sx={{ cursor: 'pointer' }}
      onClick={() => onClick(_.get(token, 'baseToken.address', ''))}
    >
      <Box width={37} height={37} borderRadius={'50%'} position={'relative'}>
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={'50%'}
          width={12}
          height={12}
          position={'absolute'}
          top={0}
          right={0}
          overflow={'hidden'}
        >
          <img
            src={images.iconEthereum}
            width={'100%'}
            height={'100%'}
            style={{ objectFit: 'contain' }}
            alt=""
          />
        </Stack>
        {_.get(token, 'info.imageUrl', '') ? (
          <Box width={1} height={1} borderRadius={'50%'} overflow={'hidden'}>
            <img src={_.get(token, 'info.imageUrl', '')} alt="" />
          </Box>
        ) : (
          <Box
            width={1}
            height={1}
            borderRadius={'50%'}
            overflow={'hidden'}
            sx={{
              background: linearGradient(
                rgba(stc(_.get(token, 'baseToken.name', '')), 1),
                rgba(stc(_.get(token, 'baseToken.name', '')), 0),
              ),
            }}
          />
        )}
      </Box>
      <Stack flex={1} height={1} justifyContent={'center'}>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Stack direction={'row'} gap={0.5}>
            <Typography variant={'body1'} color={'common.white'}>
              {_.get(token, 'baseToken.name', '')}
            </Typography>
            <Typography variant={'body1'} color={'common.white'}>
              ({_.get(token, 'baseToken.symbol', '')})
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={0.5}>
            <Typography variant={'body1'} color={'common.white'} sx={{ opacity: 0.6 }}>
              CA:
            </Typography>
            <Typography variant={'body1'} color={'common.white'} sx={{ opacity: 0.6 }}>
              {formatAddress(_.get(token, 'baseToken.address', ''))}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          {countZeroInPrice > 4 ? (
            <Stack direction={'row'} alignItems={'center'}>
              <Typography variant={'h4'}>
                ${_.get(token, 'priceUsd', 0).substring(0, 2)}0
              </Typography>
              <Typography mt={pxToRem(10)} fontSize={10} color={'common.white'}>
                {countZeroInPrice}
              </Typography>
              <Typography variant={'h4'}>
                {_.get(token, 'priceUsd', 0).substring(countZeroInPrice + 2)}
              </Typography>
            </Stack>
          ) : (
            <Typography variant={'h4'}>${formatBalance(_.get(token, 'priceUsd', 0), 6)}</Typography>
          )}
          <Stack direction={'row'} gap={0.5}>
            <Typography variant={'body2'} color={'text.secondary'}>
              Liquidity:
            </Typography>
            <Typography variant={'body2'} color={'common.white'}>
              ${formatSymbolCurrency(_.get(token, 'liquidity.usd', 0), 0)}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={0.5}>
            <Typography variant={'body2'} color={'text.secondary'}>
              24H Vol:
            </Typography>
            <Typography variant={'body2'} color={'common.white'}>
              ${formatSymbolCurrency(_.get(token, 'volume.h24', 0), 0)}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={0.5}>
            <Typography variant={'body2'} color={'text.secondary'}>
              FDV:
            </Typography>
            <Typography variant={'body2'} color={'common.white'}>
              ${formatSymbolCurrency(_.get(token, 'fdv', 0), 0)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
