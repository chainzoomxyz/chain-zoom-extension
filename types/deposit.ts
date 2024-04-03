export type DepositParams = {
  targetAddress: string;
  value: string;
  valueInWei: {
    _hex: string;
    _isBigNumber: boolean;
  };
};
