import { useContext } from 'react';
import type { Socket } from 'socket.io-client';

import Context from './context';
import { getSocketConnection } from './utils';

type useSocketType = (namespace?: string) => Socket | null;

const useSocket: useSocketType = (namespace?: string) =>
    getSocketConnection(useContext(Context))(namespace);

export default useSocket;
