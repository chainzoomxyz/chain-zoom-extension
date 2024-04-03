import logo from 'data-base64:~assets/logo-black.svg';
import text from 'data-base64:~assets/text-black.svg';
import React from 'react';

const ChainzoomButton = ({
  customStyleContainer,
  customStyleLogo,
  customStyleText,
}: {
  customStyleContainer?: React.CSSProperties;
  customStyleLogo?: React.CSSProperties;
  customStyleText?: React.CSSProperties;
}) => {
  const buttonStyle = {
    border: 'none',
    borderRadius: '83px',
    background: 'linear-gradient(93deg, #78FFCE 5.87%, #0BC0E8 95.88%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    marginLeft: '8px',
    cursor: 'pointer',
    height: '36px',
    zIndex: 9999,
  };

  const iconStyle = {
    height: '20px',
    marginRight: '6px',
    marginLeft: '12px',
  };

  const textStyle = {
    height: '13px',
    marginRight: '12px',
  };

  return (
    <button style={{ ...buttonStyle, ...customStyleContainer }} className="styled-button">
      <img src={logo} alt="Extension Icon" style={{ ...iconStyle, ...customStyleLogo }} />
      <img src={text} alt="Extension Icon" style={{ ...textStyle, ...customStyleText }} />
    </button>
  );
};

export default ChainzoomButton;
