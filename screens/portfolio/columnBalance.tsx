import { createColumnHelper } from '@tanstack/react-table';
import { isEmpty } from 'lodash';
import { roundBalance, substringAddress } from '@/utils/helper';
import { TextHeader } from '@/components/Typo/TextHeader';
import { TextRow } from '@/components/Typo/TextRow';
import { TextPrice } from '@/components/Typo/TextPrice';
import type { PortfolioBalance } from '@/types';
import { Box, Typography } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import { Popup } from './Portfolio';
import React, { type SetStateAction } from 'react';

const columnHelper = createColumnHelper<PortfolioBalance>();

export const columnBalance = (
  openPopup: (popup: Popup) => void,
  setWithdrawData: React.Dispatch<SetStateAction<PortfolioBalance | null>>,
) => {
  return [
    columnHelper.accessor('name', {
      header: () => <TextHeader first>{'Token'}</TextHeader>,
      cell: (info) => {
        const label = info.row.original?.name;
        const hasLabel = !isEmpty(label) && label !== 'nan';
        const address = info.getValue();
        return (
          <div style={{ minWidth: 125, flexDirection: 'row', display: 'flex', columnGap: '4px' }}>
            <TextRow customStyle={{ color: '#fff' }} first>
              {hasLabel ? label : substringAddress(address as `0x${string}`, 5, 5)}
            </TextRow>
          </div>
        );
      },
    }),
    columnHelper.accessor('price', {
      cell: (info) => (
        <div style={{ minWidth: 100, flexDirection: 'row', display: 'flex', columnGap: '4px' }}>
          <TextPrice last value={`${info.getValue()}`} dollarSign />
        </div>
      ),
      header: () => <TextHeader>{'Price'}</TextHeader>,
    }),
    columnHelper.accessor('balance', {
      cell: (info) => (
        <div style={{ minWidth: 100, flexDirection: 'row', display: 'flex', columnGap: '4px' }}>
          <TextRow>{roundBalance(parseFloat(info.getValue()), 5)}</TextRow>
        </div>
      ),
      header: () => <TextHeader>{'Balance'}</TextHeader>,
    }),
    columnHelper.accessor('value', {
      cell: (info) => (
        <div style={{ minWidth: 75, flexDirection: 'row', display: 'flex', columnGap: '4px' }}>
          <TextRow>${roundBalance(parseFloat(info.getValue()), 5)}</TextRow>
        </div>
      ),
      header: () => <TextHeader>{'Value'}</TextHeader>,
    }),
    columnHelper.accessor('id', {
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
          <Box
            onClick={() => {
              setWithdrawData(info.row.original);
              openPopup(Popup.WITHDRAW);
            }}
            sx={{
              width: 94,
              height: 29,
              borderRadius: 10,
              background: '#364157',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <Typography
              fontSize={pxToRem(14)}
              fontStyle={pxToRem(14)}
              fontWeight={'600'}
              color={'#fff'}
            >
              Withdraw
            </Typography>
          </Box>
        </div>
      ),
      header: () => <TextHeader last>{''}</TextHeader>,
    }),
  ];
};
