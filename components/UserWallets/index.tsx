import { Box, Stack } from '@mui/material';
import { images } from '@/utils/images';
import { useState } from 'react';
import { useMetaMask } from 'providers/MetamaskProvider';
import _ from 'lodash';
import { DepositDialog } from '@/components/DepositDialog';
import { Wallets } from '@/components/UserWallets/Wallets';
import { ImportWallet } from '@/components/UserWallets/ImportWallet';
import * as Yup from 'yup';

export const UserWallets = () => {
  const { profile, setOpenDeposit } = useMetaMask();
  const [activeWallet, setActiveWallet] = useState<number>(0);
  const [openDepositDialog, setOpenDepositDialog] = useState(false);
  const [isImportWallet, setIsImportWallet] = useState(false);

  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      position={'absolute'}
      width={1}
      height={1}
      zIndex={1001}
      bgcolor={'background.blur'}
      sx={{
        backdropFilter: 'blur(3.5px)',
      }}
    >
      <Box width={1} height={1} position={'relative'}>
        <Box width={0.5} height={1} position={'absolute'} zIndex={1} sx={{ opacity: 0.05 }}>
          <img src={images.logoUnion} alt="" />
        </Box>
        {!isImportWallet && (
          <Wallets
            profile={profile}
            setOpenDeposit={setOpenDeposit}
            activeWallet={activeWallet}
            setActiveWallet={setActiveWallet}
            setOpenDepositDialog={setOpenDepositDialog}
            setIsImportWallet={setIsImportWallet}
          />
        )}
        {isImportWallet && <ImportWallet setIsImportWallet={setIsImportWallet} />}
      </Box>
      <DepositDialog
        wallet={_.nth(_.get(profile, 'evmWallets', []), activeWallet)}
        isOpen={openDepositDialog}
        setIsOpen={setOpenDepositDialog}
      />
    </Stack>
  );
};
