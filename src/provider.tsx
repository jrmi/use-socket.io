import * as React from 'react';
import { io, Socket } from 'socket.io-client';

import Context from './context';

interface ProviderProps extends React.PropsWithChildren {
    url: string,
    namespaces?: Array<string>
    options?: object,
}

interface ProviderState {
    socket: Socket,
    namespaces: { [namespace: string]: Socket }
}

const getUrlOrigin = (url: string) =>
    new URL(url).origin;

const generateNamespaces = (props: ProviderProps) =>
    (result: object, namespace: string) =>
        ({ ...result, [namespace]: io(`${getUrlOrigin(props.url)}/${namespace}`, props.options) });

class Provider extends React.Component<ProviderProps, ProviderState> {
    constructor(props: ProviderProps) {
        super(props);
        const { url, options = {}, namespaces = [] } = props;

        this.state = {
            socket: io(url, options),
            namespaces: namespaces.reduce(generateNamespaces(props), {}),
        };
    }

    componentWillUnmount() {
        this.state.socket.disconnect();
        Object.values(this.state.namespaces).forEach((socket) => socket.disconnect());
    }

    render() {
        const { children } = this.props;
        const { socket, namespaces } = this.state;

        return (
            <Context.Provider value={{ socket, namespaces }}>
                {children}
            </Context.Provider>
        );
    }
}

export default Provider;
