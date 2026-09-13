import * as React from "react";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { io } from "socket.io-client";
import { jsx } from "react/jsx-runtime";
//#region src/context.ts
var context_default = React.createContext({
	socket: null,
	namespaces: {}
});
//#endregion
//#region src/provider.tsx
const getUrlOrigin = (url) => new URL(url).origin;
function Provider({ children, url, options = {}, namespaces = [] }) {
	const namespaceKey = namespaces.join("\0");
	const connections = useMemo(() => ({
		socket: io(url, options),
		namespaces: namespaces.reduce((result, namespace) => ({
			...result,
			[namespace]: io(`${getUrlOrigin(url)}/${namespace}`, options)
		}), {})
	}), [
		namespaceKey,
		options,
		url
	]);
	useEffect(() => () => {
		connections.socket.disconnect();
		Object.values(connections.namespaces).forEach((socket) => socket.disconnect());
	}, [connections]);
	return /* @__PURE__ */ jsx(context_default.Provider, {
		value: connections,
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
const useSocket = (namespace) => getSocketConnection(useContext(context_default))(namespace);
//#endregion
//#region src/useListener.tsx
const useListener = (eventName, callback, options = {}) => {
	const socketConnection = getSocketConnection(useContext(context_default))(options.namespace);
	const callbackRef = useRef(callback);
	callbackRef.current = callback;
	const autoSubscribe = options.autoSubscribe !== false;
	const subscribeToEvent = useCallback(() => {
		if (socketConnection && !socketConnection.hasListeners(eventName)) socketConnection.on(eventName, callbackRef.current);
	}, [socketConnection, eventName]);
	const unsubscribeFromEvent = useCallback(() => {
		if (socketConnection && socketConnection.hasListeners(eventName)) socketConnection.removeListener(eventName, callbackRef.current);
	}, [socketConnection, eventName]);
	useEffect(() => {
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
	const socketConnection = getSocketConnection(useContext(context_default))(options.namespace);
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
export { EVENTS, Provider, useEmit, useListener, useSocket };
