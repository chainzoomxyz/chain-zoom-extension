import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { columnBalance } from './columnBalance';
import { Stack, Typography } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import React, { type CSSProperties, type SetStateAction, useMemo, useState } from 'react';
import type { Popup } from './Portfolio';
import { columnTransaction } from '@/screens/portfolio/columnTransaction';
import { PaginationTransaction } from '@/components/Pagination/PaginationTransaction';
import { Loading } from '@/components/Loading';

enum PORTFOLIO_TAB {
  BALANCE = 0,
  TRANSACTIONS = 1,
}

type PortfolioTableProps = {
  openPopup: (popup: Popup) => void;
  tokenBalances: any;
  walletTransactions: any;
  setWithdrawData: React.Dispatch<SetStateAction<any>>;
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
  maxPage: number;
  isFetchingBalances: boolean;
  isFetchingTransactions: boolean;
};
export const PortfolioTable = (props: PortfolioTableProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(PORTFOLIO_TAB.BALANCE);

  const table = useReactTable({
    data:
      activeTabIndex === PORTFOLIO_TAB.TRANSACTIONS
        ? props.walletTransactions
        : props.tokenBalances,
    // @ts-ignore
    columns:
      activeTabIndex === PORTFOLIO_TAB.TRANSACTIONS
        ? columnTransaction()
        : columnBalance(props.openPopup, props.setWithdrawData),
    getCoreRowModel: getCoreRowModel(),
  });

  const renderHeader = useMemo(() => {
    return (
      <Stack
        direction={'row'}
        gap={pxToRem(24)}
        sx={{
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          background: '#2C3849',
          height: 37,
          px: pxToRem(12),
        }}
      >
        <Stack
          sx={{
            cursor: 'pointer',
            borderBottomWidth: activeTabIndex === PORTFOLIO_TAB.BALANCE ? pxToRem(1) : 0,
            borderBottomColor: '#fff',
            borderBottomStyle: 'solid',
            py: pxToRem(6),
            mt: pxToRem(4),
          }}
          onClick={() => setActiveTabIndex(PORTFOLIO_TAB.BALANCE)}
        >
          <Typography
            fontSize={pxToRem(14)}
            fontWeight={'600'}
            color={activeTabIndex === PORTFOLIO_TAB.BALANCE ? '#fff' : '#6D7182'}
          >
            Balance
          </Typography>
        </Stack>
        <Stack
          sx={{
            cursor: 'pointer',
            borderBottomWidth: activeTabIndex === PORTFOLIO_TAB.TRANSACTIONS ? pxToRem(1) : 0,
            borderBottomColor: '#fff',
            borderBottomStyle: 'solid',
            py: pxToRem(6),
            mt: pxToRem(4),
          }}
          onClick={() => setActiveTabIndex(PORTFOLIO_TAB.TRANSACTIONS)}
        >
          <Typography
            fontSize={pxToRem(14)}
            fontWeight={'600'}
            color={activeTabIndex === PORTFOLIO_TAB.TRANSACTIONS ? '#fff' : '#6D7182'}
          >
            Transactions
          </Typography>
        </Stack>
        {activeTabIndex === PORTFOLIO_TAB.TRANSACTIONS && (
          <PaginationTransaction
            page={props.page}
            totalPage={props.maxPage}
            setPage={props.setPage}
            isFetching={props.isFetchingTransactions}
          />
        )}
      </Stack>
    );
  }, [activeTabIndex, props.page, props.maxPage, props.isFetchingTransactions]);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#2C3849',
        borderRadius: 12,
      }}
    >
      {renderHeader}
      <table style={{ width: '100%', ...styles.table }}>
        <thead style={{ backgroundColor: '#405066', height: 34, textAlign: 'left' }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr style={{ textAlign: 'left' }} key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {(activeTabIndex === PORTFOLIO_TAB.BALANCE && props.isFetchingBalances) ||
          (activeTabIndex === PORTFOLIO_TAB.TRANSACTIONS && props.isFetchingTransactions) ? (
            <tr>
              <td colSpan={100}>
                <Stack width={1} height={300} justifyContent={'center'} alignItems={'center'}>
                  <Loading width={40} height={40} />
                </Stack>
              </td>
            </tr>
          ) : (
            <>
              {table.getRowModel().rows.map((row) => {
                const { index } = row;
                return (
                  <tr
                    style={{
                      ...styles.tr,
                      background: index % 2 === 0 ? '#2C3849' : 'rgba(64, 80, 102, 0.30)',
                    }}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  table: {
    backgroundColor: '#2C3849',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    borderSpacing: 0,
    borderCollapse: 'collapse',
  },
  tr: {
    borderBottom: '1px solid rgba(109, 113, 130, 0.60)',
    paddingRight: 12,
    paddingLeft: 12,
    // borderBottomColor: 'gray',
    // borderBottomWidth: 1,
    paddingTop: 4,
    paddingBottom: 4,
    height: 45,
  },
  footerContainer: {
    backgroundColor: '#405066',
    height: 24,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  footerContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  paginationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
