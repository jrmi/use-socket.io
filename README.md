# @jrmi/use-socket.io

[![CI](https://github.com/jrmi/use-socket.io/actions/workflows/ci.yml/badge.svg)](https://github.com/jrmi/use-socket.io/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/%40jrmi%2Fuse-socket.io)](https://www.npmjs.com/package/@jrmi/use-socket.io)

React hooks for [Socket.IO](https://socket.io/).

## About this fork

This repository is a modernized fork of [scripters-dev/use-socket.io](https://github.com/scripters-dev/use-socket.io).
It updates the original project to modern React, TypeScript, Socket.IO, and Vitest while preserving its core API:
`Provider`, `useSocket`, `useListener`, `useEmit`, and `EVENTS`.

The original npm package uses the `@scripters` scope. This fork is published as `@jrmi/use-socket.io`.

## Installation

```bash
npm install @jrmi/use-socket.io socket.io-client
# or
yarn add @jrmi/use-socket.io socket.io-client
```

`socket.io-client` is a peer dependency and must be installed by the consuming application.

## Usage

### Provider

```tsx
import { Provider } from '@jrmi/use-socket.io';

const socketOptions = { forceNew: true };

<Provider url="http://localhost:4000" options={socketOptions}>
    <App />
</Provider>;
```

Namespaces are supported through the `namespaces` prop:

```tsx
<Provider
    url="http://localhost:4000"
    options={{ forceNew: true }}
    namespaces={['chat', 'notifications']}
>
    <App />
</Provider>
```

### useSocket

```tsx
import { useEffect } from 'react';
import { useSocket } from '@jrmi/use-socket.io';

function ChatStatus() {
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return undefined;

        const onUser = (user) => console.log(user);
        socket.on('user', onUser);

        return () => socket.off('user', onUser);
    }, [socket]);

    return <p>Chat status</p>;
}
```

Pass a namespace to retrieve its socket:

```tsx
const chatSocket = useSocket('chat');
```

### useListener

```tsx
import { useListener } from '@jrmi/use-socket.io';

function Chat() {
    const [subscribe, unsubscribe] = useListener('message', (message) => {
        console.log(message);
    });

    return (
        <button type="button" onClick={unsubscribe}>
            Pause messages
        </button>
    );
}
```

Listeners subscribe automatically. Set `autoSubscribe: false` to control them manually. A namespace can be selected
with `{ namespace: 'chat' }`.

### useEmit

```tsx
import { useEmit } from '@jrmi/use-socket.io';

function ChatMessage() {
    const emit = useEmit();

    return (
        <button type="button" onClick={() => emit('message', 'Hello')}>
            Send message
        </button>
    );
}
```

Use `{ compress: true }` to enable Socket.IO compression, or `{ namespace: 'chat' }` to emit through a namespace.

## Connecting manually

To attach listeners before the connection starts, disable automatic connection and open the socket after mounting:

```tsx
function App() {
    const socket = useSocket();

    useListener('connect', () => console.log('Connected'));

    useEffect(() => {
        socket?.open();
    }, [socket]);

    return <p>Chat</p>;
}

<Provider url="http://localhost:4000" options={{ autoConnect: false }}>
    <App />
</Provider>;
```

## Development

```bash
yarn install
yarn lint
yarn test
yarn build
```

GitHub Actions runs linting, tests, and the TypeScript build for pushes and pull requests.

## References

- [Upstream project](https://github.com/scripters-dev/use-socket.io)
- [Socket.IO documentation](https://socket.io/docs/v4/)
- [React documentation](https://react.dev/)
- [Vitest documentation](https://vitest.dev/)

## License

This project remains licensed under the [MIT License](LICENSE).
