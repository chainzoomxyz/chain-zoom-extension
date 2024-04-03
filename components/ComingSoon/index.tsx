import { Box, Stack, Typography } from '@mui/material';
import { images } from '@/utils/images';
import { pxToRem } from '@/theme/foundations';

export const ComingSoon = (props: { title: string; size?: 'small' | 'normal' }) => {

  return (
    <Stack width={1} height={1} alignItems={'center'} position={'relative'}>
      <Box left={0} width={0.5} height={1} position={'absolute'} zIndex={1} sx={{ opacity: 0.05 }}>
        <img src={images.logoUnion} alt="" />
      </Box>
      <Stack mt={pxToRem(100)} direction={'column'} justifyContent={'center'} alignItems={'center'}>
        <Box width={113} height={66}>
          <img src={images.logoInComingSoon} alt="" />
        </Box>
        <Box
          mt={pxToRem(76)}
          sx={(theme) => ({
            background: theme.palette.background.gradient,
            backgroundClip: 'text',
            webkitBackgroundClip: 'text',
            webkitTextFillColor: 'transparent',
            color: 'transparent',
            fontSize: 54,
            fontWeight: 'bold',
          })}
        >
          <Typography
            fontSize={props?.size === 'small' ? 36 : 54}
            fontWeight={'bold'}
            color={'common.transparent'}
          >
            {props.title}
          </Typography>
        </Box>
        <Typography color={'common.white'} fontSize={props?.size === 'small' ? 24 : 30}>
          Is coming soon!
        </Typography>
      </Stack>
    </Stack>
  );
};
