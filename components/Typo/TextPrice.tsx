import { formatVerySmallNumber } from '@/utils/helper';

export const TextPrice = (props: {
  value: string;
  customStyle?: React.CSSProperties;
  first?: boolean;
  last?: boolean;
  dollarSign?: boolean;
}) => {
  const { value = '', customStyle = {}, first, last, dollarSign = false } = props || {};
  const { formattedNumberInString, zerosCount, significantDigits } = formatVerySmallNumber(value);
  return (
    <span
      style={{
        ...styles.text,
        paddingLeft: first ? 12 : 0,
        paddingRight: last ? 12 : 0,
        ...customStyle,
      }}
    >
      <span>{dollarSign && value !== '--' ? '$' : ''}</span>
      {zerosCount <= 2 ? (
        formattedNumberInString
      ) : (
        <span>
          <span>0.0</span>
          <span style={{ marginTop: 4, fontSize: 10 }}>{zerosCount}</span>
          <span>{significantDigits}</span>
        </span>
      )}
    </span>
  );
};

const styles: Record<string, React.CSSProperties> = {
  text: {
    color: '#FFF',
    fontFamily: 'IBM Plex Sans Condensed, sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '120%', // 16.8px
  },
};
