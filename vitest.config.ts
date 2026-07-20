import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    include: ['src/**/*.test.ts'],
                    name: 'unit',
                },
            },
            {
                test: {
                    // Website specs boot `next start` (fresh `next build`
                    // Required) through specification.website() — one server
                    // And one shared browser for the whole project.
                    fileParallelism: false,
                    include: ['specs/website/**/*.test.ts'],
                    name: 'website',
                    testTimeout: 30_000,
                },
            },
            {
                test: {
                    // E2E files boot the production server on a shared port —
                    // Run them sequentially, against a fresh `next build`.
                    fileParallelism: false,
                    include: ['tests/e2e/**/*.e2e.test.ts'],
                    name: 'e2e',
                    testTimeout: 30_000,
                },
            },
        ],
    },
});
