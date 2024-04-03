import { Connection, PublicKey } from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';

// export const getSolNativeBalance = async (keyPair: PublicKey): Promise<number> => {
//   const connection = new Connection(SOL_RPC_URL);
//   let balance = await connection.getBalance(keyPair);
//   const uiBalance = balance / LAMPORTS_PER_SOL;
//   return uiBalance;
// };

export const getSplTokenBalance = async (
  walletAddress: string,
  tokenMintAddress: string,
  rpcUrl: string,
): Promise<number> => {
  // Get all token accounts associated with the wallet address
  console.log(walletAddress, tokenMintAddress, rpcUrl);
  const connection = new Connection(rpcUrl);
  const address = new PublicKey(walletAddress);
  const tokenAccounts = await connection.getTokenAccountsByOwner(address, {
    programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  });

  // Find the token account with the specified mint address
  const tokenAccount = tokenAccounts.value.find((account) => {
    const accountInfo = AccountLayout.decode(account.account.data);
    return accountInfo.mint.toString() === tokenMintAddress.toString();
  });

  if (tokenAccount) {
    const tokenBalance = await connection.getTokenAccountBalance(tokenAccount.pubkey);
    console.log(`Token Balance: ${tokenBalance.value.uiAmount}`);
    return tokenBalance.value.uiAmount;
  } else {
    console.log('No token account found for the specified mint address');
    return 0;
  }
};

export const getSolanaTokenDecimals = async (tokenAddress: string, rpcUrl: string) => {
  const connection = new Connection(rpcUrl);

  let mintAccountInfo = await connection.getParsedAccountInfo(new PublicKey(tokenAddress));

  if (mintAccountInfo && mintAccountInfo.value) {
    const data = mintAccountInfo.value.data;
    if ('parsed' in data && data.program === 'spl-token') {
      return data.parsed.info.decimals;
    } else {
      console.log('Invalid mint account data');
      return 0;
    }
  } else {
    console.log('Failed to get mint account info');
    return 0;
  }
};
