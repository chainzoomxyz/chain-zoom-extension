import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';

import { useStorage } from '@plasmohq/storage/hook';
import { Storage } from '@plasmohq/storage';

import ChainzoomButton from '@/components/ChainzoomButton';
import { useEffect } from 'react';
import { STORAGE_KEY } from '@/utils/constants';
import { tokenStore } from '@/store/TokenStore';
import { observer } from 'mobx-react-lite';

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*'],
};

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const followAnchor = document.querySelector(
    "[data-testid='placementTracking'] > [style='min-width: 81px;']",
  );
  const unfollowAnchor = document.querySelector(
    "[data-testid='placementTracking'] > [style='min-width: 104px;']",
  );
  return followAnchor || unfollowAnchor;
};

// Use this to optimize unmount lookups
export const getShadowHostId = () => 'twitter-inline-anchor';

const TwitterInline = observer(() => {
  const element = document.querySelector("[data-testid='placementTracking']") as HTMLElement;
  element.style.display = 'flex';
  element.style.flexDirection = 'row';

  const [_isOpen, setIsOpen] = useStorage(
    {
      key: STORAGE_KEY.SHOW_MAIN_POPUP,
      instance: new Storage({
        area: 'local',
      }),
    },
    false,
  );
  const [tokenAddressFromTwitter] = useStorage(
    {
      key: STORAGE_KEY.OPEN_POPUP_ADDRESS,
      instance: new Storage({
        area: 'local',
      }),
    },
    '',
  );
  const [network] = useStorage(
    {
      key: STORAGE_KEY.OPEN_POPUP_NETWORK,
      instance: new Storage({
        area: 'local',
      }),
    },
    '',
  );

  const { setTokenAddress, setTokenNetwork, setChainId } = tokenStore;
  useEffect(() => {
    setTokenAddress(tokenAddressFromTwitter);
  }, [tokenAddressFromTwitter]);

  return tokenAddressFromTwitter ? (
    <div
      onClick={() => {
        try {
          setTokenAddress(tokenAddressFromTwitter);
          setTokenNetwork(network);
          setIsOpen(true);
        } catch (error) {
          console.log('TwitterInline ~ error:', error);
        }
      }}
    >
      <ChainzoomButton />
    </div>
  ) : null;
});

export default TwitterInline;
