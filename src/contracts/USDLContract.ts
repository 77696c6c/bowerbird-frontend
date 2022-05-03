/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
import { wallet as wallet3 } from '@cityofzion/neon-js';

import { WalletProvider, Wallet } from '../wallet/wallet';
import { BUSDL_CONTRACT_HASH } from './BUSDLContract';
import { TokenContract } from './TokenContract';

const USDL_CONTRACT_HASH = process.env.NEXT_PUBLIC_USDL_CONTRACT_HASH as string;

const USDLContract = {
  getHash: (): string => USDL_CONTRACT_HASH,

  getSymbol: (): string => 'USDL',

  getDecimals: async (wallet: Wallet): Promise<number> => TokenContract.getDecimals(wallet, USDL_CONTRACT_HASH),

  getSupply: async (wallet: Wallet): Promise<number> => TokenContract.getSupply(wallet, USDL_CONTRACT_HASH),

  getMinted: async (wallet: Wallet): Promise<number> => TokenContract.getMinted(wallet, USDL_CONTRACT_HASH),

  getBurned: async (wallet: Wallet): Promise<number> => TokenContract.getBurned(wallet, USDL_CONTRACT_HASH),

  getBalance: async (
    wallet: Wallet,
    address: string,
  ): Promise<number> => TokenContract.getBalance(wallet, USDL_CONTRACT_HASH, address),

  deposit: async (
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
              value: 'ACTION_DEPOSIT',
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

export { USDL_CONTRACT_HASH, USDLContract };
