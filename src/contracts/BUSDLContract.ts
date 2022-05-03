/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
import { wallet as wallet3 } from '@cityofzion/neon-js';

import { WalletProvider, Wallet } from '../wallet/wallet';
import { TokenContract } from './TokenContract';
import { USDL_CONTRACT_HASH } from './USDLContract';

const BUSDL_CONTRACT_HASH = process.env.NEXT_PUBLIC_BUSDL_CONTRACT_HASH as string;
const READ_WALLET_PROVIDER = WalletProvider.Neon;

const BUSDLContract = {
  getHash: (): string => BUSDL_CONTRACT_HASH,

  getSymbol: (): string => 'LRB',

  getDecimals: async (wallet: Wallet): Promise<number> => TokenContract.getDecimals(wallet, BUSDL_CONTRACT_HASH),

  getSupply: async (wallet: Wallet): Promise<number> => TokenContract.getSupply(wallet, BUSDL_CONTRACT_HASH),

  getMinted: async (wallet: Wallet): Promise<number> => TokenContract.getMinted(wallet, BUSDL_CONTRACT_HASH),

  getBurned: async (wallet: Wallet): Promise<number> => TokenContract.getBurned(wallet, BUSDL_CONTRACT_HASH),

  getBalance: async (
    wallet: Wallet,
    address: string,
  ): Promise<number> => TokenContract.getBalance(wallet, BUSDL_CONTRACT_HASH, address),

  getUnderlyingSupply: async (
    wallet: Wallet,
  ): Promise<number> => {
    const result = await wallet.invokeRead(READ_WALLET_PROVIDER, {
      scriptHash: BUSDL_CONTRACT_HASH,
      operation: 'getUnderlyingSupply',
      args: [],
      signers: [],
    });

    let underlyingSupply: number = 0;
    if (result && result.state === 'HALT') {
      underlyingSupply = parseInt(result.stack[0].value, 10);
    }

    return underlyingSupply;
  },

  getLoanedSupply: async (
    wallet: Wallet,
  ): Promise<number> => {
    const result = await wallet.invokeRead(READ_WALLET_PROVIDER, {
      scriptHash: BUSDL_CONTRACT_HASH,
      operation: 'getLoanedSupply',
      args: [],
      signers: [],
    });

    let loanedSupply: number = 0;
    if (result && result.state === 'HALT') {
      loanedSupply = parseInt(result.stack[0].value, 10);
    }

    return loanedSupply;
  },

  getR0: async (
    wallet: Wallet,
  ): Promise<number> => {
    const result = await wallet.invokeRead(READ_WALLET_PROVIDER, {
      scriptHash: BUSDL_CONTRACT_HASH,
      operation: 'getR0',
      args: [],
      signers: [],
    });

    let r0: number = 0;
    if (result && result.state === 'HALT') {
      r0 = parseInt(result.stack[0].value, 10);
    }

    return r0;
  },

  getExchangeRate: async (
    wallet: Wallet,
  ): Promise<number> => {
    const result = await wallet.invokeRead(READ_WALLET_PROVIDER, {
      scriptHash: BUSDL_CONTRACT_HASH,
      operation: 'getExchangeRate',
      args: [],
      signers: [],
    });

    let exchangeRate: number = 0;
    if (result && result.state === 'HALT') {
      exchangeRate = parseInt(result.stack[0].value, 10);
    }

    return exchangeRate;
  },

  getLoanBalance: async (
    wallet: Wallet,
    walletProvider: WalletProvider,
    address: string,
  ): Promise<number> => {
    const result = await wallet.invokeRead(walletProvider, {
      scriptHash: BUSDL_CONTRACT_HASH,
      operation: 'loanedBalanceOf',
      args: [
        // Account
        {
          type: 'Hash160',
          value: `${wallet3.getScriptHashFromAddress(address)}`,
        },
      ],
      signers: [],
    });

    let loanedBalance: number = 0;
    if (result && result.state === 'HALT') {
      loanedBalance = parseInt(result.stack[0].value, 10);
    }

    return loanedBalance;
  },

  redeem: async (
    wallet: Wallet,
    walletProvider: WalletProvider,
    quantity: number,
    address: string,
  ): Promise<any> => {
    const result = await wallet.invoke(walletProvider, {
      scriptHash: BUSDL_CONTRACT_HASH,
      operation: 'transfer',
      args: [
        // From the account owner
        {
          type: 'Hash160',
          value: `${wallet3.getScriptHashFromAddress(address)}`,
        },
        // To the BUSDL token hash
        {
          type: 'Hash160',
          value: BUSDL_CONTRACT_HASH,
        },
        // Quantity
        {
          type: 'Integer',
          value: `${quantity}`,
        },
        // Data
        {
          type: 'Array',
          value: [
            {
              type: 'String',
              value: 'ACTION_REDEEM',
            },
          ],
        },
      ],
      broadcastOverride: false,
      signers: [
        {
          account: wallet3.getScriptHashFromAddress(address),
          scopes: 1,
        },
      ],
    });
    return result;
  },

  repay: async (
    wallet: Wallet,
    walletProvider: WalletProvider,
    quantity: number,
    address: string,
  ): Promise<any> => {
    const result = await wallet.invoke(walletProvider, {
      scriptHash: USDL_CONTRACT_HASH,
      operation: 'transfer',
      args: [
        // From the account owner
        {
          type: 'Hash160',
          value: `${wallet3.getScriptHashFromAddress(address)}`,
        },
        // To the BUSDL token hash
        {
          type: 'Hash160',
          value: BUSDL_CONTRACT_HASH,
        },
        // Quantity
        {
          type: 'Integer',
          value: `${quantity}`,
        },
        // Data
        {
          type: 'Array',
          value: [
            {
              type: 'String',
              value: 'ACTION_REPAYMENT',
            },
            // Repaying for self
            {
              type: 'Hash160',
              value: `${wallet3.getScriptHashFromAddress(address)}`,
            },
          ],
        },
      ],
      broadcastOverride: false,
      signers: [
        {
          account: wallet3.getScriptHashFromAddress(address),
          scopes: 1,
        },
      ],
    });
    return result;
  },
};

export { BUSDL_CONTRACT_HASH, BUSDLContract };
