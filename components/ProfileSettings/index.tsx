import { Box, Stack, Typography } from '@mui/material';
import { images } from '@/utils/images';
import { pxToRem } from '@/theme/foundations';
import React from 'react';
import { EditProfileForm } from '@/components/ProfileSettings/EditProfileForm';
import { InputRefBy } from '@/components/ProfileSettings/InputRefBy';
import { useMetaMask } from 'providers/MetamaskProvider';
import { useOutsideClick } from '@/hooks';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

export const ProfileSettings = () => {
  const { setOpenProfileSetting } = useMetaMask();

  const wrapperRef = useOutsideClick(() => {
    setOpenProfileSetting(false);
  });
  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      position={'absolute'}
      width={1}
      height={1}
      zIndex={1001}
      bgcolor={'background.blur'}
      sx={{
        backdropFilter: 'blur(3.5px)',
      }}
      ref={wrapperRef}
    >
      <Stack width={410}>
        <ClickAwayListener onClickAway={() => setOpenProfileSetting(false)}>
          <Stack width={1} flex={1} gap={pxToRem(26)}>
            <Stack direction={'row'} gap={pxToRem(12)}>
              <Box width={36} height={36}>
                <img src={images.iconSettingLight} alt="" />
              </Box>
              <Typography variant={'h3'} color={'common.white'}>
                Profile Setting
              </Typography>
            </Stack>
            <Stack width={1} height={420} position={'relative'}>
              <Box width={1} height={132} zIndex={1} position={'absolute'} top={0} left={0}>
                <img src={images.backgroundProfileSetting} alt="" />
              </Box>
              <Stack
                width={1}
                bgcolor={'background.smallDialog'}
                borderRadius={pxToRem(14)}
                zIndex={2}
                position={'absolute'}
                bottom={0}
                height={357}
                px={pxToRem(18)}
              >
                <EditProfileForm />
                <InputRefBy />
              </Stack>
            </Stack>
          </Stack>
        </ClickAwayListener>
      </Stack>
    </Stack>
  );
};
