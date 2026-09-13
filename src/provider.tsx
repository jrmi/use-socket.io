import {
    useEffect,
    useState,
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

const defaultOptions: Partial<ManagerOptions & SocketOptions> = {};

const getUrlOrigin = (url: string) =>
    new URL(url).origin;

function Provider({
    children,
    url,
    options = defaultOptions,
    namespaces = [],
}: ProviderProps) {
    // A namespace can only have one connection in the context. De-duplicating
    // here also makes sure every connection we create is cleaned up below.
    const uniqueNamespaces = [...new Set(namespaces)];
    const namespaceKey = uniqueNamespaces.join('\u0000');
    const [connections, setConnections] = useState<SocketConnections | null>(null);

    useEffect(() => {
        const nextConnections: SocketConnections = {
            socket: io(url, options),
            namespaces: uniqueNamespaces.reduce(
                (result, namespace) => ({
                    ...result,
                    [namespace]: io(`${getUrlOrigin(url)}/${namespace}`, options),
                }),
                {},
            ),
        };

        setConnections(nextConnections);

        return () => {
            nextConnections.socket.disconnect();
            Object.values(nextConnections.namespaces).forEach((socket) => socket.disconnect());
        };
    }, [namespaceKey, options, url]);

    return (
        <Context.Provider value={connections || { socket: null, namespaces: {} }}>
            {children}
        </Context.Provider>
    );
}

export default Provider;
