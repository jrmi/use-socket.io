import * as React from 'react';
import { render, screen } from '@testing-library/react';

import Provider from '../provider';
import mockSocket from './mocks/socket-mock';

const url = 'http://local.test/';

vi.mock('socket.io-client', () => ({ io: () => mockSocket }));

describe('Test provider', () => {
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
});
