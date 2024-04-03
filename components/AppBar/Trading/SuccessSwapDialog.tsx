import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import React, { type SetStateAction } from 'react';
import { images } from '@/utils/images';
import { useNetWorkContext } from 'providers/NetworkProvider';

type DepositDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  hash?: string;
};

export const SuccessSwapDialog = (props: DepositDialogProps) => {
  const { NETWORK_CONFIG } = useNetWorkContext();
  return (
    <Dialog
      sx={(theme) => {
        return {
          '& .MuiDialog-paper': {
            backgroundColor: `${theme.palette.common.transparent} !important`,
            padding: '0 !important',
            maxWidth: 288,
            borderRadius: `${pxToRem(14)} !important`,
            boxShadow: 'none !important',
          },
        };
      }}
      open={props.isOpen}
      onClose={() => props.setIsOpen(false)}
    >
      <Stack width={288} bgcolor={'background.smallDialog'} height={163}>
        <DialogTitle>
          <Stack
            px={pxToRem(12)}
            py={pxToRem(10)}
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            width={1}
            height={1}
          >
            Notification
            <IconButton onClick={() => props.setIsOpen(false)}>
              <Box width={16} height={16}>
                <img src={images.iconClose} alt="" width={'100%'} height={'100%'} />
              </Box>
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box width={1} p={pxToRem(20)}>
            <Box width={1} mb={pxToRem(12)}>
              <Stack
                direction={'row'}
                gap={pxToRem(4)}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Typography variant={'body1'} fontWeight={'bold'} color={'common.white'}>
                  Your transaction is successful!
                </Typography>
                {/*<IconPending />*/}
              </Stack>
            </Box>
            <Button
              onClick={() =>
                window.open(`${NETWORK_CONFIG?.BLOCK_EXPLORER_URL}tx/${props.hash}`, '_blank')
              }
              type={'submit'}
              variant={'soft'}
              color={'success'}
              fullWidth
              size={'large'}
            >
              Check Transaction hash
            </Button>
          </Box>
        </DialogContent>
      </Stack>
    </Dialog>
  );
};
const IconPending = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
      <g clip-path="url(#clip0_4943_13231)">
        <path
          d="M8.50041 0C3.81355 0 0.000488281 3.81298 0.000488281 8.49976C0.000488281 13.1869 3.81355 17 8.50041 17C13.1872 17 17.0002 13.1868 17.0002 8.49976C17.0002 3.81298 13.1872 0 8.50041 0ZM8.50041 15.7815C4.48541 15.7815 1.21895 12.5149 1.21895 8.49976C1.21895 4.48484 4.48541 1.21846 8.50041 1.21846C12.5153 1.21846 15.7817 4.48484 15.7817 8.49976C15.7817 12.5149 12.5153 15.7815 8.50041 15.7815Z"
          fill="white"
        />
        <path
          d="M12.8706 8.35739H8.87618V3.99107C8.87618 3.65461 8.60349 3.38184 8.26695 3.38184C7.93049 3.38184 7.65771 3.65461 7.65771 3.99107V8.96662C7.65771 9.30308 7.93049 9.57585 8.26695 9.57585H12.8706C13.2072 9.57585 13.4799 9.30308 13.4799 8.96662C13.4799 8.63016 13.2071 8.35739 12.8706 8.35739Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_4943_13231">
          <rect width="17" height="17" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
