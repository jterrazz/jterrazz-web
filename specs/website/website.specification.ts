import { specification } from '@jterrazz/test';
import { afterAll } from 'vitest';

export const { cleanup, website } = await specification.website({
    server: { command: 'npm run start', ready: '/', timeout: 60_000 },
});
afterAll(cleanup);
