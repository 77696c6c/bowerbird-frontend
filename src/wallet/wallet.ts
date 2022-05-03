/* eslint-disable no-console */
import { RPCClient } from '@cityofzion/neon-core/lib/rpc';
import { rpc } from '@cityofzion/neon-js';
import { WcConnectOptions, WcSdk } from '@cityofzion/wallet-connect-sdk-core';
import { INeoDapi, NeoDapi } from '@neongd/neo-dapi';
import { INeoProvider } from '@neongd/neo-provider';
import QRCodeModal from '@walletconnect/qrcode-modal';
import neo3Dapi from 'neo3-dapi';

import { NeoLineN3Interface } from '../utils/neoline/neoline';

enum WalletProvider {
  None = 'None',
  NeoLine = 'NeoLine',
  O3 = 'O3',
  WalletConnect = 'WalletConnect',
  OneGate = 'OneGate',
  Neon = 'Neon',
}

enum NetworkType {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

type Wallet = {
  provider: WalletProvider,
  O3Available: Promise<boolean>
  NeoLineAvailable: Promise<boolean>,
  WalletConnectAvailable: Promise<boolean>,
  OneGateAvailable: Promise<boolean>,
  NeonAvailable: Promise<boolean>,
  getAccount: Function,
  invokeRead: Function,
  invoke: Function,
  getNetwork: Function,
  connect: Function,
  disconnect: Function,
};

let neoLineN3: NeoLineN3Interface | null;
let neoLine: NeoLineN3Interface | null;
let wcInstance: WcSdk;
let neonRpc: RPCClient;
let oneGateDapi: INeoDapi;
let oneGateProvider: INeoProvider;

const testnetOptions = {
  chainId: 'neo3:testnet',
  methods: ['invokeFunction', 'testInvoke'],
  appMetadata: {
    name: 'Lyrebird', // your application name to be displayed on the wallet
    description: 'Lyrebird Finance', // description to be shown on the wallet
    url: 'https://testnet.lyrebird.finance', // url to be linked on the wallet
    icons: ['https://testnet.lyrebird.finance/lyrebird_favicon.png'], // icon to be shown on the wallet
  },
} as WcConnectOptions;

const mainnetOptions = {
  chainId: 'neo3:mainnet',
  methods: ['invokeFunction', 'testInvoke'],
  appMetadata: {
    name: 'Lyrebird', // your application name to be displayed on the wallet
    description: 'Lyrebird Finance', // description to be shown on the wallet
    url: 'https://lyrebird.finance', // url to be linked on the wallet
    icons: ['https://lyrebird.finance/lyrebird_favicon.png'], // icon to be shown on the wallet
  },
} as WcConnectOptions;

const PRIVATE_NODE_ROOT = process.env.NEXT_PUBLIC_PRIVATE_NODE_ROOT as string;
const PRIVATE_NODE = `https://${PRIVATE_NODE_ROOT}/node`;

const network = process.env.NEXT_PUBLIC_NETWORK as NetworkType;

const wcOptions: WcConnectOptions = network === NetworkType.Mainnet
  ? mainnetOptions
  : testnetOptions;

const initO3 = async (_walletImpl: Wallet, resolveAvailable: Function) => {
  let resolved = false;
  const notReadyResolver = () => {
    if (!resolved) {
      resolved = true;
      resolveAvailable(false);
      console.log('Failed to initialize O3 dAPI.');
    }
  };

  const notReadyTimeout = setTimeout(notReadyResolver, 5000);
  // If we receive a READY event, clear the notReadyTimeout
  const cancelNotReadyTimeout = () => {
    clearTimeout(notReadyTimeout);
  };
  await neo3Dapi.onReady(() => {
    if (!resolved) {
      resolved = true;
      cancelNotReadyTimeout();
      resolveAvailable(true);
      console.log('Finished initializing O3 dAPI.');
    }
  });
};

function setNeoLine(_walletImpl: Wallet, resolveAvailable: Function) {
  const neoLineN3Obj = (window as any).NEOLineN3;
  const neoLineObj = (window as any).NEOLine;
  if (neoLineN3Obj && neoLineObj) {
    neoLineN3 = new neoLineN3Obj.Init();
    neoLine = new neoLineObj.Init();
    resolveAvailable(true);
    console.log('Finished initializing NeoLine dAPI.');
  } else {
    resolveAvailable(false);
    console.log('Failed to initialize NeoLine dAPI.');
  }
}

function initNeoLine(walletImpl: Wallet, resolveAvailable: Function) {
  if ((window as any).NEOLineN3) {
    setNeoLine(walletImpl, resolveAvailable);
  } else {
    const readyResolver = () => setNeoLine(walletImpl, resolveAvailable);
    const notReadyResolver = () => {
      resolveAvailable(false);
      window.removeEventListener('NEOLine.NEO.EVENT.READY', readyResolver, true);
    };
    // Listen for the READY event
    window.addEventListener('NEOLine.NEO.EVENT.READY', readyResolver, true);
    // If the READY event doesn't fire on time, return false
    const notReadyTimeout = setTimeout(notReadyResolver, 5000);
    // If we receive a READY event, clear the notReadyTimeout
    const cancelNotReadyTimeout = () => {
      clearTimeout(notReadyTimeout);
    };
    window.addEventListener('NEOLine.NEO.EVENT.READY', cancelNotReadyTimeout, true);
  }
}

async function onPairingProposal(uri: string) {
  QRCodeModal.open(uri, () => {
  });
  // window.open(`https://neon.coz.io/connect?uri=${uri}`, '_blank').focus();
}

async function onPairingCreated(_topics: string[]) {
  QRCodeModal.close();
}

async function onPairingDeleted() {
  // pass
}

async function initWalletConnect(_walletImpl: Wallet, resolveAvailable: Function) {
  wcInstance = new WcSdk();
  await wcInstance.initClient('info', 'wss://relay.walletconnect.org');
  resolveAvailable(true);
  console.log('Finished initializing WalletConnect dAPI.');
}

async function initOneGate(_walletImpl: Wallet, resolveAvailable: Function) {
  oneGateProvider = (window as any).OneGate;
  if (oneGateProvider) {
    // Get the neoline client initializing the wallet
    oneGateDapi = new NeoDapi(oneGateProvider);
    resolveAvailable(true);
  } else {
    resolveAvailable(false);
  }
  console.log('Finished initializing OneGate dAPI.');
}

async function initNeon(_walletImpl: Wallet, resolveAvailable: Function) {
  neonRpc = new rpc.RPCClient(PRIVATE_NODE);
  resolveAvailable(true);
  console.log('Finished initializing Neon dAPI.');
}

async function initSession() {
  await wcInstance.loadSession();
  if (!wcInstance.session) {
    await wcInstance.subscribeToEvents({
      onProposal: onPairingProposal, onCreated: onPairingCreated, onDeleted: onPairingDeleted,
    });
    await wcInstance.connect(wcOptions);
    if (sessionStorage) {
      sessionStorage.setItem('wcSession', JSON.stringify(wcInstance.session));
    } else if (localStorage) {
      localStorage.setItem('wcSession', JSON.stringify(wcInstance.session));
    }
  }
}

function getAccount(provider: WalletProvider) {
  if (provider === WalletProvider.NeoLine) {
    return neoLineN3?.getAccount();
  }
  if (provider === WalletProvider.O3) {
    return neo3Dapi.getAccount();
  }
  if (provider === WalletProvider.WalletConnect) {
    return {
      address: wcInstance.accountAddress,
      label: 'WalletConnect',
    };
  }
  if (provider === WalletProvider.OneGate) {
    return oneGateDapi.getAccount();
  }
  console.log(`Unknown provider: ${provider}`);
  return {
    addresss: '',
    label: 'None',
  };
}

// Default to Neon for all 'read' methods
function invokeRead(provider: WalletProvider, params: any) {
  if (provider === WalletProvider.NeoLine
   || provider === WalletProvider.O3
   || provider === WalletProvider.WalletConnect
   || provider === WalletProvider.OneGate
   || provider === WalletProvider.Neon) {
    return neonRpc.invokeFunction(params.scriptHash, params.operation, params.args, params.signers);
  }
  console.log(`Unknown provider: ${provider}`);
  return null;
}

function invoke(provider: WalletProvider, params: any) {
  if (provider === WalletProvider.NeoLine) {
    return neoLineN3?.invoke(params);
  }
  if (provider === WalletProvider.O3) {
    return neo3Dapi.invoke(params);
  }
  if (provider === WalletProvider.WalletConnect) {
    const wcParams = {
      scriptHash: params.scriptHash,
      operation: params.operation,
      args: params.args,
    };
    return wcInstance.invokeFunction(wcParams, params.signers).then((res) => ({
      txid: res.result,
    }));
  }
  if (provider === WalletProvider.OneGate) {
    return oneGateDapi.invoke(params);
  }
  console.log(`Unknown provider: ${provider}`);
  return null;
}

function getNetwork(provider: WalletProvider) {
  if (provider === WalletProvider.NeoLine) {
    return neoLine?.getNetworks().then((n: any) => (n.chainId === 3
      ? NetworkType.Mainnet : NetworkType.Testnet));
  }
  if (provider === WalletProvider.O3) {
    return neo3Dapi.getNetworks().then((n: any) => (n.chainId === 3
      ? NetworkType.Mainnet : NetworkType.Testnet));
  }
  if (provider === WalletProvider.WalletConnect) {
    return new Promise<NetworkType>((resolve, _) => {
      resolve(network);
    });
  }
  if (provider === WalletProvider.OneGate) {
    return oneGateDapi.getNetworks().then((n: any) => (n.chainId === 3
      ? NetworkType.Mainnet : NetworkType.Testnet));
  }
  console.log(`Unknown provider: ${provider}`);
  return null;
}

function connect(provider: WalletProvider) {
  if (provider === WalletProvider.NeoLine) {
    return neoLineN3?.getAccount().then(() => true);
  }
  if (provider === WalletProvider.O3) {
    return neo3Dapi.getAccount().then(() => true);
  }
  if (provider === WalletProvider.WalletConnect) {
    return initSession().then(() => true);
  }
  if (provider === WalletProvider.OneGate) {
    return oneGateDapi.getAccount().then(() => true);
  }
  console.log(`Unknown provider: ${provider}`);
  return null;
}

function disconnect(provider: WalletProvider) {
  if (provider === WalletProvider.NeoLine) {
    // Nothing?
    return;
  }
  if (provider === WalletProvider.O3) {
    // Nothing?
    return;
  }
  if (provider === WalletProvider.WalletConnect) {
    if (sessionStorage) {
      sessionStorage.setItem('wcSession', '');
    }
    if (localStorage) {
      localStorage.setItem('wcSession', '');
    }
    wcInstance.disconnect();
    return;
  }
  if (provider === WalletProvider.OneGate) {
    // Nothing?
    return;
  }
  console.log(`Unknown provider: ${provider}`);
}

const initWallet = async () => {
  let resolveO3Available: Function;
  const o3Available = new Promise<boolean>((resolve, _) => {
    resolveO3Available = resolve;
  });

  let resolveNeoLineAvailable: Function;
  const neoLineN3Available = new Promise<boolean>((resolve, _) => {
    resolveNeoLineAvailable = resolve;
  });

  let resolveWalletConnectAvailable: Function;
  const walletConnectAvailable = new Promise<boolean>((resolve, _) => {
    resolveWalletConnectAvailable = resolve;
  });

  let resolveOneGateAvailable: Function;
  const oneGateAvailable = new Promise<boolean>((resolve, _) => {
    resolveOneGateAvailable = resolve;
  });

  let resolveNeonAvailable: Function;
  const neonAvailable = new Promise<boolean>((resolve, _) => {
    resolveNeonAvailable = resolve;
  });

  const walletImpl: Wallet = <Wallet>{
    provider: WalletProvider.None,
    O3Available: o3Available,
    NeoLineAvailable: neoLineN3Available,
    WalletConnectAvailable: walletConnectAvailable,
    OneGateAvailable: oneGateAvailable,
    NeonAvailable: neonAvailable,
    getAccount,
    invokeRead,
    invoke,
    getNetwork,
    connect,
    disconnect,
  };

  initO3(walletImpl, resolveO3Available!);
  initNeoLine(walletImpl, resolveNeoLineAvailable!);
  initWalletConnect(walletImpl, resolveWalletConnectAvailable!);
  initOneGate(walletImpl, resolveOneGateAvailable!);
  initNeon(walletImpl, resolveNeonAvailable!);

  // Since nothing can happen without Neon, wait for it to complete
  await (neonAvailable);
  return walletImpl;
};

function WalletInit(): Promise<Wallet> {
  return initWallet();
}

const falsePromise = new Promise<boolean>((resolve, _) => {
  resolve(false);
});

const EmptyWallet: Wallet = <Wallet>{
  provider: WalletProvider.None,
  O3Available: falsePromise,
  NeoLineAvailable: falsePromise,
  WalletConnectAvailable: falsePromise,
  OneGateAvailable: falsePromise,
  NeonAvailable: falsePromise,
  getAccount: () => {},
  invokeRead: () => {},
  invoke: () => {},
  getNetwork: () => {},
  connect: () => {},
  disconnect: () => {},
};

export type { Wallet, NetworkType };
export { EmptyWallet, WalletProvider, WalletInit };
