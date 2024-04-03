import { Box, Grid } from '@mui/material';
import { DailyQuest } from './DailyQuest';
import { ActivityBoard } from './ActivityBoard';
import { YourRank } from './YourRank';
import { LuckySpin } from './LuckySpin';
import { PopupClaimInfo } from './PopupClaimInfo';
import { useState } from 'react';
import { useActivityPoint, useCheckInStatus, useProfile } from '@/hooks';

export const Point = () => {
  const { data: profile } = useProfile();
  const { userProfile = {} } = profile || ({} as any);
  const { refCode = '' } = userProfile || {};
  const [showClaimedPopup, setShowClaimedPopup] = useState(false);
  const { data: checkInStatus } = useCheckInStatus();
  const { data: activityPoint } = useActivityPoint();
  const { canCheckIn = false, remainingTime = 0 } = checkInStatus || {};
  const { points, rank = 0 } = activityPoint || {};

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={5} gap={2}>
          <DailyQuest
            canCheckIn={canCheckIn}
            remainingTime={remainingTime}
            openPopup={() => setShowClaimedPopup(true)}
          />
          <ActivityBoard refCode={refCode} activityPoint={activityPoint?.points} />
        </Grid>
        <Grid item xs={7} gap={2}>
          <YourRank totalPoint={points?.totalPoints || 0} rank={rank || 0} />
          <LuckySpin />
        </Grid>
      </Grid>
      {showClaimedPopup && <PopupClaimInfo closePopup={() => setShowClaimedPopup(false)} />}
    </Box>
  );
};
