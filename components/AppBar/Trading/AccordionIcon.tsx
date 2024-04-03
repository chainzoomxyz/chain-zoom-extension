import { Box, Stack } from '@mui/material';
import { images } from '@/utils/images';
import React from 'react';

export const AccordionIcon = () => {
  return (
    <Stack justifyContent={'center'} alignItems={'center'} width={46} height={1}>
      <Box width={14} height={14}>
        <img src={images.iconAccordion} alt="" width={'100%'} height={'100%'} />
      </Box>
    </Stack>
  );
};
