import { Dispatch } from 'react';

import { WalletProvider } from '../wallet/wallet';

export interface GlobalStateInterface {
  isWalletConnected: boolean;
  walletAddress: string;
  walletProvider: WalletProvider;
  persistenceType: string;
}

export type ActionType = {
  type: string;
  payload?: any;
};

export type ContextType = {
  globalState: GlobalStateInterface;
  dispatch: Dispatch<ActionType>;
};
