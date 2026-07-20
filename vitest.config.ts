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
                    testTimeout: 60_000,
                },
            },
        ],
    },
});
