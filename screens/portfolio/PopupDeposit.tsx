import { ScreenPopupWrapper } from '@/components/ScreenPopupWrapper/ScreenPopupWrapper';
import { pxToRem } from '@/theme/foundations';
import { Button, Stack, Typography } from '@mui/material';

type PopupDepositProps = {
  closePopup: () => void;
};
export const PopupDeposit = (props: PopupDepositProps) => {
  return (
    <ScreenPopupWrapper title="Deposit" close={props.closePopup}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        px={pxToRem(12)}
        mt={pxToRem(12)}
      >
        <span style={{ fontSize: pxToRem(16), fontWeight: '500', color: '#fff' }}>Amount</span>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            style={{
              width: '216px',
              height: '40px',
              border: '1px solid #647387',
              borderRadius: '6px',
              background: 'transparent',
              padding: pxToRem(12),
              fontSize: pxToRem(16),
              fontWeight: '500',
              color: '#fff',
            }}
          />
          <span
            style={{
              position: 'absolute',
              right: pxToRem(12),
              fontWeight: '500',
              top: pxToRem(13),
              color: '#fff',
              background: 'transparent',
            }}
          >
            ETH
          </span>
        </div>
      </Stack>
      <div
        style={{
          padding: pxToRem(12),
          paddingBottom: 0,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <span style={{ fontSize: pxToRem(16), fontWeight: '700', color: '#fff' }}>~$200</span>
      </div>
      <div style={{ padding: pxToRem(12) }}>
        <Button
          onClick={() => {
            console.log('click deposit.ts');
          }}
          sx={{ width: '100%' }}
          variant="soft"
          color="success"
        >
          <Typography fontSize={pxToRem(16)} fontWeight={'700'} color={'#fff'}>
            Deposit
          </Typography>
        </Button>
      </div>
    </ScreenPopupWrapper>
  );
};
