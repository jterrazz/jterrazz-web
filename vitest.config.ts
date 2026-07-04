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
