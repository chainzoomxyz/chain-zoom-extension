import React from 'react';

type ButtonProps = {
  type: 'primary' | 'white' | 'gradient' | 'light';
  label: string;
  prefixIcon?: string;
  icon?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const ButtonBase = ({ type, label, icon, prefixIcon, onClick }: ButtonProps) => {
  const backgroundButton = {
    primary: 'bg-primary',
    white: 'bg-white',
    gradient: 'bg-gradient-to-b from-button-gradient-f to-button-gradient-t',
    light: 'bg-xe-can',
  };

  return (
    <button
      onClick={onClick}
      className={`${
        backgroundButton[type] ? backgroundButton[type] : 'bg-primary'
      } h-[38px] bg-primary px-[14px] relative transform ease-in-out delay-300 hover:bg-gradient-to-b hover:from-button-gradient-f hover:to-button-gradient-t  cursor-pointer w-[288px] rounded-lg max-w-full  flex items-center`}
    >
      {prefixIcon && (
        <div className={'h-full w-[50px] absolute left-0 top-0 flex justify-center items-center'}>
          <img src={prefixIcon} alt="" />
        </div>
      )}
      <div className={'flex-1 flex justify-center items-center gap-2'}>
        {icon && <img src={icon} alt="" />}
        <p className={`${type === 'primary' || type === 'light' ? 'text-white' : 'text-primary'}`}>
          {label}
        </p>
      </div>
    </button>
  );
};
