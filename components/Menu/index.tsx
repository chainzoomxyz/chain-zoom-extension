import React, { useState } from 'react';

import { MENU_ITEMS } from '../../utils/constants';

export const Menu = ({ active, setActive }: { active: string; setActive: any }) => {
  return (
    <div className={'mt-[30px] px-5 flex flex-col gap-6'}>
      {MENU_ITEMS.map((item) => {
        return (
          <div
            key={item.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setActive(item.id);
            }}
          >
            <img src={item.id === active ? item.iconActive : item.icon} alt={item.label} />
            <p className="text-base text-white">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
};
