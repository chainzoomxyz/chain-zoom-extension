import { pxToRem } from '@/theme/foundations';
import { images } from '@/utils/images';
import { Box, Button, Typography } from '@mui/material';
import { useCheckIn } from '../../hooks/useUserPoint';
import moment from 'moment';
import Countdown from 'react-countdown';
import { useCallback, useMemo } from 'react';
import { Loading } from '@/components/Loading';

export interface DailyQuestProps {
  openPopup: () => void;
  canCheckIn: boolean;
  remainingTime: number;
}

export const DailyQuest = (props: DailyQuestProps) => {
  const { canCheckIn = false, remainingTime = 0 } = props || {};
  const checkIn = useCheckIn();
  console.log('checkIn.isLoading', checkIn.isLoading);

  const renderButtonClaim = () => {
    return (
      <Button
        variant={'gradient'}
        sx={{
          position: 'relative',
          background:
            'radial-gradient(150.61% 128.96% at 0% 0%, #FF7373 0%, #FD3F4F 62.66%, #FFE552 100%);',
        }}
        color={'warning'}
        size={'small'}
        fullWidth
        onClick={async () => {
          const res = await checkIn.mutateAsync({
            date: moment().utc().format('YYYY-MM-DD'),
          });
          const { claimed = false } = res || ({} as any);
          claimed && props.openPopup();
        }}
      >
        <Typography fontSize={14} fontWeight={600} color={'common.white'}>
          Claim +100 points
        </Typography>
      </Button>
    );
  };

  const renderer = useCallback(
    ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        return renderButtonClaim();
      } else {
        return (
          <Button
            variant={'gradient'}
            sx={{
              position: 'relative',
              background: '#737373',
            }}
            color={'warning'}
            fullWidth
            disabled
          >
            <Typography fontSize={14} fontWeight={600} color={'common.white'}>
              {`Come back in: ${`${hours}`.padStart(2, '0')}.${`${minutes}`.padStart(2, '0')}`}
            </Typography>
          </Button>
        );
      }
    },
    [remainingTime],
  );

  const renderCountdown = useMemo(() => {
    return <Countdown date={Date.now() + remainingTime * 1000} renderer={renderer} />;
  }, [remainingTime]);

  return (
    <Box
      sx={{
        width: 1,
        height: pxToRem(215),
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 33.66%, rgba(13, 142, 142, 0.20) 86.83%), #2C3849',
        borderRadius: pxToRem(14),
        position: 'relative',
        padding: pxToRem(20),
      }}
    >
      <Box width={1} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
        <Typography
          fontSize={pxToRem(24)}
          fontWeight={700}
          sx={{
            backgroundImage: 'linear-gradient(180deg, #77FED6 0%, #2593A6 100%)',
            backgroundSize: '100%',
            backgroundRepeat: 'repeat',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`Daily \nQuest`}
        </Typography>
        <Typography
          fontSize={pxToRem(16)}
          fontWeight={400}
          sx={{
            whiteSpace: 'pre-wrap',
            textAlign: 'right',
          }}
        >
          {`Check-in daily to\n earn POINT`}
        </Typography>
      </Box>
      <Box
        position={'absolute'}
        zIndex={1}
        width={pxToRem(168)}
        borderRadius={pxToRem(13)}
        overflow={'hidden'}
        bottom={pxToRem(16)}
        left={pxToRem(100)}
        boxShadow={'0px 8px 7.5px -9px rgba(255, 196, 183, 0.40)'}
      >
        {canCheckIn ? renderButtonClaim() : renderCountdown}
      </Box>
      {checkIn.isLoading && (
        <Box position={'absolute'} zIndex={1} bottom={pxToRem(16)} right={pxToRem(14)}>
          <Loading width={32} height={32} />
        </Box>
      )}

      <Box
        mt={pxToRem(-24)}
        position={'relative'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <img alt="" src={images.gift} />
      </Box>
    </Box>
  );
};
