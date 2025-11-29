import { node } from '@jterrazz/quality';

export default [
    {
        ignores: ['.next/**', 'next-env.d.ts'],
    },
    ...node,
    {
        rules: {
            // Disable file extension requirement - Turbopack doesn't support .js extension aliasing
            'file-extension-in-import-ts/file-extension-in-import-ts': 'off',
        },
    },
];
