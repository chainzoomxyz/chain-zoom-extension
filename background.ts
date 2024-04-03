export {};
import { Storage } from '@plasmohq/storage';
import { STORAGE_KEY } from './utils/constants';
import { tokenStore } from './store/TokenStore';
import { handleTokenInfoByTwitterProfile } from './services/backgroundService';

// Disable popup UI when click icon in chrome extension bar
chrome.action.disable();

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const storage = new Storage({
    area: 'local',
  });
  const url = tab.url;

  // Remove token when open Home Twitter
  if (changeInfo.status === 'complete' && url && url.endsWith('/home')) {
    storage.remove(STORAGE_KEY.OPEN_POPUP_ADDRESS);
    storage.remove(STORAGE_KEY.OPEN_POPUP_TOKEN_INFO);
  }
  if (changeInfo.status === 'complete' && url && url.includes('twitter.com')) {
    const regex = /https:\/\/twitter\.com\/([^\/]+)\/?/;
    const match = url.match(regex);
    if (match && match[1]) {
      const username = match[1];
      handleTokenInfoByTwitterProfile(username);
    }
  }
});

// Context menu items
chrome.runtime.onInstalled.addListener(async () => {
  // Disable popup UI when click icon in chrome extension bar
  // chrome.action.disable();
  const storage = new Storage();
  storage.remove(STORAGE_KEY.SHOW_MAIN_POPUP);
  chrome.contextMenus.create({
    id: 'chainzoom-ai',
    title: 'Chainzoom',
    type: 'normal',
    contexts: ['selection'],
  });
});

// Context menu handler
chrome.contextMenus.onClicked.addListener((item, tab) => {
  const storage = new Storage();
  const tokenAddress = item?.selectionText?.startsWith('0x') ? item?.selectionText : '';
  storage.set(STORAGE_KEY.SHOW_MAIN_POPUP, true);
  const { setTokenAddress } = tokenStore;
  setTokenAddress(tokenAddress);
});
