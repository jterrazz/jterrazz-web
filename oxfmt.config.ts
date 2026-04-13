import { defineConfig } from 'oxfmt';
import { oxfmt } from '@jterrazz/codestyle';

export default defineConfig({
    ...oxfmt,
    ignorePatterns: ['content/**', '.next/**'],
});
