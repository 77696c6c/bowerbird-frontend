import { wallet as wallet3 } from '@cityofzion/neon-js';

import { WalletProvider, Wallet } from '../wallet/wallet';

const NEST_CONTRACT_HASH = process.env.NEXT_PUBLIC_NEST_CONTRACT_HASH as string;
const READ_WALLET_PROVIDER = WalletProvider.Neon;

const NestContract = {
  getHash: (): string => NEST_CONTRACT_HASH,

  getLoanToValue: async (
    wallet: Wallet,
    collateralHash: string,
  ): Promise<number> => {
    const result = await wallet.invokeRead(READ_WALLET_PROVIDER, {
      scriptHash: NEST_CONTRACT_HASH,
      operation: 'getLoanToValue',
      args: [
        // Collateral token
        {
          type: 'Hash160',
          value: collateralHash,
        },
      ],
      signers: [],
    });

    let loanToValue: number = 0;
    if (result && result.state === 'HALT') {
      loanToValue = parseInt(result.stack[0].value, 10);
    }

    return loanToValue;
  },

  getCollateralBalance: async (
    wallet: Wallet,
    walletProvider: WalletProvider,
    collateralHash: string,
    address: string,
  ): Promise<number> => {
    const result = await wallet.invokeRead(walletProvider, {
      scriptHash: NEST_CONTRACT_HASH,
      operation: 'getCollateralBalance',
      args: [
        // Collateral token
        {
          type: 'Hash160',
          value: collateralHash,
        },
        // Account
        {
          type: 'Hash160',
          value: `${wallet3.getScriptHashFromAddress(address)}`,
        },
      ],
      signers: [],
    });

    let collateralBalance: number = 0;
    if (result && result.state === 'HALT') {
      collateralBalance = parseInt(result.stack[0].value, 10);
    }

    return collateralBalance;
  },

  depositCollateral: async (
    wallet: Wallet,
    walletProvider: WalletProvider,
    collateralHash: string,
    quantity: number,
    address: string,
  ): Promise<any> => {
    const result = await wallet.invoke(walletProvider, {
      scriptHash: collateralHash,
      operation: 'transfer',
      args: [
        // From the account owner
        {
          type: 'Hash160',
          value: `${wallet3.getScriptHashFromAddress(address)}`,
        },
        // To the Nest token hash
        {
          type: 'Hash160',
          value: NEST_CONTRACT_HASH,
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
              value: 'ACTION_COLLATERALIZE',
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

  withdrawCollateral: async (
    wallet: Wallet,
    walletProvider: WalletProvider,
    collateralHash: string,
    quantity: number,
    address: string,
  ): Promise<any> => {
    const result = await wallet.invoke(walletProvider, {
      scriptHash: NEST_CONTRACT_HASH,
      operation: 'withdrawCollateral',
      args: [
        // From the account owner
        {
          type: 'Hash160',
          value: `${wallet3.getScriptHashFromAddress(address)}`,
        },
        // The collateral token
        {
          type: 'Hash160',
          value: collateralHash,
        },
        // Quantity
        {
          type: 'Integer',
          value: `${quantity}`,
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

  borrow: async (
    wallet: Wallet,
    walletProvider: WalletProvider,
    loanHash: string,
    quantity: number,
    address: string,
  ): Promise<any> => {
    const result = await wallet.invoke(walletProvider, {
      scriptHash: NEST_CONTRACT_HASH,
      operation: 'loan',
      args: [
        // For the account owner
        {
          type: 'Hash160',
          value: `${wallet3.getScriptHashFromAddress(address)}`,
        },
        // The loan token
        {
          type: 'Hash160',
          value: loanHash,
        },
        // Quantity
        {
          type: 'Integer',
          value: `${quantity}`,
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

export { NestContract };
