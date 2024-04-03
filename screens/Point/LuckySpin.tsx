import { pxToRem } from '@/theme/foundations';
import { images } from '@/utils/images';
import { Box, Typography } from '@mui/material';

export const LuckySpin = () => {
  return (
    <Box
      sx={{
        width: 1,
        height: pxToRem(493),
        background: '#2C3849',
        borderRadius: pxToRem(14),
        overflow: 'hidden',
        mt: 2,
        position: 'relative',
      }}
    >
      <img
        alt=""
        src={images.spinBlur}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          borderRadius: pxToRem(12),
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          backdropFilter: 'blur(4px)',
        }}
      >
        <Typography fontSize={pxToRem(40)} fontWeight={700} sx={{ color: '#65E7CC' }}>
          Lucky Spin
        </Typography>
        <Typography fontSize={pxToRem(26)} fontWeight={700} sx={{ color: '#FFF' }}>
          is coming soon
        </Typography>
      </Box>
    </Box>
  );
};
