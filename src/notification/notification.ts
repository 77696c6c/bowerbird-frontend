import { rpc } from '@cityofzion/neon-js';

type NeoNotification = {
  available: Promise<boolean>,
  registerExecutedCallback: Function,
  unregisterExecutedCallback: Function,
  isOpen: Function,
  disconnect: Function,
};

const PRIVATE_NODE_ROOT = process.env.NEXT_PUBLIC_PRIVATE_NODE_ROOT as string;
const PRIVATE_NODE_WS = `wss://${PRIVATE_NODE_ROOT}/ws`;

async function disconnect(ws: WebSocket) {
  ws.close();
}

// Clients must wait for available() before calling
async function registerExecutedCallback(
  ws: WebSocket, contractHash: string,
  eventName: string, callback: (this: WebSocket, ev: MessageEvent<any>) => any,
) {
  const subscribeQuery = new rpc.Query(
    {
      method: 'subscribe',
      params: ['notification_from_execution', { contract: contractHash, name: eventName }],
    },
  );
  ws.send(JSON.stringify(subscribeQuery.export()));
  ws.addEventListener('message', callback);
}

async function unregisterExecutedCallback(
  ws: WebSocket, callback: (this: WebSocket, ev: MessageEvent<any>) => any,
) {
  ws.removeEventListener('message', callback);
}

const initNotification = async () => {
  const ws = new WebSocket(PRIVATE_NODE_WS);
  let resolveAvailable: Function;

  const notificationAvailable = new Promise<boolean>((resolve, _) => {
    resolveAvailable = resolve;
  });

  ws.onopen = () => {
    resolveAvailable(true);
  };

  function registerCallback(contractHash: string,
    eventName: string, callback: (this: WebSocket, ev: MessageEvent<any>) => any) {
    registerExecutedCallback(ws, contractHash, eventName, callback);
  }

  function unregisterCallback(callback: (this: WebSocket, ev: MessageEvent<any>) => any) {
    unregisterExecutedCallback(ws, callback);
  }

  function isOpen() {
    return ws.readyState === WebSocket.OPEN;
  }

  const notificationImpl: NeoNotification = <NeoNotification>{
    available: notificationAvailable,
    registerExecutedCallback: registerCallback,
    unregisterExecutedCallback: unregisterCallback,
    isOpen,
    disconnect: () => disconnect(ws),
  };

  return notificationImpl;
};

function NeoNotificationInit(): Promise<NeoNotification> {
  return initNotification();
}

export type { NeoNotification };
export { NeoNotificationInit };
