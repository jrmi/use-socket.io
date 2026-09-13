"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const socket_io_client_1 = require("socket.io-client");
const context_1 = __importDefault(require("./context"));
const getUrlOrigin = (url) => new URL(url).origin;
function Provider({ children, url, options = {}, namespaces = [], }) {
    const namespaceKey = namespaces.join('\u0000');
    const connections = (0, react_1.useMemo)(() => ({
        socket: (0, socket_io_client_1.io)(url, options),
        namespaces: namespaces.reduce((result, namespace) => ({
            ...result,
            [namespace]: (0, socket_io_client_1.io)(`${getUrlOrigin(url)}/${namespace}`, options),
        }), {}),
    }), [namespaceKey, options, url]);
    (0, react_1.useEffect)(() => () => {
        connections.socket.disconnect();
        Object.values(connections.namespaces).forEach((socket) => socket.disconnect());
    }, [connections]);
    return ((0, jsx_runtime_1.jsx)(context_1.default.Provider, { value: connections, children: children }));
}
exports.default = Provider;
