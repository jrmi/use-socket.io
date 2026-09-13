import {
    useEffect,
    useMemo,
    type PropsWithChildren,
} from 'react';
import {
    io,
    type ManagerOptions,
    type Socket,
    type SocketOptions,
} from 'socket.io-client';

import Context from './context';

interface ProviderProps extends PropsWithChildren {
    url: string,
    namespaces?: Array<string>
    options?: Partial<ManagerOptions & SocketOptions>,
}

interface SocketConnections {
    socket: Socket,
    namespaces: { [namespace: string]: Socket }
}

const getUrlOrigin = (url: string) =>
    new URL(url).origin;

function Provider({
    children,
    url,
    options = {},
    namespaces = [],
}: ProviderProps) {
    const namespaceKey = namespaces.join('\u0000');
    const connections = useMemo<SocketConnections>(() => ({
        socket: io(url, options),
        namespaces: namespaces.reduce(
            (result, namespace) => ({
                ...result,
                [namespace]: io(`${getUrlOrigin(url)}/${namespace}`, options),
            }),
            {},
        ),
    }), [namespaceKey, options, url]);

    useEffect(() => () => {
        connections.socket.disconnect();
        Object.values(connections.namespaces).forEach((socket) => socket.disconnect());
    }, [connections]);

    return (
        <Context.Provider value={connections}>
            {children}
        </Context.Provider>
    );
}

export default Provider;
