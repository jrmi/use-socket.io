import * as React from 'react';
import type { Socket } from 'socket.io-client';

export default React.createContext<{
    socket: Socket | null,
    namespaces: { [namespace: string]: Socket }
}>({ socket: null, namespaces: {} });
