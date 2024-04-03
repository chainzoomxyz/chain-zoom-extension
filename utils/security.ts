export const SECURITY = [
  {
    key: 'isMintable',
    name: 'Mintable',
    type: 'default',
  },
  {
    key: 'buyTax.max',
    name: 'Buy tax',
    type: 'number',
  },
  {
    key: 'sellTax.max',
    name: 'Sell tax',
    type: 'number',
  },
  {
    key: 'slippageModifiable',
    name: 'Slippage modifiable',
    type: 'default',
  },
  {
    key: 'isOpenSource',
    name: 'Open source',
    type: 'default',
  },
  {
    key: 'isHoneypot',
    name: 'Honeypot',
    type: 'default',
  },
  {
    key: 'isProxy',
    name: 'Proxy contract',
    type: 'default',
  },
  {
    key: 'isBlacklisted',
    name: 'Has blacklist',
    type: 'default',
  },
  {
    key: 'isContractRenounced',
    name: 'Ownership renounced',
    type: 'default',
  },
];

export const SECURITY_STATUS = {
  YES: 'yes',
  NO: 'no',
};

export const SECURITY_TYPE = {
  DEFAULT: 'default',
  NUMBER: 'number',
};
