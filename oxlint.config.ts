import { testing } from '@jterrazz/test/oxlint';
import { oxlint } from '@jterrazz/typescript';
import { defineConfig } from 'oxlint';

// The spec conventions ship with the framework — Given/Then, pure visit
// Scenarios, user-facing elements — but they only bind once the plugin is
// Wired. Composed by hand rather than through `compose()`: the installed
// @jterrazz/typescript exposes presets, not the combinator its docs assume.
export default defineConfig({
    extends: [oxlint.next],
    ignorePatterns: ['content/**'],
    jsPlugins: testing.jsPlugins,
    overrides: testing.overrides,
    rules: {
        ...testing.rules,
        'import/exports-last': 'off',
        'unicorn/prefer-global-this': 'off',
        'typescript/parameter-properties': 'off',
        'oxc/no-map-spread': 'off',
    },
});
