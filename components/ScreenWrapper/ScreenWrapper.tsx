import { pxToRem } from '@/theme/foundations';
import { Box, Divider, Stack, Typography } from '@mui/material';

export const ScreenWrapper = ({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  icon: string;
}) => {
  return (
    <Stack direction={'column'} gap={pxToRem(12)} pt={pxToRem(20)} flex={1} position={'relative'}>
      <Stack direction={'row'} gap={pxToRem(12)}>
        <Box width={36} height={36}>
          <img src={icon} alt="" />
        </Box>
        <Typography fontSize={pxToRem(30)} fontWeight={'700'} color={'#596A82'} variant={'h1'}>
          {title}
        </Typography>
      </Stack>
      <div style={{ width: '100%', height: 2 }} />
      {children}
    </Stack>
  );
};
