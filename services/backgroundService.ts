import { STORAGE_KEY } from '@/utils/constants';
import { Storage } from '@plasmohq/storage';
import { getTokenInfoByTwitter, searchOnDexscreener } from './chainzoomApi';
import { upperCase } from 'lodash';

const storage = new Storage({
  area: 'local',
});

export const handleTokenInfoByTwitterProfile = async (twitterProfile: string) => {
  const tokenTupleInStorage = await storage.get(twitterProfile); // <symbol>^<network>^<address>
  if (tokenTupleInStorage) {
    const [symbol, network, address] = tokenTupleInStorage.split('^');
    updateStorageToOpenPopup(address, network);
    const tokenInfoInStorage = await storage.get(`${upperCase(symbol)}-info`);
    if (tokenInfoInStorage) {
      storage.set(STORAGE_KEY.OPEN_POPUP_TOKEN_INFO, tokenInfoInStorage);
    } else {
      getAndSaveTokenInfoFromDexscreenner(symbol);
    }
  } else {
    try {
      const tokenInfoTwitter = await getTokenInfoByTwitter(twitterProfile);
      const { tokenSymbol: symbol } = tokenInfoTwitter || {};
      const pair = await getAndSaveTokenInfoFromDexscreenner(symbol);
      const { baseToken, chainId = '' } = pair || {};
      const { address = '' } = baseToken || {};
      updateStorageToOpenPopup(address, chainId);
      storage.set(twitterProfile, `${upperCase(symbol)}^${chainId}^${address}`);
    } catch (error) {
      resetOpenPopupStorage();
      console.log('handleTokenInfoByTwitterProfile ~ error:', error);
    }
  }
};

export const resetOpenPopupStorage = () => {
  storage.remove(STORAGE_KEY.OPEN_POPUP_ADDRESS);
  storage.remove(STORAGE_KEY.OPEN_POPUP_NETWORK);
  storage.remove(STORAGE_KEY.OPEN_POPUP_TOKEN_INFO);
};

export const updateStorageToOpenPopup = (address: string, network: string) => {
  storage.set(STORAGE_KEY.OPEN_POPUP_ADDRESS, address);
  storage.set(STORAGE_KEY.OPEN_POPUP_NETWORK, network);
};

export const getAndSaveTokenInfoFromDexscreenner = async (symbol: string) => {
  const pair = await searchOnDexscreener(symbol);
  const { baseToken, chainId = '' } = pair || {};
  const { address = '' } = baseToken || {};
  const tokenTuple = `${upperCase(symbol)}^${chainId}^${address}`;
  // Save tuple fo cashtag by token symbol
  storage.set(upperCase(symbol), tokenTuple);
  // Save token info for Overview screen
  storage.set(STORAGE_KEY.OPEN_POPUP_TOKEN_INFO, JSON.stringify(pair));
  // Save token info by token symbol
  storage.set(`${upperCase(symbol)}-info`, JSON.stringify(pair));
  return pair;
};
