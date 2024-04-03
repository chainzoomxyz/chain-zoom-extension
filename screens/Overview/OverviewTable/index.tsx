import React from 'react';
import { Box, Button, Tab, Tabs, type TabsProps, Typography } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import styled from '@emotion/styled';
import { ConnectWallet } from '@/components/ConnectWallet';
import { useMetaMask } from '@/providers/MetamaskProvider';
import _ from 'lodash';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const TabList = styled(Tabs)<TabsProps>(({ theme }) => {
  return {
    minHeight: 26,
    padding: '0 12px',
    '& .MuiTabs-flexContainer': {
      // backgroundColor: theme.palette.common.transparent,
      minHeight: 26,
      height: 26,
    },
    '& .MuiTab-root': {
      marginRight: 16,
      height: 26,
      minHeight: 26,
      fontSize: 12,
      fontWeight: 600,
    },
    '& .MuiTabs-indicator': {
      height: 1,
    },
  };
});

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const OverviewTable = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { wallet } = useMetaMask();
  return (
    <Box borderRadius={pxToRem(14)} flex={1} bgcolor={'background.default'} position={'relative'}>
      {_.get(wallet, 'accounts', []).length === 0 && <ConnectWallet />}
      <Box width={1} height={1}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            scrollButtons={false}
            visibleScrollbar={true}
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Balance" {...a11yProps(0)} />
            <Tab label="Transactions" {...a11yProps(1)} />
            <Tab label="Shill history" {...a11yProps(2)} />
          </TabList>
        </Box>
        <CustomTabPanel value={value} index={0}>
          Button
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Transactions
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Shill history
        </CustomTabPanel>
      </Box>
    </Box>
  );
};
