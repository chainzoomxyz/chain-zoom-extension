import { Stack } from '@mui/material';
import { OverviewHeader } from '@/screens/Overview/OverviewHeader';
import { OverviewIframe } from '@/screens/Overview/OverviewIframe';
import { pxToRem } from '@/theme/foundations';
import { observer } from 'mobx-react-lite';

export const Overview = observer(() => {
  return (
    <Stack direction={'column'} gap={pxToRem(12)} flex={1} position={'relative'}>
      <OverviewHeader />
      <OverviewIframe />
    </Stack>
  );
});
