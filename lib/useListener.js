"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const context_1 = __importDefault(require("./context"));
const utils_1 = require("./utils");
const useListener = (eventName, callback, options = {}) => {
    const socketConnection = (0, utils_1.getSocketConnection)((0, react_1.useContext)(context_1.default))(options.namespace);
    const callbackRef = (0, react_1.useRef)(callback);
    callbackRef.current = callback;
    const autoSubscribe = options.autoSubscribe !== false;
    const subscribeToEvent = (0, react_1.useCallback)(() => {
        if (socketConnection && !socketConnection.hasListeners(eventName)) {
            socketConnection.on(eventName, callbackRef.current);
        }
    }, [socketConnection, eventName]);
    const unsubscribeFromEvent = (0, react_1.useCallback)(() => {
        if (socketConnection && socketConnection.hasListeners(eventName)) {
            socketConnection.removeListener(eventName, callbackRef.current);
        }
    }, [socketConnection, eventName]);
    (0, react_1.useEffect)(() => {
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
exports.default = useListener;
