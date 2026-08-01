import { testing } from '@jterrazz/test/oxlint';
import { compose, next } from '@jterrazz/typescript/oxlint';
import { defineConfig } from 'oxlint';

// The next preset composed with the spec conventions that ship with
// @jterrazz/test. Nothing local: the exceptions this file used to carry
// All moved into the presets (rules in 7.1.x, asset trees in 7.2.0).
export default defineConfig(compose(next, testing));
