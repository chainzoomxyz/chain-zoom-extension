import React, { type SetStateAction } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { images } from '@/utils/images';

type PaginationTransactionProps = {
  page: number;
  totalPage: number;
  setPage: React.Dispatch<SetStateAction<number>>;
  isFetching: boolean;
};

export const PaginationTransaction = ({
  page,
  totalPage,
  setPage,
  isFetching,
}: PaginationTransactionProps) => {
  return (
    <Stack ml={'auto'} direction={'row'} gap={0.5} justifyContent={'center'} alignItems={'center'}>
      <Box
        onClick={() => !isFetching && page > 1 && setPage((prevState) => prevState - 1)}
        width={24}
        height={24}
      >
        <img
          src={page === 1 ? images.leftDisable : images.rightEnable}
          alt=""
          width={'100%'}
          height={'100%'}
          style={{
            cursor: 'pointer',
            objectFit: 'none',
            transform: page === 1 ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
        />
      </Box>
      <Typography variant={'body2'} color={'common.white'}>
        {page}/{totalPage}
      </Typography>
      <Box
        onClick={() => !isFetching && page < totalPage && setPage((prevState) => prevState + 1)}
        width={24}
        height={24}
      >
        <img
          src={page === totalPage ? images.leftDisable : images.rightEnable}
          alt=""
          width={'100%'}
          height={'100%'}
          style={{
            cursor: 'pointer',
            objectFit: 'none',
            transform: page === totalPage ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </Box>
    </Stack>
  );
};
