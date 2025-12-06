import next from 'next';
import type { Server } from 'node:http';
import { createServer } from 'node:http';

let server: null | Server = null;
let nextApp: null | ReturnType<typeof next> = null;

export const TEST_PORT = 3001;
export const BASE_URL = `http://localhost:${TEST_PORT}`;

/**
 * Check if a server is already running at the test port
 */
async function isPortInUse(port: number): Promise<boolean> {
    try {
        const response = await fetch(`http://localhost:${port}`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(1000),
        });
        return response.ok || response.status === 307 || response.status === 308;
    } catch {
        return false;
    }
}

/**
 * Start the Next.js test server
 * Only starts if no server is already running on the test port
 */
export async function startTestServer(): Promise<void> {
    // Check if server is already running (e.g., from npm run dev on port 3001)
    if (await isPortInUse(TEST_PORT)) {
        console.log(`✓ Using existing server at ${BASE_URL}`);
        return;
    }

    console.log(`Starting Next.js test server on port ${TEST_PORT}...`);

    // Start in production mode (requires `npm run build` first)
    nextApp = next({ dev: false, dir: process.cwd(), quiet: true });
    const handle = nextApp.getRequestHandler();

    await nextApp.prepare();

    server = createServer((req, res) => handle(req, res));
    await new Promise<void>((resolve) => {
        server!.listen(TEST_PORT, () => {
            console.log(`✓ Test server started at ${BASE_URL}`);
            resolve();
        });
    });
}

/**
 * Stop the Next.js test server if we started it
 */
export async function stopTestServer(): Promise<void> {
    if (server) {
        await new Promise<void>((resolve, reject) => {
            server!.close((err) => (err ? reject(err) : resolve()));
        });
        server = null;
        console.log('✓ Test server stopped');
    }

    if (nextApp) {
        await nextApp.close();
        nextApp = null;
    }
}
