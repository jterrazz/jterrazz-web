import { type NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const MIME_TYPES: Record<string, string> = {
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
};

const CONTENT_DIR = join(process.cwd(), 'content');

// Cache for 1 year - URL changes on new deployments via ?v= param
const CACHE_CONTROL = 'public, max-age=31536000, s-maxage=31536000, immutable';

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
        const content = await readFile(filePath);

        return new NextResponse(content, {
            headers: {
                'Cache-Control': CACHE_CONTROL,
                'Content-Type': mimeType,
            },
        });
    } catch {
        return new NextResponse('Not Found', { status: 404 });
    }
}
