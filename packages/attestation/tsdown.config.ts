import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts', 'src/browser.ts', 'src/node.ts', 'src/cli.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    hash: false,
    outExtensions: ({ format }) => ({
        js: format === 'cjs' ? '.cjs' : '.js',
    }),
});
