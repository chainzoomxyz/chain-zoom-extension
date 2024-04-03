import { ScreenPopupWrapper } from '@/components/ScreenPopupWrapper/ScreenPopupWrapper';
import { pxToRem } from '@/theme/foundations';
import { images } from '@/utils/images';
import { Box, Button, Typography } from '@mui/material';

interface PopupClaimInfoProps {
  closePopup: () => void;
}
export const PopupClaimInfo = (props: PopupClaimInfoProps) => {
  return (
    <ScreenPopupWrapper
      showHeader={false}
      title="Claim Info"
      close={props.closePopup}
      customContainerStyle={{ padding: 0, position: 'relative' }}
    >
      <img src={images.bgPopupClaimed2} style={{ width: '100%', height: '100%' }} alt="" />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          pt: pxToRem(42),
          pl: pxToRem(12),
        }}
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <Typography fontSize={pxToRem(16)} fontWeight={600}>
            {`Congrats! You got `}
          </Typography>
          <Typography
            ml={0.5}
            fontSize={pxToRem(16)}
            fontWeight={600}
            sx={{
              backgroundImage: 'linear-gradient(180deg, #77FED6 0%, #2593A6 100%)',
              backgroundSize: '100%',
              backgroundRepeat: 'repeat',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {`100 POINT`}
          </Typography>
        </Box>
        <Typography fontSize={pxToRem(12)} fontWeight={400}>
          {`Comeback next time for more point.`}
        </Typography>
        <Button
          sx={{ mt: 2, width: pxToRem(250) }}
          onClick={props.closePopup}
          variant={'gradient'}
          color={'secondary'}
          size={'small'}
        >
          <Typography fontSize={pxToRem(12)} fontWeight={400} sx={{ color: '#FFF' }}>
            {`Ok`}
          </Typography>
        </Button>
      </Box>
    </ScreenPopupWrapper>
  );
};
