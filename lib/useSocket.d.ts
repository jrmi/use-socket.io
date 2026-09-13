import type { Socket } from 'socket.io-client';
type useSocketType = (namespace?: string) => Socket | null;
declare const useSocket: useSocketType;
export default useSocket;
