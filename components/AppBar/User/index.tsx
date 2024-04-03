import { images } from '@/utils/images';
import {
  Avatar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import React, { type SetStateAction } from 'react';
import { pxToRem } from '@/theme/foundations';
import { useMetaMask } from 'providers/MetamaskProvider';
import { ConnectWallet } from '@/components/ConnectWallet';
import _ from 'lodash';
import { RefCodeForm } from '@/components/AppBar/User/RefCodeForm';
import { FEATURE_FLAG } from '@/utils/constants';

export const User = ({
  setActivePage,
}: {
  setActivePage: React.Dispatch<SetStateAction<string>>;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickItem = () => {
    setOpenProfileSetting(true);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'user-popover' : undefined;

  const { isConnected, disconnectMetamask, profile, connectMetaMask, setOpenProfileSetting } =
    useMetaMask();

  return (
    <>
      <Avatar sizes={'small'} sx={{ cursor: 'pointer' }} onClick={handleClick}>
        <img
          src={_.get(profile, 'userProfile.profilePictureUrl', null) ?? images.iconAvatar}
          width={'100%'}
          height={'100%'}
          alt=""
        />
      </Avatar>

      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
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
          width={194}
          height={338}
          p={'1px'}
          sx={(theme) => ({
            boxShadow: `2px 4px 6px 0px ${theme.palette.boxShadow.main}`,
            background: theme.palette.background.popoverGradient,
          })}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Box
            bgcolor={'background.default'}
            width={192}
            height={336}
            overflow={'hidden'}
            borderRadius={pxToRem(14)}
            position={'relative'}
          >
            {!isConnected && (
              <Box width={1} px={pxToRem(10)} height={1} position={'absolute'} zIndex={10}>
                <ConnectWallet
                  handleConnect={() => {
                    setAnchorEl(null);
                    connectMetaMask();
                  }}
                />
              </Box>
            )}
            <Box width={1} height={1} position={'absolute'} zIndex={5}>
              <MenuList
                disablePadding
                sx={{
                  background: 'transparent',
                }}
              >
                {FEATURE_FLAG.ENABLED_PORTFOLIO ? (
                  <MenuItem sx={{ height: 43 }}>
                    <ListItemIcon sx={{ width: 18, height: 18 }}>
                      <img src={images.iconPorfolio} alt="" />
                    </ListItemIcon>
                    <ListItemText
                      onClick={() => {
                        setAnchorEl(null);
                        setActivePage('portfolio');
                      }}
                    >
                      <Typography color={'primary.dark'} variant={'body2'}>
                        Portfolio
                      </Typography>
                    </ListItemText>
                  </MenuItem>
                ) : null}
                <MenuItem sx={{ height: 43 }}>
                  <ListItemIcon sx={{ width: 18, height: 18 }}>
                    <img src={images.iconAlert2} alt="" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography color={'primary.dark'} variant={'body2'}>
                      Alerts
                    </Typography>
                  </ListItemText>
                </MenuItem>
                <MenuItem sx={{ height: 43 }}>
                  <ListItemIcon sx={{ width: 18, height: 18 }}>
                    <img src={images.iconStar2} alt="" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography color={'primary.dark'} variant={'body2'}>
                      Watch List
                    </Typography>
                  </ListItemText>
                </MenuItem>
                <MenuItem sx={{ height: 43 }}>
                  <ListItemIcon sx={{ width: 18, height: 18 }}>
                    <img src={images.iconSetting} alt="" />
                  </ListItemIcon>
                  <ListItemText onClick={() => handleClickItem()}>
                    <Typography color={'primary.dark'} variant={'body2'}>
                      Profile Setting
                    </Typography>
                  </ListItemText>
                </MenuItem>
                {/* <MenuItem sx={{ height: 43 }}>
                  <ListItemIcon sx={{ width: 18, height: 18 }}>
                    <img src={images.iconVoteStats} alt="" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography color={'primary.dark'} variant={'body2'}>
                      Vote Stats
                    </Typography>
                  </ListItemText>
                </MenuItem> */}
              </MenuList>
              <Box px={pxToRem(18)}>
                <Divider />
                <Stack
                  direction={'row'}
                  pt={pxToRem(6)}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Stack direction={'row'}>
                    <Typography variant={'body2'} color={'text.secondary'}>
                      Invited:&nbsp;
                    </Typography>
                    <Typography variant={'body2'} color={'text.light'}>
                      {_.get(profile, 'userProfile.refCount', '')}
                    </Typography>
                  </Stack>
                  <Stack direction={'row'}>
                    <Typography variant={'body2'} color={'text.secondary'}>
                      Point:&nbsp;
                    </Typography>
                    <Typography variant={'body2'} color={'text.light'}>
                      {_.get(profile, 'userProfile.refCount', '')}
                    </Typography>
                  </Stack>
                </Stack>
                {/*<Box*/}
                {/*  sx={(theme) => ({*/}
                {/*    background: theme.palette.background.gradient,*/}
                {/*    backgroundClip: 'text',*/}
                {/*    webkitBackgroundClip: 'text',*/}
                {/*    webkitTextFillColor: 'transparent',*/}
                {/*    color: 'transparent',*/}
                {/*    fontSize: 11,*/}
                {/*    mt: pxToRem(6),*/}
                {/*  })}*/}
                {/*>*/}
                {/*  Point will be airdropped weekly*/}
                {/*</Box>*/}
                <Stack width={1} mt={pxToRem(12)}>
                  <RefCodeForm refCode={_.get(profile, 'userProfile.refCode', '')} />
                  <Button
                    sx={{ width: 1, mt: pxToRem(6) }}
                    variant={'contained'}
                    color={'primary'}
                    size={'small'}
                    onClick={() => {
                      setAnchorEl(null);
                      disconnectMetamask();
                    }}
                  >
                    <Box width={12} height={14} mr={0.5}>
                      <img src={images.iconLogout} alt="" />
                    </Box>
                    Logout
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Popover>
    </>
  );
};
