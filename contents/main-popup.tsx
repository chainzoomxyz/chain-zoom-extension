import type { PlasmoCSConfig } from 'plasmo';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MetaMaskContextProvider } from 'providers/MetamaskProvider';
import { TokenContextProvider } from '@/providers/TokenProvider';
import { NetworkContextProvider } from 'providers/NetworkProvider';
import { CustomThemeProvider } from '@/theme';
import { Layout } from '@/components/Layout';
import { Overview } from '@/screens/Overview';
import { FreshWallet } from '@/screens/FreshWallet';
import { TopHolder } from '@/screens/TopHolder';
import { Portfolio } from '@/screens/portfolio/Portfolio';
import { Point } from '@/screens/Point/Point';

import _ from 'lodash';

const queryClient = new QueryClient();

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*', 'https://etherscan.io/*', 'https://swap.cow.fi/*'],
};
const styleElement = document.createElement('style');

export const getStyle = () => styleElement;

// Inject into the ShadowDOM
export const getShadowHostId = () => 'main-popup-host';

const pages = {
  overview: <Overview />,
  'fresh-wallet': <FreshWallet />,
  'top-holder': <TopHolder />,
  portfolio: <Portfolio />,
  point: <Point />,
};

const FIRST_PAGE = 'overview';

const MainPopup = () => {
  const [activePage, setActivePage] = useState<string>(FIRST_PAGE);

  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <NetworkContextProvider>
          <TokenContextProvider>
            <MetaMaskContextProvider>
              <Layout
                setActivePage={setActivePage}
                activePage={activePage}
                defaultPage={FIRST_PAGE}
              >
                {_.get(pages, activePage)}
              </Layout>
            </MetaMaskContextProvider>
          </TokenContextProvider>
        </NetworkContextProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  );
};

export default MainPopup;
