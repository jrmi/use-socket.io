import {
    useContext,
    useEffect,
    useRef,
    useCallback,
} from 'react';

import Context from './context';
import { getSocketConnection } from './utils';

type SocketCallbackType = (data: any) => void;
type UseListenerOptions = {
    namespace?: string,
    autoSubscribe?: boolean,
}

interface UseListenerReturn extends Array<() => void> {
    0: () => void;
    1: () => void
}

type useListenerFunction = (eventName: string, callback: SocketCallbackType, options?: UseListenerOptions) =>
    UseListenerReturn;

const useListener: useListenerFunction = (eventName, callback, options = {}) => {
    const socketConnection = getSocketConnection(useContext(Context))(options.namespace);
    const callbackRef = useRef(callback);
    const subscribedCallbackRef = useRef<SocketCallbackType | null>(null);
    const subscribedRef = useRef(false);
    callbackRef.current = callback;
    const autoSubscribe = options.autoSubscribe !== false;

    const subscribeToEvent = useCallback(() => {
        if (socketConnection && !subscribedRef.current) {
            subscribedCallbackRef.current = callbackRef.current;
            socketConnection.on(eventName, subscribedCallbackRef.current);
            subscribedRef.current = true;
        }
    }, [socketConnection, eventName]);

    const unsubscribeFromEvent = useCallback(() => {
        if (socketConnection && subscribedRef.current && subscribedCallbackRef.current) {
            socketConnection.removeListener(eventName, subscribedCallbackRef.current);
            subscribedCallbackRef.current = null;
            subscribedRef.current = false;
        }
    }, [socketConnection, eventName]);

    useEffect(() => {
        if (autoSubscribe) {
            subscribeToEvent();
        }

        return () => {
            unsubscribeFromEvent();
        };
    }, [autoSubscribe, subscribeToEvent, unsubscribeFromEvent]);

    return [
        subscribeToEvent,
        unsubscribeFromEvent,
    ];
};

export default useListener;
