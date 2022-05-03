/* eslint-disable no-console */
import { ActionType, GlobalStateInterface } from './Types';

const Reducer = (state: GlobalStateInterface, action: ActionType): any => {
  switch (action.type) {
    case 'CONNECT_WALLET':
      console.log('CONNECT_WALLET', action.payload);
      return {
        ...state,
        isWalletConnected: true,
        walletAddress: action.payload.walletAddress,
        walletProvider: action.payload.walletProvider,
      };
    case 'DISCONNECT_WALLET':
      console.log('DISCONNECT_WALLET');
      return {
        ...state,
        isWalletConnected: false,
        walletAddress: '',
        walletProvider: '',
      };
    case 'SET_PERSISTENCE':
      return {
        ...state,
        persistenceType: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
