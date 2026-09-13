import * as React from 'react';
import { Socket } from 'socket.io-client';
interface ProviderProps extends React.PropsWithChildren {
    url: string;
    namespaces?: Array<string>;
    options?: object;
}
interface ProviderState {
    socket: Socket;
    namespaces: {
        [namespace: string]: Socket;
    };
}
declare class Provider extends React.Component<ProviderProps, ProviderState> {
    constructor(props: ProviderProps);
    componentWillUnmount(): void;
    render(): React.JSX.Element;
}
export default Provider;
