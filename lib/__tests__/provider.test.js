"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const provider_1 = __importDefault(require("../provider"));
const socket_mock_1 = __importDefault(require("./mocks/socket-mock"));
const url = 'http://local.test/';
vi.mock('socket.io-client', () => ({ io: () => socket_mock_1.default }));
describe('Test provider', () => {
    it('renders its children', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(provider_1.default, { url: url, children: "Test" }));
        expect(react_1.screen.getByText('Test')).toBeTruthy();
    });
    it('supports namespaces', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(provider_1.default, { url: url, options: { forceNew: false }, namespaces: ['test', 'mock'], children: "Test" }));
        expect(react_1.screen.getByText('Test')).toBeTruthy();
    });
});
