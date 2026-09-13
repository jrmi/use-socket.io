let connected = true;
let listeners: Array<string> = [];

export default ({
    id: 'test',
    connected,
    open: vi.fn(),
    emit: vi.fn(),
    on: vi.fn((eventName: string) =>
        listeners.push(eventName)),
    removeListener: vi.fn((eventName: string) => {
        listeners = listeners.filter((event) =>
            event !== eventName);
    }),
    disconnect: () => { connected = false; },
    hasListeners: (eventName: string) =>
        listeners.includes(eventName),
});

export const cleanupListeners = () => {
    listeners = [];
};
