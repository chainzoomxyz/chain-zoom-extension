import React, { type SetStateAction } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import { MENU_ITEMS } from '@/utils/constants';
import _ from 'lodash';
import { User } from '@/components/AppBar/User';
import { Trading } from '@/components/AppBar/Trading';
import { motion } from 'framer-motion';
import { Search } from '@/components/AppBar/Search';
import { iconVariants, appBarItemVariants } from '@/utils/variants';
import { images } from '@/utils/images';

export const AppBar = ({
  activePage,
  setActivePage,
}: {
  activePage: string;
  setActivePage: React.Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Stack
      direction={'row'}
      px={2.5}
      py={pxToRem(8)}
      sx={{
        background: 'radial-gradient(48.08% 59.1% at 50% 35.62%, #30455A 0%, #2C3849 100%)',
        borderRadius: pxToRem(14),
      }}
      alignItems={'center'}
      height={50}
      justifyContent={'space-between'}
    >
      <Stack direction={'row'} gap={pxToRem(12)} height={1} alignItems={'center'}>
        {_.map(MENU_ITEMS, (item) => {
          return (
            <Stack
              key={item.id}
              direction={'row'}
              onClick={() => setActivePage(item.id)}
              height={1}
              overflow={'hidden'}
              border={'none'}
              alignItems={'center'}
              borderRadius={pxToRem(12)}
              position={'relative'}
              sx={{
                cursor: 'pointer',
              }}
            >
              <Box
                initial={false}
                variants={appBarItemVariants}
                animate={item.id === activePage ? 'active' : 'inActive'}
                component={motion.div}
                transition={{ delay: 0.1 }}
                width={1}
                height={1}
                sx={{ background: 'linear-gradient(93deg, #78FFCE 5.87%, #0BC0E8 95.88%)' }}
                position={'absolute'}
                left={0}
                top={0}
                zIndex={0}
              />
              <Stack alignItems={'center'} width={1} height={1} zIndex={1} direction={'row'} pr={1}>
                <Stack
                  initial={false}
                  variants={iconVariants}
                  animate={item.id === activePage ? 'active' : 'inActive'}
                  component={motion.div}
                  transition={{ delay: 0.1 }}
                  justifyContent={'center'}
                  alignItems={'center'}
                  width={34}
                  height={34}
                >
                  <img
                    key={item.id}
                    src={item.iconActive}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'none' }}
                  />
                </Stack>
                <Stack
                  initial={false}
                  variants={iconVariants}
                  animate={item.id === activePage ? 'inActive' : 'active'}
                  component={motion.div}
                  transition={{ delay: 0.1 }}
                  justifyContent={'center'}
                  alignItems={'center'}
                  width={34}
                  height={34}
                >
                  <img
                    key={item.id}
                    src={item.icon}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'none' }}
                  />
                </Stack>
                <Typography
                  sx={{
                    transition: 'all 0.2s ease-in-out',
                  }}
                  fontSize={14}
                  fontWeight={500}
                  color={item.id === activePage ? 'common.white' : 'text.secondary'}
                >
                  {item.label}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
      <Search />
      <Stack direction={'row'} gap={pxToRem(12)} height={1} alignItems={'center'}>
        <Box width={89} height={1} borderRadius={pxToRem(16)} overflow={'hidden'}>
          <Button
            variant={'gradient'}
            sx={{ position: 'relative' }}
            color={'warning'}
            size={'small'}
            fullWidth
            onClick={() => setActivePage('point')}
          >
            <Typography fontSize={14} fontWeight={500} color={'common.white'}>
              Point
            </Typography>
            <Box position={'absolute'} width={89} height={34}>
              <img
                alt=""
                src={images.buttonPoint}
                style={{
                  mixBlendMode: 'overlay',
                }}
              />
            </Box>
          </Button>
        </Box>
        <Trading />
        <User setActivePage={setActivePage} />
      </Stack>
    </Stack>
  );
};
