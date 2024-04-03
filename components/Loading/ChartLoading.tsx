import { CHART_HEIGHT, CHART_WIDTH } from '@/utils/constants';
import { Loading } from '.';

export const LoadingChart = () => {
  return (
    <div
      style={{
        height: CHART_HEIGHT,
        width: CHART_WIDTH,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Loading width={40} height={40} />
    </div>
  );
};
