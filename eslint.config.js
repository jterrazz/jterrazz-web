import { eslintNodeConfig } from '@jterrazz/quality';
import { jestEslint } from '@jterrazz/test';

export default [
    ...eslintNodeConfig,
    ...jestEslint,
    {
        ignores: ['.next/*', '.node_modules/*'],
    },
];
