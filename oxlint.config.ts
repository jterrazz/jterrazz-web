import { testing } from '@jterrazz/test/oxlint';
import { compose, next } from '@jterrazz/typescript/oxlint';
import { defineConfig } from 'oxlint';

// The next preset composed with the spec conventions that ship with
// @jterrazz/test — Given/Then, pure visit scenarios, user-facing elements.
export default defineConfig(
    compose(next, testing, {
        ignorePatterns: ['assets/**'],
        rules: {
            'import/exports-last': 'off',
            'oxc/no-map-spread': 'off',
            'typescript/parameter-properties': 'off',
            'unicorn/prefer-global-this': 'off',
        },
    }),
);
