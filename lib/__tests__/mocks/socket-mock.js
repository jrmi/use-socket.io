"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupListeners = void 0;
let connected = true;
let listeners = [];
exports.default = ({
    id: 'test',
    connected,
    open: vi.fn(),
    emit: vi.fn(),
    on: vi.fn((eventName) => listeners.push(eventName)),
    removeListener: vi.fn((eventName) => {
        listeners = listeners.filter((event) => event !== eventName);
    }),
    disconnect: () => { connected = false; },
    hasListeners: (eventName) => listeners.includes(eventName),
});
const cleanupListeners = () => {
    listeners = [];
};
exports.cleanupListeners = cleanupListeners;
