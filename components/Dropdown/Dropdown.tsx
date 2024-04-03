import { pxToRem } from '@/theme/foundations';
import { images } from '@/utils/images';
import { Box, Popover, Stack, Typography } from '@mui/material';
import { useState } from 'react';

interface DropdownProps {
  options: {
    label: string;
    value: string;
  }[];
  onChange: (value: string, index?: number) => void;
}

const BOX_WIDTH = 215;
const BOX_HEIGHT = 42;
export const Dropdown = (props: DropdownProps) => {
  const { options, onChange } = props;
  const [openPopover, setOpenPopover] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    if (openPopover) {
      setOpenPopover(false);
    } else {
      setOpenPopover(true);
    }
  };

  const handleClose = () => {
    setOpenPopover(false);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Stack
      direction={'row'}
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #647387',
        borderRadius: '6px',
        p: '12px',
        position: 'relative',
        width: BOX_WIDTH,
        height: BOX_HEIGHT,
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <Typography
        fontSize={pxToRem(16)}
        fontWeight={'700'}
        color={'#fff'}
        variant={'h3'}
        mr={pxToRem(8)}
      >
        {options[activeIndex].label}
      </Typography>
      <Box
        width={14}
        height={14}
        sx={{
          transform: openPopover ? 'rotate(-180deg)' : 'rotate(0deg)',
          transition: 'all 0.3s',
        }}
      >
        <img src={images.iconAccordion} alt="" width={'100%'} height={'100%'} />
      </Box>
      {openPopover && (
        <Popover
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          id={id}
          anchorEl={anchorEl}
          open={open}
          sx={{
            zIndex: 1000,
            mt: 1,
            borderRadius: '6px',
            '& .MuiPopover-paper': {
              border: '1px solid #647387',
              background: '#252d3e',
              borderRadius: '6px',
            },
          }}
          onClose={handleClose}
          disableAutoFocus
        >
          {options.map((item, index) => (
            <Stack
              key={`dropdown-${index}`}
              width={BOX_WIDTH}
              sx={{
                background: index === activeIndex ? '#647387' : 'transparent',
                p: '12px',
                ':hover': {
                  background: '#55cfc0',
                },
              }}
              onClick={() => {
                onChange(item.value, index);
                setActiveIndex(index);
              }}
            >
              <Typography
                fontSize={pxToRem(16)}
                fontWeight={'700'}
                color={'#fff'}
                variant={'h3'}
                mr={pxToRem(8)}
              >
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Popover>
      )}
    </Stack>
  );
};
