import { node } from '@jterrazz/quality';

export default [
    {
        ignores: ['.next/**', 'next-env.d.ts'],
    },
    ...node,
];
