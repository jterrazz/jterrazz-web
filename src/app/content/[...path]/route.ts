import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

import { type NextRequest, NextResponse } from 'next/server';

const MIME_TYPES: Record<string, string> = {
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
};

const CONTENT_DIR = join(process.cwd(), 'content');

// Cache ETags in memory to avoid recomputing for unchanged files
const etagCache = new Map<string, { etag: string; mtime: number }>();

async function computeEtag(filePath: string): Promise<string> {
    const stats = await stat(filePath);
    const mtime = stats.mtimeMs;

    // Check cache
    const cached = etagCache.get(filePath);
    if (cached && cached.mtime === mtime) {
        return cached.etag;
    }

    // Compute new ETag from file content
    const content = await readFile(filePath);
    const hash = createHash('md5').update(content).digest('hex').slice(0, 16);
    const etag = `"${hash}"`;

    // Update cache
    etagCache.set(filePath, { etag, mtime });

    return etag;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const { path } = await params;
    const relativePath = path.map(decodeURIComponent).join('/');
    const filePath = join(CONTENT_DIR, relativePath);

    // Security: ensure path doesn't escape content directory
    if (!filePath.startsWith(CONTENT_DIR)) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    const ext = extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext];

    if (!mimeType) {
        return new NextResponse('Not Found', { status: 404 });
    }

    try {
        const etag = await computeEtag(filePath);

        // Check If-None-Match header for cache validation
        const ifNoneMatch = request.headers.get('If-None-Match');
        if (ifNoneMatch === etag) {
            return new NextResponse(null, {
                status: 304,
                headers: {
                    'Cache-Control': 'public, max-age=31536000, must-revalidate',
                    ETag: etag,
                },
            });
        }

        // Read and return file
        const content = await readFile(filePath);

        return new NextResponse(content, {
            headers: {
                'Cache-Control': 'public, max-age=31536000, must-revalidate',
                'Content-Type': mimeType,
                ETag: etag,
            },
        });
    } catch {
        return new NextResponse('Not Found', { status: 404 });
    }
}
