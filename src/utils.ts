import type { Socket } from 'socket.io-client';

interface contextParams {
    socket: Socket | null,
    namespaces?: { [namespace: string]: Socket },
}

type getSocketConnectionType = (params: contextParams) => (namespace?: string) => Socket | null;

// eslint-disable-next-line
export const getSocketConnection: getSocketConnectionType = ({ socket, namespaces }) => (namespace) => {
    if (namespace && namespaces && namespaces[namespace]) {
        return namespaces[namespace];
    }
    return socket;
};
