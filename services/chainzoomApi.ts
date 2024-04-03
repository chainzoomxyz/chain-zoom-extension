import {request} from '@/utils/axios';
import {API_BASE_URL, DEXSCREENNER_BASE_URL, STORAGE_KEY} from '@/utils/constants';
import {upperCase} from 'lodash';
import {Storage} from '@plasmohq/storage';
import type {Pair} from '@/types/pair';
import type {TokenInfoTwitter} from '@/types/token';

export const getTokenInfoByTwitter = async (twitter: string): Promise<TokenInfoTwitter> => {
  const response = await fetch(`${API_BASE_URL}/token/token-info/twitter?search=${twitter}&id=1`);
  const data = await response.json();
  return data;
};

export const getTokenInfoOverview = async (symbolOrAddress: string) => {
  const url = `/token/token-overview?tokenAddress=${symbolOrAddress}&chainId=1`;
  const response = await request.get(url);
  return response;
};

export const searchToken = async (search: string) => {
  const response = await fetch(`${API_BASE_URL}/dexscreener/search/public?q=${search}&chainID=all`);
  const data = await response.json();
  return data;
};

export const searchTokenBySymbol = async (search: string) => {
  const response = await fetch(`${API_BASE_URL}/token/token-info/symbol?search=${search}`);
  const data = await response.json();
  return data;
};

const storage = new Storage();

export const SEARCH_TYPE = {
  SYMBOL: 0,
  NETWORK: 1,
  ADDRESS: 2,
};

export const EXCEPTED_NETWORK = ['ethereum', 'polygon', 'base', 'solana', 'sui'];

export const getMaxLiquidityPair = (pairs: Pair[], search: string) => {
  const maxLiquidityPair = pairs
    .filter((pair) => pair.baseToken.symbol.toUpperCase() === search.toUpperCase())
    .reduce(
      (currentMaxPair, pair) => {
        return pair.liquidity?.usd > currentMaxPair.liquidity?.usd ? pair : currentMaxPair;
      },
      { liquidity: { usd: -Infinity } } as Pair,
    );
  return maxLiquidityPair;
};

export const generateTokenTupleStringFromSearch = async (search: string) => {
  try {
    const tokenInfoTupleInStorage = await storage.get(search);
    if (tokenInfoTupleInStorage) {
      return tokenInfoTupleInStorage;
    } else {
      const maxLiquidityPair = await searchOnDexscreener(search);
      const { baseToken, chainId = '' } = maxLiquidityPair || {};
      const { address = '', symbol = '' } = baseToken || {};
      const tokenInfoTuple = `${upperCase(symbol)}^${chainId}^${address}`;
      storage.set(search, tokenInfoTuple);
      storage.set(`${upperCase(symbol)}-info`, JSON.stringify(maxLiquidityPair));
      storage.set(STORAGE_KEY.OPEN_POPUP_TOKEN_INFO, JSON.stringify(maxLiquidityPair));
      if (EXCEPTED_NETWORK.includes(chainId)) {
        return tokenInfoTuple;
      }
    }
  } catch (error) {
    console.log('searchOnDexscreener ~ error:', error);
    return null;
  }
};

export const searchOnDexscreener = async (search: string): Promise<Pair | null> => {
  try {
    const response = await fetch(`${DEXSCREENNER_BASE_URL}/latest/dex/search/?q=${search}`);
    const { pairs = [] } = await JSON.parse(await response.text());
    const maxLiquidityPair = getMaxLiquidityPair(pairs, search);
    return maxLiquidityPair;
  } catch (error) {
    console.log('searchOnDexscreener ~ error:', error);
    return null;
  }
};


