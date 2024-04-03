import { pxToRem } from '@/theme/foundations';
import { Box, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { EditableRefCode } from './EditableRefCode';

export interface Activity {
  refCount: number;
  refCountPoints: number;
  activityPoints: ActivityPoints;
  dexSwapPoints: number;
  dexSwapVolumePoints: number;
  totalPoints: number;
}

export interface ActivityPoints {
  loginPoints: number;
  depositPoints: number;
  checkInPoints: number;
  voteCountPoints: number;
  userNamePoints: number;
  profilePicPoints: number;
  totalActivityPoints: number;
}

interface ActivityBoardProps {
  refCode: string;
  activityPoint?: Activity;
}

export const ActivityBoard = (props: ActivityBoardProps) => {
  const { refCode, activityPoint = {} as Activity } = props;
  const {
    refCount = 0,
    activityPoints = {},
    dexSwapPoints = 0,
    dexSwapVolumePoints = 0,
    refCountPoints = 0,
  } = activityPoint || ({} as any);

  const sections = useMemo(() => {
    return [
      {
        id: 2,
        quests: [
          {
            id: 1,
            title: 'Actively using Chainzoom',
            point: activityPoints?.totalActivityPoints || 0,
          },
        ],
      },
      {
        id: 3,
        quests: [
          {
            id: 1,
            title: 'Trade Count Point',
            point: dexSwapPoints,
          },
          {
            id: 2,
            title: 'Trade Volume Point',
            point: dexSwapVolumePoints,
          },
        ],
      },
      {
        id: 4,
        quests: [
          {
            id: 1,
            title: 'Lucky Reward',
            point: 0,
          },
        ],
      },
    ];
  }, [activityPoint]);

  const renderHeaderList = useCallback(() => {
    return renderItem(
      {
        id: 1,
        quests: [
          {
            id: 1,
            title: 'Invite Friends',
            point: refCountPoints,
            subTitle: refCount?.toString?.(),
          },
        ],
        BottomContent: () => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#232D3A',
              borderRadius: pxToRem(8),
            }}
            gap={pxToRem(8)}
            py={pxToRem(8)}
          >
            <Typography fontSize={pxToRem(16)} fontWeight={400} sx={{ color: '#FFF' }}>
              Share your code
            </Typography>
            <EditableRefCode refCode={refCode} />
          </Box>
        ),
      },
      true,
    );
  }, [activityPoint, refCode]);

  const renderItem = (
    {
      quests,
      id,
      BottomContent,
    }: {
      quests: {
        title: string;
        id: number;
        subTitle?: string;
        point: number;
      }[];
      id: number;
      BottomContent?: () => JSX.Element;
    },
    showBottomBorder?: boolean,
  ) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderBottom: showBottomBorder ? '0.5px solid #001733' : 'none',
          py: pxToRem(16),
        }}
        gap={1}
      >
        {quests.map((quest, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography
                  fontSize={pxToRem(16)}
                  fontWeight={400}
                  sx={{ color: '#FFF', textTransform: 'none' }}
                >
                  {quest.title}
                </Typography>
                {quest?.subTitle && (
                  <Typography
                    fontSize={pxToRem(16)}
                    ml={0.5}
                    fontWeight={600}
                    sx={{ color: '#FFF' }}
                  >
                    {quest.subTitle}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography fontSize={pxToRem(16)} fontWeight={700} sx={{ color: '#65E7CC' }}>
                  {`${quest.point}`}
                </Typography>
                <Typography fontSize={pxToRem(16)} ml={0.5} fontWeight={700} sx={{ color: '#FFF' }}>
                  {`POINTS`}
                </Typography>
              </Box>
            </Box>
          );
        })}
        {BottomContent && <BottomContent />}
      </Box>
    );
  };
  return (
    <Box
      sx={{
        width: 1,
        height: pxToRem(358),
        background: '#2C3849',
        borderRadius: pxToRem(14),
        position: 'relative',
        overflow: 'hidden',
      }}
      mt={pxToRem(18)}
    >
      <Box
        sx={{ height: pxToRem(51), background: '#405066' }}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        px={pxToRem(20)}
      >
        <Typography fontSize={pxToRem(16)} mt={pxToRem(4)} fontWeight={700} sx={{ color: '#FFF' }}>
          Your Activity Board
        </Typography>
      </Box>
      <Box sx={{ px: pxToRem(20) }}>
        {renderHeaderList()}
        {sections.map((section, index) => {
          return (
            <Box key={`section-${section.id}`}>
              {renderItem(section, index !== sections.length - 1)}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
