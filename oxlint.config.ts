import { testing } from '@jterrazz/test/oxlint';
import { compose, next } from '@jterrazz/typescript/oxlint';
import { defineConfig } from 'oxlint';

// The next preset composed with the spec conventions that ship with
// @jterrazz/test — Given/Then, pure visit scenarios, user-facing elements.
export default defineConfig(
    compose(next, testing, {
        ignorePatterns: ['assets/**'],
        rules: {
            // Both are candidates for the shared `next` preset rather than
            // Local exceptions — see the note in AGENTS.md. exports-last fights
            // The component idiom (metadata + default export interleaved with
            // Types); prefer-global-this asks browser-only client components
            // To say globalThis where they mean window.
            'import/exports-last': 'off',
            'oxc/no-map-spread': 'off',
            'unicorn/prefer-global-this': 'off',
        },
    }),
);
