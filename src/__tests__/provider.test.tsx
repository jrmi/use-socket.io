import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { io } from 'socket.io-client';

import Provider from '../provider';
import mockSocket from './mocks/socket-mock';

const url = 'http://local.test/';

vi.mock('socket.io-client', () => ({ io: vi.fn(() => mockSocket) }));

describe('Test provider', () => {
    beforeEach(() => {
        vi.mocked(io).mockClear();
        mockSocket.disconnect.mockClear();
    });

    it('renders its children', () => {
        render(<Provider url={url}>Test</Provider>);
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('supports namespaces', () => {
        render(
            <Provider url={url} options={{ forceNew: false }} namespaces={['test', 'mock']}>
                Test
            </Provider>,
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('cleans up connections created during StrictMode mount cycles', () => {
        const { unmount } = render(
            <React.StrictMode>
                <Provider url={url}>Test</Provider>
            </React.StrictMode>,
        );

        expect(io).toHaveBeenCalledTimes(2);
        expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);

        unmount();

        expect(mockSocket.disconnect).toHaveBeenCalledTimes(2);
    });
});
