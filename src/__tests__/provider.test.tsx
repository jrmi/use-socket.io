import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { io } from 'socket.io-client';

import Provider from '../provider';
import mockSocket from './mocks/socket-mock';

const url = 'http://local.test/';
const stableOptions = { forceNew: false };

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

    it.each([
        {
            description: 'the URL',
            url: 'http://other.test/',
            options: stableOptions,
            namespaces: ['test'],
        },
        {
            description: 'the options object identity',
            url,
            options: { forceNew: true },
            namespaces: ['test'],
        },
        {
            description: 'the namespace list',
            url,
            options: stableOptions,
            namespaces: ['other'],
        },
    ])('replaces connections when $description changes', (updatedProps) => {
        const { rerender, unmount } = render(
            <Provider url={url} options={stableOptions} namespaces={['test']}>
                Test
            </Provider>,
        );

        expect(io).toHaveBeenCalledTimes(2);

        rerender(
            <Provider
                url={updatedProps.url}
                options={updatedProps.options}
                namespaces={updatedProps.namespaces}
            >
                Test
            </Provider>,
        );

        expect(io).toHaveBeenCalledTimes(4);
        expect(mockSocket.disconnect).toHaveBeenCalledTimes(2);

        unmount();
        expect(mockSocket.disconnect).toHaveBeenCalledTimes(4);
    });

    it('does not create duplicate namespace connections', () => {
        render(
            <Provider url={url} namespaces={['test', 'test']}>
                Test
            </Provider>,
        );

        expect(io).toHaveBeenCalledTimes(2);
    });
});
