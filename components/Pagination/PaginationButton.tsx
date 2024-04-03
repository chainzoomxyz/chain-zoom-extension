import { images } from '@/utils/images';
import { Box } from '@mui/material';

interface PaginationButtonProps {
  onClick: () => void;
  disable: boolean;
  direction: 'left' | 'right';
}

export const PaginationButton = (props: PaginationButtonProps) => {
  const { onClick, disable, direction } = props;
  const isDisableLeft = disable && direction === 'left';
  const isDisableRight = disable && direction === 'right';
  const isEnableLeft = !disable && direction === 'left';
  const isEnableRight = !disable && direction === 'right';

  const onButtonClick = disable ? () => null : onClick;

  if (isDisableLeft) {
    return (
      <Box onClick={onButtonClick} width={24} height={24}>
        <img
          src={images.leftDisable}
          alt=""
          width={'100%'}
          height={'100%'}
          style={{ cursor: 'pointer', objectFit: 'none' }}
        />
      </Box>
    );
  }

  if (isEnableRight) {
    return (
      <Box onClick={onButtonClick} width={24} height={24}>
        <img
          src={images.rightEnable}
          alt=""
          width={'100%'}
          height={'100%'}
          style={{ cursor: 'pointer', objectFit: 'none' }}
        />
      </Box>
    );
  }

  if (isDisableRight) {
    return (
      <Box onClick={onButtonClick} width={24} height={24}>
        <img
          src={images.leftDisable}
          alt=""
          width={'100%'}
          height={'100%'}
          style={{ cursor: 'pointer', objectFit: 'none', transform: 'rotate(180deg)' }}
        />
      </Box>
    );
  }

  if (isEnableLeft) {
    return (
      <Box onClick={onButtonClick} width={24} height={24}>
        <img
          src={images.rightEnable}
          alt=""
          width={'100%'}
          height={'100%'}
          style={{ cursor: 'pointer', objectFit: 'none', transform: 'rotate(180deg)' }}
        />
      </Box>
    );
  }
  return null;
};
