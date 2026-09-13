import type { Socket } from 'socket.io-client';
interface contextParams {
    socket: Socket | null;
    namespaces?: {
        [namespace: string]: Socket;
    };
}
type getSocketConnectionType = (params: contextParams) => (namespace?: string) => Socket | null;
export declare const getSocketConnection: getSocketConnectionType;
export {};
