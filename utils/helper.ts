import type { ChartData, FreshWallet, OhlcPrice, TopHolder } from '@/models';
import moment from 'moment';

const granKeywords = {
  '7D': ['01', '07', '13', '19'],
  '14D': ['01', '13'],
  '30D': [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
  ],
};

export const R2_BUCKET_URL = 'https://pub-b45229b3c3c342b1bc12b1c85bdcf8f8.r2.dev/';

export const r2ImageUrl = (path: string) => `${R2_BUCKET_URL}${path}`;

export const numberFormat = (value: number) => {
  return new Intl.NumberFormat('de-DE').format(value);
};
export const copyToClipboard = (value: string) => {
  navigator.clipboard.writeText(value);
};
const checkInclusion = (time: string, words: string[]) => {
  const hour = time.split(' ')[1].split(':')[0];
  if (words.includes(hour)) {
    return true;
  }
  return false;
};
export const transformPriceData = (arr: OhlcPrice[] = [], timeRange: string): ChartData[] => {
  const result = [] as ChartData[];
  for (let i = 0; i < arr.length; i++) {
    if (checkInclusion(arr[i].date_open, granKeywords[timeRange])) {
      result.push({
        time: moment(arr[i].date_open).unix(),
        value: arr[i].price_close,
      } as never);
    }
  }
  return result;
};

export const generateChartDataWithGranularity = (
  arr: any[],
  words: string[],
  fieldName: string,
) => {
  let result = [];
  let index1 = 0;
  let index2 = 0;

  for (let i = 0; i < arr.length; i++) {
    if (checkInclusion(arr[i].timestamp, words)) {
      index2 = i;
      let totalInRange = 0;
      for (let j = index1; j <= index2; j++) {
        totalInRange += arr[j][fieldName];
      }
      index1 = index2 + 1;
      result.push({
        time: moment(arr[i].timestamp).unix(),
        value: totalInRange,
      } as never);
    }
  }
  return result;
};

export const transformFreshWalletData = (
  wallets: FreshWallet[] = [],
  timeRange: string,
): ChartData[] => {
  return generateChartDataWithGranularity(wallets, granKeywords[timeRange], 'amount');
};

export const transformTopHolderData = (
  holders: TopHolder[] = [],
  timeRange: string,
): ChartData[] => {
  return generateChartDataWithGranularity(holders, granKeywords[timeRange], 'netflow');
};

export const formatBalance = (rawBalance: any, decimalPlaces: number) => {
  const p = Math.pow(10, decimalPlaces);
  const n = rawBalance * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (address: string) => {
  return `${address.substring(0, 4)}...${address.substring(address.length - 3)}`;
};

export const ellipsisString = (string: string, startPosition = 7, endPosition = 7) => {
  return `${string.substring(0, startPosition)}...${string.substring(string.length - endPosition)}`;
};

export const substringAddress = (
  address: `0x${string}` | undefined,
  start: number = 12,
  end: number = 12,
) => {
  return `${address?.substring(0, start)}...${address?.substring(address.length - end)}`;
};

export const formatSymbolCurrency = (number: number, digits: number) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const absNumber = Math.abs(number); // Get the absolute value for lookup and formatting
  const item = lookup
    .slice()
    .reverse()
    .find((item) => absNumber >= item.value); // Use slice().reverse() to find the last matching item
  const formattedNumber = item
    ? (absNumber / item.value).toFixed(digits).replace(regexp, '').concat(item.symbol)
    : '0';
  return number < 0 ? `-${formattedNumber}` : formattedNumber; // Prepend "-" if the original number was negative
};

export const abbreviateNumber = (number: number, decimalPlaces: number): string => {
  const decPlacesMultiplier = Math.pow(10, decimalPlaces);
  const abbreviations = ['K', 'M', 'B', 'T'];

  for (let i = abbreviations.length - 1; i >= 0; i--) {
    const size = Math.pow(10, (i + 1) * 3);
    if (size <= number) {
      number = Math.round((number * decPlacesMultiplier) / size) / decPlacesMultiplier;
      if (number === 1000 && i < abbreviations.length - 1) {
        number = 1;
        i++;
      }
      return number + abbreviations[i];
    }
  }

  return number.toString();
};

