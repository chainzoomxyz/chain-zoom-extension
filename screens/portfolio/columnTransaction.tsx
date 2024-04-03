import { createColumnHelper } from '@tanstack/react-table';
import { copyToClipboard, formatAddress, roundBalance } from '@/utils/helper';
import { TextHeader } from '@/components/Typo/TextHeader';
import { TextRow } from '@/components/Typo/TextRow';
import type { PortfolioTransaction } from '@/types';
import { Box, Typography } from '@mui/material';
import { icons } from '@/utils/icons';
import { ethers } from 'ethers';
import moment from 'moment';
import { WALLET_ACTIONS } from '@/utils/wallet';

const columnHelper = createColumnHelper<PortfolioTransaction>();

export const columnTransaction = () => {
  return [
    columnHelper.accessor('tnxHash', {
      header: () => <TextHeader first>{'Tnx Hash'}</TextHeader>,
      cell: (info) => {
        return (
          <div
            style={{
              minWidth: 125,
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
              columnGap: '4px',
            }}
          >
            <TextRow customStyle={{ color: '#fff' }} first>
              {formatAddress(info.getValue())}
            </TextRow>
            <Box
              width={12}
              height={12}
              sx={{ cursor: 'pointer' }}
              onClick={() => copyToClipboard(info.getValue())}
            >
              <img src={icons.copyIcon} alt="" />
            </Box>
          </div>
        );
      },
    }),
    columnHelper.accessor('action', {
      cell: (info) => (
        <div style={{ minWidth: 100, flexDirection: 'row', display: 'flex', columnGap: '4px' }}>
          <TextRow first>
            <Typography
              variant={'body2'}
              color={info.getValue() === WALLET_ACTIONS.BUY ? '#78FFCE' : '#F23645'}
              fontWeight={'bold'}
            >
              {info.getValue().toUpperCase()}
            </Typography>
          </TextRow>
        </div>
      ),
      header: () => <TextHeader>{'Action'}</TextHeader>,
    }),
    columnHelper.accessor('createdAt', {
      cell: (info) => {
        const date = moment(info.getValue()).format('YYYY-MM-DD HH:mm:ss');
        return (
          <div style={{ minWidth: 100, flexDirection: 'row', display: 'flex', columnGap: '4px' }}>
            <TextRow>{date}</TextRow>
          </div>
        );
      },
      header: () => <TextHeader>{'Time'}</TextHeader>,
    }),
    columnHelper.accessor('value', {
      cell: (info) => (
        <div style={{ minWidth: 100, flexDirection: 'row', display: 'flex', columnGap: '4px' }}>
          <TextRow>
            {roundBalance(parseFloat(ethers.utils.formatUnits(info.getValue())), 2)}
          </TextRow>
        </div>
      ),
      header: () => <TextHeader>{'Balance'}</TextHeader>,
    }),
    columnHelper.accessor('tokenAddress', {
      cell: (info) => (
        <div
          style={{
            minWidth: 75,
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
            columnGap: '4px',
          }}
        >
          <TextRow>{formatAddress(info.getValue())}</TextRow>
          <Box
            width={12}
            height={12}
            sx={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard(info.getValue())}
          >
            <img src={icons.copyIcon} alt="" />
          </Box>
        </div>
      ),
      header: () => <TextHeader>{'Token Address'}</TextHeader>,
    }),
    columnHelper.accessor('priceUsd', {
      cell: (info) => (
        <div
          style={{
            minWidth: 100,
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: 12,
          }}
        >
          <div style={{ minWidth: 75, flexDirection: 'row', display: 'flex', columnGap: '4px' }}>
            <TextRow>${roundBalance(parseFloat(info.getValue()), 4)}</TextRow>
          </div>
        </div>
      ),
      header: () => <TextHeader last>{'USD'}</TextHeader>,
    }),
  ];
};
