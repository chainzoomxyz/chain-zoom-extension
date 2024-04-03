import loading from '@/assets/lottie/loading.json';

import Lottie from 'react-lottie';
export const Loading = ({ width, height }: { width: number; height: number }) => {
  const options = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return <Lottie options={options} height={width} width={height} />;
};
