import _ from 'lodash';

export const debouncedTyping = _.debounce(
  (value: string, setKeyword: (value: string) => void): void => {
    setKeyword(value);
  },
  300,
);
