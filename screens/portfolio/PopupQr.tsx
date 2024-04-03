import { ScreenPopupWrapper } from '@/components/ScreenPopupWrapper/ScreenPopupWrapper';
import { pxToRem } from '@/theme/foundations';
import { Box, Stack } from '@mui/material';
import QRCode from 'react-qr-code';

type PopupQrProps = {
  selectedWalletAddress: string;
  closePopup: () => void;
};
export const PopupQr = (props: PopupQrProps) => {
  return (
    <ScreenPopupWrapper title="Deposit" close={props.closePopup}>
      <Stack
        direction={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        height={pxToRem(252)}
        py={pxToRem(45)}
      >
        <QRCode style={{ width: 158, height: 158 }} value={props.selectedWalletAddress} />
      </Stack>
    </ScreenPopupWrapper>
  );
};
