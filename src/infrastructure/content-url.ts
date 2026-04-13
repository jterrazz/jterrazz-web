/**
 * Content URL utility with content-based cache busting.
 *
 * Appends file content hash to URLs so:
 * - Same content = same hash = cached forever
 * - Changed content = new hash = fresh fetch
 *
 * Only changed files get cache-busted, not all files on every deploy.
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT_DIR = join(process.cwd(), 'content');

// Cache computed hashes to avoid recomputing during build
const hashCache = new Map<string, string>();

function computeFileHash(filePath: string): string {
    const cached = hashCache.get(filePath);
    if (cached) {
        return cached;
    }

    try {
        const content = readFileSync(filePath);
        const hash = createHash('md5').update(content).digest('hex').slice(0, 8);
        hashCache.set(filePath, hash);
        return hash;
    } catch {
        // File not found - use timestamp fallback
        return Date.now().toString(36).slice(0, 8);
    }
}

/**
 * Generates a versioned URL for content assets based on file content hash.
 * @param path - Path relative to /content (e.g., "articles/1/cover.jpg")
 * @returns Versioned URL (e.g., "/content/articles/1/cover.jpg?v=a1b2c3d4")
 */
export function getContentUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const filePath = join(CONTENT_DIR, decodeURIComponent(cleanPath));
    const hash = computeFileHash(filePath);
    return `/content/${cleanPath}?v=${hash}`;
}
