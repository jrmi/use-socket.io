"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const context_1 = __importDefault(require("./context"));
const utils_1 = require("./utils");
const emitEvent = (socketConnection) => (eventName, eventData) => socketConnection.emit(eventName, eventData);
const compressEvent = (socketConnection) => socketConnection.compress(true);
const useEmit = (options = {}) => {
    const socketConnection = (0, utils_1.getSocketConnection)((0, react_1.useContext)(context_1.default))(options.namespace);
    if (socketConnection) {
        if (options.compress) {
            return emitEvent(compressEvent(socketConnection));
        }
        return emitEvent(socketConnection);
    }
    return () => {
        console.warn('Emit failed - socket is not initialized');
    };
};
exports.default = useEmit;
