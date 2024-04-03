import { images } from '@/utils/images';
import { Box, IconButton, Popover, Stack, Typography } from '@mui/material';
import React from 'react';
import { pxToRem } from '@/theme/foundations';
import { SECURITY, SECURITY_STATUS, SECURITY_TYPE } from '@/utils/security';
import { useTokenSecurity } from '@/hooks';
import { useTokenContext } from '@/providers/TokenProvider';
import _ from 'lodash';
import { roundBalance } from '@/utils/helper';
import { useNetWorkContext } from '@/providers/NetworkProvider';

export const Security = () => {
  const { tokenAddress } = useTokenContext();
  const { NETWORK_CONFIG } = useNetWorkContext();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const { data: security } = useTokenSecurity({
    token: tokenAddress,
    chain_name: NETWORK_CONFIG?.NETWORK,
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'security-popover' : undefined;

  return (
    <>
      <IconButton onClick={(e) => handleClick(e)}>
        <Box width={26} height={26}>
          <img
            src={anchorEl ? images.iconSecurityActive : images.iconCheck}
            alt=""
            width={'100%'}
            height={'100%'}
          />
        </Box>
      </IconButton>
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
        open={open}
        anchorEl={anchorEl}
        sx={{ zIndex: 10000 }}
        onClose={handleClose}
      >
        <Stack
          mt={1}
          borderRadius={pxToRem(14)}
          width={278}
          bgcolor={'background.default'}
          p={pxToRem(8)}
          border={(theme) => `1px solid ${theme.palette.border.dark}`}
        >
          {security && (
            <>
              <Typography variant={'h5'} color={'common.white'} sx={{ opacity: 0.8 }}>
                Security information
              </Typography>
              <Stack gap={pxToRem(8)} mt={pxToRem(12)}>
                {SECURITY.map((item, index: number) => {
                  const securityData = _.get(security, `data.${item.key}`, SECURITY_STATUS.NO);
                  return (
                    <Stack key={index} direction={'row'} gap={pxToRem(4)} alignItems={'center'}>
                      <Box width={17} height={17}>
                        <img src={images.iconItemSecurity} alt="" />
                      </Box>
                      <Typography variant={'body2'} color={'common.white'} sx={{ flex: 1 }}>
                        {item.name}
                      </Typography>
                      <Stack direction={'row'} gap={0.5}>
                        <Box width={17} height={17} borderRadius={'50%'} overflow={'hidden'}>
                          <img
                            src={
                              (item.type === SECURITY_TYPE.DEFAULT &&
                                securityData === SECURITY_STATUS.YES) ||
                              item.type === SECURITY_TYPE.NUMBER
                                ? images.iconYes
                                : images.iconCancel
                            }
                            alt=""
                            width={'100%'}
                            height={'100%'}
                          />
                        </Box>
                        <Typography
                          color={
                            (item.type === SECURITY_TYPE.DEFAULT &&
                              securityData === SECURITY_STATUS.YES) ||
                            item.type === SECURITY_TYPE.NUMBER
                              ? 'text.light'
                              : 'error.main'
                          }
                          variant={'body2'}
                          textTransform={'uppercase'}
                        >
                          {item.type === SECURITY_TYPE.NUMBER
                            ? roundBalance(securityData, 2)
                            : securityData}{' '}
                          {item.type === SECURITY_TYPE.NUMBER && '%'}
                        </Typography>
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            </>
          )}
          {!security && (
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
                Sorry, We can't find security info
              </Typography>
            </Stack>
          )}
        </Stack>
      </Popover>
    </>
  );
};
