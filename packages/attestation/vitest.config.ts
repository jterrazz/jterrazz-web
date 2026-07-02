import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: 'unit',
                    include: ['src/**/*.test.ts'],
                },
            },
            {
                test: {
                    name: 'golden',
                    include: ['tests/golden/**/*.test.ts'],
                },
            },
            {
                test: {
                    name: 'integration',
                    include: ['tests/integration/**/*.test.ts'],
                },
            },
            {
                test: {
                    name: 'articles-real',
                    include: ['tests/articles-real/**/*.test.ts'],
                },
            },
            {
                test: {
                    name: 'e2e-network',
                    // Gated: only runs when ATTEST_E2E_NETWORK=1 (via `npm run test:network`).
                    include: ['tests/e2e-network/**/*.test.ts'],
                    exclude: process.env.ATTEST_E2E_NETWORK ? [] : ['**/*'],
                },
            },
        ],
    },
});
