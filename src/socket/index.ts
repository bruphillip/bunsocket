import type { ServerWebSocket } from 'bun';
import { BehaviorSubject } from 'rxjs';

export type SocketInstance = ServerWebSocket<{
  userId: string;
}>;

export type SocketMessage = {
  eventName: string;
  wsId: string;
  ws: SocketInstance;
  wsClients: Map<string, SocketInstance>;
} & {
  [key: string]: unknown;
};

type SocketSubscribeCallback<T> = (data: SocketMessage & T) => void;

export const SocketInternal = {
  OPEN: 'INTERNAL:OPEN',
  MESSAGE: 'INTERNAL:GENERIC_MESSAGE',
  CLOSE: 'INTERNAL:CLOSE',
  DRAIN: 'INTERNAL:DRAIN',
};

class Socket {
  private _eventEmitter = new BehaviorSubject<SocketMessage | null>(null);
  private connectedWs = new Map<string, SocketInstance>();

  open(ws: SocketMessage['ws']) {
    this.connectedWs.set(ws.data.userId, ws);

    this._eventEmitter.next({
      eventName: SocketInternal.OPEN,
      wsId: ws.data.userId,
      ws,
      wsClients: this.connectedWs,
    });
  }

  message(ws: SocketMessage['ws'], data: string) {
    const object = JSON.parse(data) as SocketMessage;

    this._eventEmitter.next({ ...object, ws, wsClients: this.connectedWs });
  }

  subscribe<T>(eventName: string, callback: SocketSubscribeCallback<T>) {
    this._eventEmitter.asObservable().subscribe((event) => {
      const isSameEvent = event?.eventName === eventName;

      if (isSameEvent) {
        callback({
          ...event,
          wsId: event.ws.data.userId,
          wsClients: this.connectedWs,
        } as SocketMessage & T);
      }
    });
  }

  close(ws: SocketMessage['ws']) {
    this.connectedWs.delete(ws.data.userId);

    this._eventEmitter.next({
      eventName: SocketInternal.CLOSE,
      ws,
      wsId: ws.data.userId,
      wsClients: this.connectedWs,
    });
  }
}

export default new Socket();
