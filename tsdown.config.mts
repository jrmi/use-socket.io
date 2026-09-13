import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'lib',
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    exports: false,
    deps: {
        neverBundle: ['react', 'react-dom', 'socket.io-client'],
    },
});
