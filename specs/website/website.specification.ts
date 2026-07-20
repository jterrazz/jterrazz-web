import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import { specification } from '@jterrazz/test';
import { afterAll } from 'vitest';

const REPO_ROOT = resolve(import.meta.dirname, '../..');
const BUILD_MARKER = resolve(REPO_ROOT, '.next/BUILD_ID');

/** Newest mtime under a directory tree (node_modules and dotdirs skipped). */
function newestMtime(path: string): number {
    const stats = statSync(path);
    if (!stats.isDirectory()) {
        return stats.mtimeMs;
    }
    let newest = 0;
    for (const entry of readdirSync(path)) {
        if (entry === 'node_modules' || entry.startsWith('.')) {
            continue;
        }
        newest = Math.max(newest, newestMtime(resolve(path, entry)));
    }
    return newest;
}

// The specs run against the production build. Same contract as the cli
// Specification rebuilding its Go binary: rebuild only when a source is
// Newer than the build marker, so `npm test` is hermetic without paying
// A build when one is fresh (CI builds first — this is always a no-op there).
const sources = ['src', 'content', 'public', 'reach.config.ts', 'next.config.ts', 'package.json']
    .map((path) => resolve(REPO_ROOT, path))
    .filter((path) => existsSync(path));
const newestSource = Math.max(...sources.map((path) => newestMtime(path)));
if (!existsSync(BUILD_MARKER) || statSync(BUILD_MARKER).mtimeMs < newestSource) {
    execSync('npm run build', { cwd: REPO_ROOT, stdio: 'inherit' });
}

export const { cleanup, website } = await specification.website({
    server: { command: 'npm run start', ready: '/', timeout: 60_000 },
});
afterAll(cleanup);
