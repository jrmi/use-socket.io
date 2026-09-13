"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const provider_1 = __importDefault(require("../provider"));
const useEmit_1 = __importDefault(require("../useEmit"));
const socket_mock_1 = __importDefault(require("./mocks/socket-mock"));
const url = 'http://local.test/';
vi.mock('socket.io-client', () => ({ io: () => socket_mock_1.default }));
describe('Test useEmit', () => {
    it('should be called', () => {
        const wrapper = ({ children }) => ((0, jsx_runtime_1.jsx)(provider_1.default, { url: url, children: children }));
        const { result } = (0, react_1.renderHook)(() => (0, useEmit_1.default)(), { wrapper });
        expect(result.current).toBeInstanceOf(Function);
        expect(result.current('event', 'test')).toBeUndefined();
    });
});
