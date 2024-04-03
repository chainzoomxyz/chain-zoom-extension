export const TextRow = ({
  children,
  customStyle = {},
  first,
  last,
}: {
  children: React.ReactNode;
  customStyle?: React.CSSProperties;
  first?: boolean;
  last?: boolean;
}) => (
  <span
    style={{
      color: '#FFF',
      fontFamily: 'IBM Plex Sans Condensed, sans-serif',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '120%', // 16.8px
      paddingLeft: first ? 12 : 0,
      paddingRight: last ? 12 : 0,
      paddingTop: 4,
      paddingBottom: 4,
      ...customStyle,
    }}
  >
    {children}
  </span>
);
