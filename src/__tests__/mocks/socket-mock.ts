let connected = true;
let listeners: Array<{
    eventName: string;
    callback: (data: any) => void;
}> = [];

export default ({
    id: 'test',
    connected,
    open: vi.fn(),
    emit: vi.fn(),
    on: vi.fn((eventName: string, callback: (data: any) => void) =>
        listeners.push({ eventName, callback })),
    removeListener: vi.fn((eventName: string, callback: (data: any) => void) => {
        listeners = listeners.filter((listener) =>
            listener.eventName !== eventName || listener.callback !== callback);
    }),
    disconnect: () => { connected = false; },
    hasListeners: (eventName: string) =>
        listeners.some((listener) => listener.eventName === eventName),
});

export const cleanupListeners = () => {
    listeners = [];
};
