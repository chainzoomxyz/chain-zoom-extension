import { ethers } from 'ethers';

export const ERC20_TOKEN_ABI = [
  'function balanceOf(address walletAddress) view returns (uint256)',
  'function decimals() view returns (uint256)',
];

export const getErc20TokenBalance = async (
  contractAddress: string,
  userWalletAddress: string,
  rpcUrl: string,
) => {
  const etherDefaultProvider = ethers.getDefaultProvider(rpcUrl);
  const erc20TokenContract = new ethers.Contract(
    contractAddress,
    ERC20_TOKEN_ABI,
    etherDefaultProvider,
  );
  return erc20TokenContract.balanceOf(userWalletAddress);
};

export const getErc20TokenDecimals = async (contractAddress: string, rpcUrl: string) => {
  const etherDefaultProvider = ethers.getDefaultProvider(rpcUrl);
  const erc20TokenContract = new ethers.Contract(
    contractAddress,
    ERC20_TOKEN_ABI,
    etherDefaultProvider,
  );
  return await erc20TokenContract.decimals();
};
export const getNativeTokenBalance = async (rpcUrl: string, userWalletAddress: string) => {
  const etherDefaultProvider = ethers.getDefaultProvider(rpcUrl);
  // const txReceipt = await etherDefaultProvider.getTransactionReceipt()
  return etherDefaultProvider.getBalance(userWalletAddress);
};
