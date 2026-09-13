import { type PropsWithChildren } from 'react';
import { type ManagerOptions, type SocketOptions } from 'socket.io-client';
interface ProviderProps extends PropsWithChildren {
    url: string;
    namespaces?: Array<string>;
    options?: Partial<ManagerOptions & SocketOptions>;
}
declare function Provider({ children, url, options, namespaces, }: ProviderProps): import("react").JSX.Element;
export default Provider;
