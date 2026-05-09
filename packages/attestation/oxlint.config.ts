import { oxlint } from '@jterrazz/codestyle';
import { defineConfig } from 'oxlint';

export default defineConfig({
    extends: [oxlint.node],
    ignorePatterns: ['tests/**/fixtures/**', 'dist/**'],
    rules: {
        'import/exports-last': 'off',
        'unicorn/no-await-expression-member': 'off',
        'unicorn/number-literal-case': 'off',
        'unicorn/numeric-separators-style': 'off',
    },
});
