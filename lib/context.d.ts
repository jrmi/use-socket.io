import * as React from 'react';
import type { Socket } from 'socket.io-client';
declare const _default: React.Context<{
    socket: Socket | null;
    namespaces: {
        [namespace: string]: Socket;
    };
}>;
export default _default;
