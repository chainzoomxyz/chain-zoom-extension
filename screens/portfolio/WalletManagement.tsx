import { Dropdown } from '@/components/Dropdown/Dropdown';
import { pxToRem } from '@/theme/foundations';
import { icons } from '@/utils/icons';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Popup } from './Portfolio';
import React, { type SetStateAction } from 'react';
import { copyToClipboard } from '@/utils/helper';

type WalletManagementProps = {
  openPopup: (popup: Popup) => void;
  selectedWalletAddress: string;
  setSelectedWalletAddress: React.Dispatch<SetStateAction<string>>;
  walletOptions: Array<{ value: string; label: string }>;
  isChainWithEvmWallet: boolean;
};
export const WalletManagement = (props: WalletManagementProps) => {
  return (
    <Stack direction={'row'} justifyContent={'space-between'}>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        {props.walletOptions && (
          <Dropdown
            options={props.walletOptions}
            onChange={(value) => {
              props.setSelectedWalletAddress(value);
            }}
          />
        )}
        <Box
          width={27}
          height={27}
          ml={pxToRem(16)}
          onClick={() => {
            copyToClipboard(props.selectedWalletAddress);
          }}
          sx={{ cursor: 'pointer' }}
        >
          <img src={icons.copyIcon} alt="" />
        </Box>
        <Box
          width={27}
          height={27}
          onClick={() => props.openPopup(Popup.QR)}
          ml={pxToRem(12)}
          sx={{ cursor: 'pointer' }}
        >
          <img src={icons.qrIcon} alt="" />
        </Box>
      </Stack>
      <Stack direction={'row'} gap={pxToRem(12)}>
        {props.isChainWithEvmWallet && (
          <Button
            sx={{
              width: pxToRem(125),
              borderRadius: pxToRem(10),
            }}
            variant={'soft'}
            color={'success'}
            onClick={() => props.openPopup(Popup.DEPOSIT)}
          >
            <Typography fontSize={pxToRem(16)} fontWeight={'600'} color={'#fff'}>
              Deposit
            </Typography>
          </Button>
        )}
        {/*<Button*/}
        {/*  sx={{*/}
        {/*    width: pxToRem(125),*/}
        {/*  }}*/}
        {/*  variant={'soft'}*/}
        {/*  color={'dark'}*/}
        {/*>*/}
        {/*  <Typography fontSize={pxToRem(16)} fontWeight={'600'} color={'#fff'}>*/}
        {/*    Private key*/}
        {/*  </Typography>*/}
        {/*</Button>*/}
      </Stack>
    </Stack>
  );
};