export function formatVerySmallNumber(numStr: string) {
  if (+numStr > 1)
    return {
      formattedNumberInString: parseFloat(numStr).toFixed(2),
      zerosCount: 0,
      significantDigits: '',
    };
  const formatted = parseFloat(numStr).toFixed(36);
  let indexOfFirstNonZeroAfterDot = formatted.indexOf('.') + 1;
  while (formatted[indexOfFirstNonZeroAfterDot] === '0') {
    indexOfFirstNonZeroAfterDot++;
  }

  // Số lượng số 0 sau dấu phẩy và trước số khác 0
  let zerosCount = indexOfFirstNonZeroAfterDot - formatted.indexOf('.') - 1;
  if (zerosCount <= 2) {
    return {
      formattedNumberInString: parseFloat(numStr).toFixed(zerosCount + 2),
      zerosCount,
      significantDigits: '',
    };
  }
  // Lấy 4 số khác 0 đầu tiên sau các số 0, làm tròn nếu cần
  let significantDigits = formatted.substring(
    indexOfFirstNonZeroAfterDot,
    indexOfFirstNonZeroAfterDot + 4,
  );
  if (significantDigits.length > 1) {
    // Nếu có ít nhất 2 số khác 0
    let rounded = parseFloat('0.' + significantDigits).toFixed(2);
    significantDigits = rounded.toString().substring(2, 4); // Cắt '0.' ở đầu
  }

  return {
    formattedNumberInString: `0.0(${zerosCount})${significantDigits}`,
    zerosCount,
    significantDigits,
  };
}

export function convertDateToDiffInDay(date: string) {
  const dateTime = moment(date, 'YYYYMMDD HH:mm:ss');
  const now = moment();
  const diffInDays = now.diff(dateTime, 'days');
  let resultString;
  if (diffInDays < 1) {
    resultString = convertDateToDiffInHours(date);
  } else {
    resultString = `${diffInDays} days ago`;
  }

  return resultString;
}

export function convertDateToDiffInHours(date: string) {
  const dateTime = moment(date, 'YYYYMMDD HH:mm:ss');
  const now = moment();
  const diffInHours = now.diff(dateTime, 'hours');
  let resultString;
  if (diffInHours < 1) {
    resultString = convertDateToDiffInMinutes(date);
  } else {
    resultString = `${diffInHours} hours ago`;
  }

  return resultString;
}

export function convertDateToDiffInMinutes(date: string) {
  const dateTime = moment(date, 'YYYYMMDD HH:mm:ss');
  const now = moment();
  const diffInMinutes = now.diff(dateTime, 'minute');
  let resultString;
  if (diffInMinutes < 1) {
    resultString = 'a few second';
  } else {
    resultString = `${diffInMinutes} minutes ago`;
  }

  return resultString;
}

export const roundBalance = (value: number, digits: number) => {
  const pow = Math.pow(10, digits);
  return Math.round((value + Number.EPSILON) * pow) / pow;
};

export function isValidCashtag(input: string): boolean {
  const regex = /^\$(?!BTC|ETH|WETH|WBTC|USDC|SOL|USDT|FDUSD|DAI)(?=.*[^\d]).*$/;
  return regex.test(input);
}

export const scientificToDecimal = (num: number) => {
  var nsign = Math.sign(num);
  //remove the sign
  num = Math.abs(num);
  //if the number is in scientific notation remove it
  // @ts-ignore
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    var zero = '0',
      parts = String(num).toLowerCase().split('e'), //split into coeff and exponent
      e = parts.pop(), //store the exponential part
      // @ts-ignore
      l = Math.abs(e), //get the number of zeros
      // @ts-ignore
      sign = e / l,
      coeff_array = parts[0].split('.');
    if (sign === -1) {
      l = l - coeff_array[0].length;
      if (l < 0) {
        // @ts-ignore
        num =
          coeff_array[0].slice(0, l) +
          '.' +
          coeff_array[0].slice(l) +
          (coeff_array.length === 2 ? coeff_array[1] : '');
      } else {
        // @ts-ignore
        num = zero + '.' + new Array(l + 1).join(zero) + coeff_array.join('');
      }
    } else {
      var dec = coeff_array[1];
      if (dec) l = l - dec.length;
      if (l < 0) {
        // @ts-ignore
        num = coeff_array[0] + dec.slice(0, l) + '.' + dec.slice(l);
      } else {
        // @ts-ignore
        num = coeff_array.join('') + new Array(l + 1).join(zero);
      }
    }
  }

  return nsign < 0 ? '-' + num : num;
};

export const getInfoBySearchType = (str: string = '', enumKey: number) => {
  const parts = str?.split?.('^');
  switch (enumKey) {
    case 0:
      return parts[0];
    case 1:
      return parts[1];
    case 2:
      return parts[2];
    default:
      return null;
  }
};

export const parseSafeJson = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
}