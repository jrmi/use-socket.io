"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const provider_1 = __importDefault(require("../provider"));
const useListener_1 = __importDefault(require("../useListener"));
const socket_mock_1 = __importStar(require("./mocks/socket-mock"));
const url = 'http://local.test/';
vi.mock('socket.io-client', () => ({ io: () => socket_mock_1.default }));
describe('Test useSocket', () => {
    beforeEach(() => {
        socket_mock_1.default.on.mockClear();
        socket_mock_1.default.removeListener.mockClear();
        (0, socket_mock_1.cleanupListeners)();
    });
    it('should be automatically called', () => {
        const wrapper = ({ children }) => ((0, jsx_runtime_1.jsx)(provider_1.default, { url: url, children: children }));
        const { result } = (0, react_1.renderHook)(() => (0, useListener_1.default)('test', () => { }), { wrapper });
        expect(result.current).toBeInstanceOf(Array);
        expect(socket_mock_1.default.on).toBeCalledTimes(1);
        expect(socket_mock_1.default.removeListener).toBeCalledTimes(0);
        expect(result.current[0]).toBeInstanceOf(Function);
        expect(result.current[1]).toBeInstanceOf(Function);
    });
    it('should not be automatically called', () => {
        const wrapper = ({ children }) => ((0, jsx_runtime_1.jsx)(provider_1.default, { url: url, children: children }));
        const { result } = (0, react_1.renderHook)(() => (0, useListener_1.default)('test', () => { }, { autoSubscribe: false }), { wrapper });
        expect(result.current).toBeInstanceOf(Array);
        expect(socket_mock_1.default.on).toBeCalledTimes(0);
        expect(socket_mock_1.default.removeListener).toBeCalledTimes(0);
        expect(result.current[0]).toBeInstanceOf(Function);
        expect(result.current[1]).toBeInstanceOf(Function);
    });
    it('should be called after subscribe function call', () => {
        const wrapper = ({ children }) => ((0, jsx_runtime_1.jsx)(provider_1.default, { url: url, children: children }));
        const { result } = (0, react_1.renderHook)(() => (0, useListener_1.default)('test', () => { }, { autoSubscribe: false }), { wrapper });
        expect(result.current).toBeInstanceOf(Array);
        result.current[0]();
        expect(socket_mock_1.default.on).toBeCalledTimes(1);
        expect(socket_mock_1.default.removeListener).toBeCalledTimes(0);
        expect(result.current[0]).toBeInstanceOf(Function);
        expect(result.current[1]).toBeInstanceOf(Function);
    });
    it('should be subscribed and unsubscribed after functions calls', () => {
        const wrapper = ({ children }) => ((0, jsx_runtime_1.jsx)(provider_1.default, { url: url, children: children }));
        const { result } = (0, react_1.renderHook)(() => (0, useListener_1.default)('test-failed', () => { }, { autoSubscribe: false }), { wrapper });
        expect(result.current).toBeInstanceOf(Array);
        result.current[0]();
        result.current[1]();
        expect(socket_mock_1.default.on).toBeCalledTimes(1);
        expect(socket_mock_1.default.removeListener).toBeCalledTimes(1);
        expect(result.current[0]).toBeInstanceOf(Function);
        expect(result.current[1]).toBeInstanceOf(Function);
    });
    it('should be subscribed only once', () => {
        const wrapper = ({ children }) => ((0, jsx_runtime_1.jsx)(provider_1.default, { url: url, children: children }));
        const { result } = (0, react_1.renderHook)(() => (0, useListener_1.default)('test-failed', () => { }, { autoSubscribe: false }), { wrapper });
        expect(result.current).toBeInstanceOf(Array);
        result.current[0]();
        result.current[0]();
        result.current[0]();
        expect(socket_mock_1.default.on).toBeCalledTimes(1);
        expect(socket_mock_1.default.removeListener).toBeCalledTimes(0);
        expect(result.current[0]).toBeInstanceOf(Function);
        expect(result.current[1]).toBeInstanceOf(Function);
    });
    it('should be subscribed and unsubscribed few times', () => {
        const wrapper = ({ children }) => ((0, jsx_runtime_1.jsx)(provider_1.default, { url: url, children: children }));
        const { result } = (0, react_1.renderHook)(() => (0, useListener_1.default)('test-failed', () => { }), { wrapper });
        expect(result.current).toBeInstanceOf(Array);
        result.current[0]();
        result.current[1]();
        result.current[0]();
        result.current[1]();
        result.current[0]();
        expect(socket_mock_1.default.on).toBeCalledTimes(3);
        expect(socket_mock_1.default.removeListener).toBeCalledTimes(2);
        expect(result.current[0]).toBeInstanceOf(Function);
        expect(result.current[1]).toBeInstanceOf(Function);
    });
});
