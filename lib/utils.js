"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketConnection = void 0;
const getSocketConnection = ({ socket, namespaces }) => (namespace) => {
    if (namespace && namespaces && namespaces[namespace]) {
        return namespaces[namespace];
    }
    return socket;
};
exports.getSocketConnection = getSocketConnection;
