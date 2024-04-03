import { pxToRem } from '@/theme/foundations';
import { Stack, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export const ScreenPopupWrapper = ({
  children,
  title,
  close,
  showHeader = true,
  customContainerStyle,
}: {
  showHeader?: boolean;
  children: React.ReactNode;
  title: string;
  close: () => void;
  customContainerStyle?: React.CSSProperties;
}) => {
  return (
    <div
      onClick={() => {
        close();
      }}
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: 10001,
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        onClick={(e) => {
          e.stopPropagation();
        }}
        sx={{
          background: '#405066',
          width: 354,
          borderRadius: pxToRem(12),
          overflow: 'hidden',
          ...customContainerStyle,
        }}
      >
        {/* Header */}
        {showHeader && (
          <Stack
            direction={'row'}
            height={pxToRem(36)}
            bgcolor={'#2C3849'}
            justifyContent={'space-between'}
            alignItems={'center'}
            p={pxToRem(12)}
          >
            <Typography fontSize={pxToRem(16)} fontWeight={'700'} color={'#fff'}>
              {title}
            </Typography>
            <ClearIcon
              onClick={() => {
                close();
              }}
              sx={{ cursor: 'pointer', color: '#fff', width: 16, height: 16 }}
            />
          </Stack>
        )}
        {children}
      </Stack>
    </div>
  );
};
