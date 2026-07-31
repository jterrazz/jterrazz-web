import { testing } from '@jterrazz/test/oxlint';
import { compose, next } from '@jterrazz/typescript/oxlint';
import { defineConfig } from 'oxlint';

// The next preset composed with the spec conventions that ship with
// @jterrazz/test — Given/Then, pure visit scenarios, user-facing elements.
// No local rule exceptions: what used to live here moved into the preset
// (@jterrazz/typescript 7.1.0).
export default defineConfig(
    compose(next, testing, {
        ignorePatterns: ['assets/**'],
    }),
);
