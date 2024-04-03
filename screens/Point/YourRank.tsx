import { pxToRem } from '@/theme/foundations';
import { images } from '@/utils/images';
import { Box, Button, Typography } from '@mui/material';

interface YourRankProps {
  totalPoint: number;
  rank: number;
}
export const YourRank = (props: YourRankProps) => {
  const { totalPoint, rank } = props;

  const renderBlock = ({
    image,
    title,
    value,
    valuePrefix,
    logoSize,
  }: {
    image: string;
    title: string;
    value: string;
    valuePrefix?: string;
    logoSize: number;
  }) => {
    return (
      <Box
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={pxToRem(8)}
      >
        <Box
          width={pxToRem(logoSize)}
          height={pxToRem(logoSize)}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <img alt="" src={image} />
        </Box>
        <Box
          sx={{
            position: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            fontSize={pxToRem(16)}
            mt={pxToRem(4)}
            fontWeight={400}
            sx={{ color: '#FFF', opacity: 0.6 }}
          >
            {title}
          </Typography>
          <Typography fontSize={pxToRem(16)} fontWeight={600} sx={{ color: '#65E7CC' }}>
            {`${valuePrefix ? `${valuePrefix} ` : ''}${value}`}
          </Typography>
        </Box>
      </Box>
    );
  };
  return (
    <Box
      sx={{
        width: 1,
        height: pxToRem(80),
        background: '#2C3849',
        borderRadius: pxToRem(14),
        position: 'relative',
        padding: pxToRem(20),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {renderBlock({
        image: images.rank,
        title: 'Your Rank',
        value: rank > 0 ? `${rank}` : '-',
        valuePrefix: '#',
        logoSize: 30,
      })}
      {renderBlock({
        image: images.logo2,
        title: 'Your Point',
        value: totalPoint > 0 ? `${totalPoint}` : '-',
        logoSize: 20,
      })}
      <Button
        sx={{ position: 'relative', px: pxToRem(12), py: pxToRem(10) }}
        size={'medium'}
        color={'secondary'}
        onClick={() => window.open('https://www.chainzoom.xyz/leader-board', '_blank')}
      >
        <Box width={pxToRem(24)} height={pxToRem(24)} ml={pxToRem(8)}>
          <img alt="" src={images.trophy} />
        </Box>
        <Typography mx={pxToRem(8)} fontSize={pxToRem(16)} fontWeight={600} sx={{ color: '#FFF' }}>
          Leaderboard
        </Typography>
      </Button>
    </Box>
  );
};
