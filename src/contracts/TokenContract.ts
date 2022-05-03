import { wallet as wallet3 } from '@cityofzion/neon-js';

import { WalletProvider, Wallet } from '../wallet/wallet';

const READ_WALLET_PROVIDER = WalletProvider.Neon;

const TokenContract = {
  getSymbol: async (
    wallet: Wallet,
    contractHash: string,
  ): Promise<string> => {
    const result = await wallet.invokeRead(READ_WALLET_PROVIDER, {
      scriptHash: contractHash,
      operation: 'symbol',
      args: [],
      signers: [],
    });

    let symbol: string = '';
    if (result && result.state === 'HALT') {
      symbol = atob(result.stack[0].value as string);
    }

    return symbol;
  },

  getDecimals: async (
    wallet: Wallet,
    contractHash: string,
  ): Promise<number> => {
    const result = await wallet.invokeRead(READ_WALLET_PROVIDER, {
      scriptHash: contractHash,
      operation: 'decimals',
      args: [],
      signers: [],
    });

    let decimals: number = 0;
    if (result && result.state === 'HALT') {
      decimals = (result.stack[0].value as unknown) as number;
    }

    return decimals;
  },

  getSupply: async (
    wallet: Wallet,
    contractHash: string,
  ): Promise<number> => {
    const result = await wallet.invokeRead(READ_WALLET_PROVIDER, {
      scriptHash: contractHash,
      operation: 'totalSupply',
      args: [],
      signers: [],
    });

    let supply: number = 0;
    if (result && result.state === 'HALT') {
      supply = (result.stack[0].value as unknown) as number;
    }

    return supply;
  },

  getMinted: async (
    wallet: Wallet,
    contractHash: string,
  ): Promise<number> => {
    const result = await wallet.invokeRead(READ_WALLET_PROVIDER, {
      scriptHash: contractHash,
      operation: 'totalMinted',
      args: [],
      signers: [],
    });

    let minted: number = 0;
    if (result && result.state === 'HALT') {
      minted = (result.stack[0].value as unknown) as number;
    }

    return minted;
  },

  getBurned: async (
    wallet: Wallet,
    contractHash: string,
  ): Promise<number> => {
    const result = await wallet.invokeRead(READ_WALLET_PROVIDER, {
      scriptHash: contractHash,
      operation: 'totalBurned',
      args: [],
      signers: [],
    });

    let burned: number = 0;
    if (result && result.state === 'HALT') {
      burned = (result.stack[0].value as unknown) as number;
    }

    return burned;
  },

  getBalance: async (
    wallet: Wallet,
    contractHash: string,
    address: string,
  ): Promise<number> => {
    const result = await wallet.invokeRead(READ_WALLET_PROVIDER, {
      scriptHash: contractHash,
      operation: 'balanceOf',
      args: [
        {
          type: 'Hash160',
          value: `${wallet3.getScriptHashFromAddress(address)}`,
        },
      ],
      signers: [],
    });

    let balance: number = 0;
    if (result && result.state === 'HALT') {
      balance = (result.stack[0].value as unknown) as number;
    }

    return balance;
  },
};

export { TokenContract };
