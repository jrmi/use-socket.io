Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let react = require("react");
react = __toESM(react);
let socket_io_client = require("socket.io-client");
let react_jsx_runtime = require("react/jsx-runtime");
//#region src/context.ts
var context_default = react.createContext({
	socket: null,
	namespaces: {}
});
//#endregion
//#region src/provider.tsx
const defaultOptions = {};
const getUrlOrigin = (url) => new URL(url).origin;
function Provider({ children, url, options = defaultOptions, namespaces = [] }) {
	const namespaceKey = namespaces.join("\0");
	const [connections, setConnections] = (0, react.useState)(null);
	(0, react.useEffect)(() => {
		const nextConnections = {
			socket: (0, socket_io_client.io)(url, options),
			namespaces: namespaces.reduce((result, namespace) => ({
				...result,
				[namespace]: (0, socket_io_client.io)(`${getUrlOrigin(url)}/${namespace}`, options)
			}), {})
		};
		setConnections(nextConnections);
		return () => {
			nextConnections.socket.disconnect();
			Object.values(nextConnections.namespaces).forEach((socket) => socket.disconnect());
		};
	}, [
		namespaceKey,
		options,
		url
	]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(context_default.Provider, {
		value: connections || {
			socket: null,
			namespaces: {}
		},
		children
	});
}
//#endregion
//#region src/utils.ts
const getSocketConnection = ({ socket, namespaces }) => (namespace) => {
	if (namespace && namespaces && namespaces[namespace]) return namespaces[namespace];
	return socket;
};
//#endregion
//#region src/useSocket.tsx
const useSocket = (namespace) => getSocketConnection((0, react.useContext)(context_default))(namespace);
//#endregion
//#region src/useListener.tsx
const useListener = (eventName, callback, options = {}) => {
	const socketConnection = getSocketConnection((0, react.useContext)(context_default))(options.namespace);
	const callbackRef = (0, react.useRef)(callback);
	const subscribedCallbackRef = (0, react.useRef)(null);
	const subscribedRef = (0, react.useRef)(false);
	callbackRef.current = callback;
	const autoSubscribe = options.autoSubscribe !== false;
	const subscribeToEvent = (0, react.useCallback)(() => {
		if (socketConnection && !subscribedRef.current) {
			subscribedCallbackRef.current = callbackRef.current;
			socketConnection.on(eventName, subscribedCallbackRef.current);
			subscribedRef.current = true;
		}
	}, [socketConnection, eventName]);
	const unsubscribeFromEvent = (0, react.useCallback)(() => {
		if (socketConnection && subscribedRef.current && subscribedCallbackRef.current) {
			socketConnection.removeListener(eventName, subscribedCallbackRef.current);
			subscribedCallbackRef.current = null;
			subscribedRef.current = false;
		}
	}, [socketConnection, eventName]);
	(0, react.useEffect)(() => {
		if (autoSubscribe) subscribeToEvent();
		return () => {
			unsubscribeFromEvent();
		};
	}, [
		autoSubscribe,
		subscribeToEvent,
		unsubscribeFromEvent
	]);
	return [subscribeToEvent, unsubscribeFromEvent];
};
//#endregion
//#region src/useEmit.tsx
const emitEvent = (socketConnection) => (eventName, eventData) => socketConnection.emit(eventName, eventData);
const compressEvent = (socketConnection) => socketConnection.compress(true);
const useEmit = (options = {}) => {
	const socketConnection = getSocketConnection((0, react.useContext)(context_default))(options.namespace);
	if (socketConnection) {
		if (options.compress) return emitEvent(compressEvent(socketConnection));
		return emitEvent(socketConnection);
	}
	return () => {
		console.warn("Emit failed - socket is not initialized");
	};
};
//#endregion
//#region src/constants.ts
const EVENTS = {
	CONNECT: "connect",
	CONNECT_ERROR: "connect_error",
	CONNECT_TIMEOUT: "connect_timeout",
	ERROR: "error",
	DISCONNECT: "disconnect",
	RECONNECT: "reconnect",
	RECONNECT_ATTEMPT: "reconnect_attempt",
	RECONNECT_ERROR: "reconnect_error",
	RECONNECT_FAILED: "reconnect_failed",
	PING: "ping",
	PONG: "pong"
};
//#endregion
exports.EVENTS = EVENTS;
exports.Provider = Provider;
exports.useEmit = useEmit;
exports.useListener = useListener;
exports.useSocket = useSocket;
