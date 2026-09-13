import { PropsWithChildren } from "react";
import { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
//#region src/provider.d.ts
interface ProviderProps extends PropsWithChildren {
  url: string;
  namespaces?: Array<string>;
  options?: Partial<ManagerOptions & SocketOptions>;
}
declare function Provider({ children, url, options, namespaces }: ProviderProps): import("react").JSX.Element;
//#endregion
//#region src/useSocket.d.ts
type useSocketType = (namespace?: string) => Socket | null;
declare const useSocket: useSocketType;
//#endregion
//#region src/useListener.d.ts
type SocketCallbackType = (data: any) => void;
type UseListenerOptions = {
  namespace?: string;
  autoSubscribe?: boolean;
};
interface UseListenerReturn extends Array<() => void> {
  0: () => void;
  1: () => void;
}
type useListenerFunction = (eventName: string, callback: SocketCallbackType, options?: UseListenerOptions) => UseListenerReturn;
declare const useListener: useListenerFunction;
//#endregion
//#region src/useEmit.d.ts
interface emitOptions {
  namespace?: string;
  compress?: boolean;
}
type useEmitType = (options?: emitOptions) => (eventName: string, eventData: any) => void;
declare const useEmit: useEmitType;
//#endregion
//#region src/constants.d.ts
export declare const EVENTS: {
  CONNECT: string;
  CONNECT_ERROR: string;
  CONNECT_TIMEOUT: string;
  ERROR: string;
  DISCONNECT: string;
  RECONNECT: string;
  RECONNECT_ATTEMPT: string;
  RECONNECT_ERROR: string;
  RECONNECT_FAILED: string;
  PING: string;
  PONG: string;
};
//#endregion
export { Provider, useEmit, useListener, useSocket };