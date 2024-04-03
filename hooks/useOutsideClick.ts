import { useEffect, useRef } from 'react';

export const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      const { top, left, width, height } = rect || {};
      const x = event.clientX;
      const y = event.clientY;
      if (x < left || x > left + width || y < top || y > top + height) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};
