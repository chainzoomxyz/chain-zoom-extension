import { action, makeObservable, observable } from 'mobx';

class TokenStore {
  tokenAddress?: string = '';
  chainId?: number = null;
  network?: string = '';
  constructor() {
    makeObservable(this, {
      tokenAddress: observable,
      setTokenAddress: action.bound,
      chainId: observable,
      setChainId: action.bound,
      network: observable,
      setTokenNetwork: action.bound,
    });
  }

  setTokenAddress(address: string) {
    this.tokenAddress = address;
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }

  setTokenNetwork(network: string) {
    this.network = network;
  }
}

export const tokenStore = new TokenStore();
