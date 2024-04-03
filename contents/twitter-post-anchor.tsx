import type { PlasmoCSConfig, PlasmoCSUIProps, PlasmoGetInlineAnchorList } from 'plasmo';

import { useStorage } from '@plasmohq/storage/hook';
import { Storage } from '@plasmohq/storage';

import ChainzoomButton from '@/components/ChainzoomButton';
import { type FC, useState } from 'react';
import { STORAGE_KEY } from '@/utils/constants';
import { tokenStore } from '@/store/TokenStore';
import { observer } from 'mobx-react-lite';
import { Box, Popover, Skeleton, Typography } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import { Stack } from '@mui/system';
import { icons } from '@/utils/icons';
import { getInfoBySearchType, isValidCashtag } from '@/utils/helper';
import {
  EXCEPTED_NETWORK,
  SEARCH_TYPE,
  generateTokenTupleStringFromSearch,
} from '@/services/chainzoomApi';
import { cloneDeep, upperCase } from 'lodash';
import { NETWORKS } from '@/utils/wallet';
import { Loading } from '@/components/Loading';

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*'],
};
export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  return document.querySelectorAll("[data-testid='User-Name']");
};

// Use this to optimize unmount lookups
export const getShadowHostId = () => 'twitter-post-inline-anchor';

const TwitterPostInline: FC<PlasmoCSUIProps> = observer(({ anchor }) => {
  const { setTokenAddress, setTokenNetwork } = tokenStore;
  const [cashtags, setCashtags] = useState(cloneDeep([]));
  const [searchingAllCashTags, setSearchingAllCashTags] = useState(false);
  const [searchingSingleCashTag, setSearchingSingleCashTag] = useState(false);
  const [tokenInfos, setTokenInfos] = useState([]);

  // Lấy element của tweet hiện tại
  const tweetElement =
    anchor.element.parentElement.parentElement.parentElement.parentElement.parentElement;

  // Tìm cashtag trong tất cả thẻ a của tweet
  const aTagElements = tweetElement.querySelectorAll('a');
  Array.from(aTagElements)
    .filter((element) => element.textContent.startsWith('$'))
    .forEach((element) => {
      const tokenSymbol = element.textContent;
      const isCashtagExisted =
        cashtags.find((cashtag: string) => upperCase(cashtag) === upperCase(tokenSymbol)) !==
        undefined;
      if (isValidCashtag(tokenSymbol) && !isCashtagExisted) {
        setCashtags([...cashtags, tokenSymbol]);
      }
    });
  anchor.element.parentElement.parentElement.style.width = '100%';
  const containerElement = anchor.element.parentElement;
  containerElement.style.display = 'flex';
  containerElement.style.flexDirection = 'row';
  containerElement.style.justifyContent = 'space-between';
  containerElement.style.width = '100%';

  // Xoá button của Terminal Extension
  setTimeout(() => {
    const terminalButton = document.getElementById('unix-twitter-scan-button');
    if (terminalButton) {
      terminalButton.style.display = 'none';
    }
  }, 400);

  const isSingleCashtag = cashtags.length === 1;

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const showOptions = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const [_, setAddressFromTwitter] = useStorage(
    {
      key: STORAGE_KEY.TWITTER,
      instance: new Storage({
        area: 'local',
      }),
    },
    '',
  );

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [_isOpen, setIsOpen] = useStorage(
    {
      key: STORAGE_KEY.SHOW_MAIN_POPUP,
      instance: new Storage({
        area: 'local',
      }),
    },
    false,
  );

  const textStyle = {
    height: '10px',
    marginRight: isSingleCashtag ? '6px' : '16px',
  };

  const openMainPopup = (tokenInfo: string) => {
    const tokenAddress = getInfoBySearchType(tokenInfo, SEARCH_TYPE.ADDRESS);
    const tokenNetwork = getInfoBySearchType(tokenInfo, SEARCH_TYPE.NETWORK);
    setTokenAddress(tokenAddress);
    setAddressFromTwitter(tokenAddress);
    setTokenNetwork(tokenNetwork);
    setIsOpen(true);
  };

  const openMainPopupFromSingleCashTag = (cashtag: string) => {
    try {
      setSearchingSingleCashTag(true);
      generateTokenTupleStringFromSearch(cashtag.slice(1)).then((tokenInfo) => {
        setSearchingSingleCashTag(false);
        if (tokenInfo) {
          openMainPopup(tokenInfo);
        } else {
          setTokenAddress(NETWORKS[0].TOKEN_ADDRESS);
          setTokenNetwork(NETWORKS[0].NETWORK);
          setAddressFromTwitter(NETWORKS[0].TOKEN_ADDRESS);
          setIsOpen(true);
        }
      });
    } catch (error) {
      setSearchingSingleCashTag(false);
      console.log('openMainPopupFromSingleCashTag ~ error:', error);
    }
  };

  const isValidToken = (tokenInfo: string) => {
    return (
      tokenInfo && EXCEPTED_NETWORK.includes(getInfoBySearchType(tokenInfo, SEARCH_TYPE.NETWORK))
    );
  };

  const renderAvailableCashTags = () => {
    console.log(
      'tokenInfos',
      tokenInfos.filter((tokenInfo) => tokenInfo),
    );

    if (tokenInfos.filter((tokenInfo) => isValidToken(tokenInfo)).length === 0) {
      return (
        <Typography
          sx={{
            '&:hover': {
              cursor: 'pointer',
              background: '#30455A',
              borderRadius: pxToRem(9),
              borderWidth: pxToRem(1),
              borderStyle: 'solid',
              borderColor: '#55D1C2CC',
              width: pxToRem(120),
              ml: pxToRem(2),
            },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: pxToRem(9),
            py: pxToRem(9),
            px: pxToRem(2),
            width: pxToRem(124),
            background: '#2c3849',
            fontWeight: '500',
            color: '#596a82',
          }}
          onClick={(e) => {
            handleClose(e);
            openMainPopup(`WETH^${NETWORKS[0].NETWORK}^${NETWORKS[0].TOKEN_ADDRESS}`);
          }}
        >
          {`$${upperCase(`WETH`)}`}
        </Typography>
      );
    }

    return tokenInfos
      .filter((tokenInfo) => isValidToken(tokenInfo))
      .reverse()
      .map((tokenInfo, index) => {
        const upperCaseSymbol = upperCase(getInfoBySearchType(tokenInfo, SEARCH_TYPE.SYMBOL));
        const network = getInfoBySearchType(tokenInfo, SEARCH_TYPE.NETWORK);
        if (!tokenInfo || !EXCEPTED_NETWORK.includes(network)) return null;
        return (
          <Typography
            sx={{
              '&:hover': {
                cursor: 'pointer',
                background: '#30455A',
                borderRadius: pxToRem(9),
                borderWidth: pxToRem(1),
                borderStyle: 'solid',
                borderColor: '#55D1C2CC',
                width: pxToRem(120),
                ml: pxToRem(2),
              },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: pxToRem(9),
              py: pxToRem(9),
              px: pxToRem(2),
              width: pxToRem(124),
              background: '#2c3849',
              fontWeight: '500',
              color: '#596a82',
            }}
            key={`cashtag-${index}`}
            onClick={(e) => {
              handleClose(e);
              openMainPopup(tokenInfo);
            }}
          >
            {`${upperCaseSymbol.startsWith('$') ? upperCaseSymbol : `$${upperCaseSymbol}`}`}
          </Typography>
        );
      });
  };

  return (
    cashtags.length > 0 && (
      <div
        style={{ position: 'relative', zIndex: 9999 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isSingleCashtag) {
            openMainPopupFromSingleCashTag(cashtags?.[0]);
          } else {
            setSearchingAllCashTags(true);
            Promise.all(
              cashtags.map((cashtag) => generateTokenTupleStringFromSearch(cashtag.slice(1))),
            ).then((tokenAddresses) => {
              setTokenInfos(tokenAddresses);
              setSearchingAllCashTags(false);
            });
            showOptions(e);
          }
        }}
      >
        <ChainzoomButton
          customStyleContainer={{ height: 28 }}
          customStyleLogo={styles.iconStyle}
          customStyleText={textStyle}
        />
        {!isSingleCashtag && (
          <div style={{ position: 'absolute', right: 7, top: 6 }}>
            <AccordionIcon />
          </div>
        )}
        {isSingleCashtag && searchingSingleCashTag && (
          <div style={{ position: 'absolute', left: -16, top: 1 }}>
            <Loading width={28} height={28} />
          </div>
        )}

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          sx={{
            mt: -1,
            ml: 1,
            '& .MuiPaper-root': {
              backgroundColor: 'transparent',
            },
            maxHeight: pxToRem(200),
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box
            sx={{
              background: '#2c3849',
              borderRadius: pxToRem(9),
              borderWidth: pxToRem(1),
              borderStyle: 'solid',
              borderColor: '#78FFCE',
            }}
          >
            {searchingAllCashTags
              ? cashtags.slice(0, 5).map((cashtag) => (
                  <Box key={`cashtag-${cashtag}`} mx={pxToRem(8)} my={pxToRem(12)}>
                    <Skeleton
                      variant="rounded"
                      sx={{ bgcolor: '#596a82' }}
                      width={pxToRem(104)}
                      height={pxToRem(20)}
                      animation="wave"
                    />
                  </Box>
                ))
              : renderAvailableCashTags()}
          </Box>
        </Popover>
      </div>
    )
  );
});
const AccordionIcon = () => {
  return (
    <Stack justifyContent={'center'} alignItems={'center'} width={pxToRem(2)} height={pxToRem(2)}>
      <Box width={pxToRem(2)} height={pxToRem(2)}>
        <img src={icons.downBlackIcon} alt="" width={'100%'} height={'100%'} />
      </Box>
    </Stack>
  );
};

export default TwitterPostInline;

const styles = {
  iconStyle: {
    height: '18px',
    marginRight: '4px',
    marginLeft: '4px',
  },
};
