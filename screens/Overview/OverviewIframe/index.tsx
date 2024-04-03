import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import { useTokenContext } from '@/providers/TokenProvider';
import { useNetWorkContext } from '@/providers/NetworkProvider';

export const OverviewIframe = () => {
  const { NETWORK_CONFIG } = useNetWorkContext();
  const { tokenAddress } = useTokenContext();
  console.log('🚀 ~ lamnn ~ OverviewIframe ~ chainName:', NETWORK_CONFIG.NETWORK);
  console.log('🚀 ~ lamnn ~ OverviewIframe ~ tokenAddress:', tokenAddress);
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + 1);
  }, [tokenAddress]);

  return (
    <Box height={1} bgcolor={'background.default'} position={'relative'} borderRadius={pxToRem(14)}>
      <Box width={1} height={1} id="dexscreener-embed">
        <iframe
          key={count}
          frameBorder={0}
          width={'100%'}
          height={'100%'}
          src={`https://dexscreener.com/${NETWORK_CONFIG.NETWORK}/${tokenAddress}?embed=1&theme=dark&trades=0&info=0`}
        />
      </Box>
      {/*<Stack*/}
      {/*  direction={'row'}*/}
      {/*  justifyContent={'center'}*/}
      {/*  alignItems={'center'}*/}
      {/*  gap={1}*/}
      {/*  position={'absolute'}*/}
      {/*  bgcolor={'common.black'}*/}
      {/*  bottom={2}*/}
      {/*  left={2}*/}
      {/*  height={38}*/}
      {/*  zIndex={1000}*/}
      {/*  width={'calc(100% - 4px)'}*/}
      {/*>*/}
      {/*  <Box width={24} height={24}>*/}
      {/*    <img src={images.logoGradient} alt="" width={'100%'} height={'100%'} />*/}
      {/*  </Box>*/}
      {/*  <Box*/}
      {/*    sx={(theme) => ({*/}
      {/*      background: theme.palette.background.gradient,*/}
      {/*      backgroundClip: 'text',*/}
      {/*      webkitBackgroundClip: 'text',*/}
      {/*      webkitTextFillColor: 'transparent',*/}
      {/*      color: 'transparent',*/}
      {/*      fontSize: 20,*/}
      {/*      fontWeight: 'bold',*/}
      {/*      mt: pxToRem(6),*/}
      {/*    })}*/}
      {/*  >*/}
      {/*    Chainzoom*/}
      {/*  </Box>*/}
      {/*</Stack>*/}
    </Box>
  );
};
