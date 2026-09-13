import { useContext } from 'react';
import type { Socket } from 'socket.io-client';

import Context from './context';
import { getSocketConnection } from './utils';

interface emitOptions {
    namespace?: string,
    compress?: boolean,
}

type useEmitType = (options?: emitOptions) =>
    (eventName: string, eventData: any) => void;

const emitEvent = (socketConnection: Socket) =>
    (eventName: string, eventData: any) =>
        socketConnection.emit(eventName, eventData);

const compressEvent = (socketConnection: Socket) =>
    socketConnection.compress(true);

const useEmit: useEmitType = (options = {}) => {
    const socketConnection = getSocketConnection(useContext(Context))(options.namespace);

    if (socketConnection) {
        if (options.compress) {
            return emitEvent(compressEvent(socketConnection));
        }
        return emitEvent(socketConnection);
    }
    return () => {
        console.warn('Emit failed - socket is not initialized'); // eslint-disable-line
    };
};

export default useEmit;
