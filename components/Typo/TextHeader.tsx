export const TextHeader = ({
  children,
  first,
  last,
}: {
  children: React.ReactNode;
  first?: boolean;
  last?: boolean;
}) => (
  <div
    style={{
      color: '#FFF',
      fontFamily: 'IBM Plex Sans Condensed, sans-serif',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '120%',
      textAlign: last ? 'center' : 'left',
      paddingLeft: first ? 12 : 0,
      paddingRight: last ? 12 : 0,
    }}
  >
    {children}
  </div>
);
