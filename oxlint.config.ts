import { oxlint } from '@jterrazz/codestyle';
import { defineConfig } from 'oxlint';

export default defineConfig({
    extends: [oxlint.next],
    ignorePatterns: ['content/**'],
    rules: {
        'import/exports-last': 'off',
        'unicorn/prefer-global-this': 'off',
        'typescript/parameter-properties': 'off',
        'oxc/no-map-spread': 'off',
    },
});
