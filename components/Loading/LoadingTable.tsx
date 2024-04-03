import { CHART_WIDTH } from '@/utils/constants';
import { Loading } from '.';

export const LoadingTable = () => {
  return (
    <div
      style={{
        height: 250,
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
