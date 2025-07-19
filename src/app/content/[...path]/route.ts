import { promises as fs } from 'node:fs';
import { extname, join } from 'node:path';

const getMimeType = (filePath: string): string => {
    switch (extname(filePath).toLowerCase()) {
        case '.gif':
            return 'image/gif';
        case '.jpeg':
        case '.jpg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.svg':
            return 'image/svg+xml';
        default:
            return 'application/octet-stream';
    }
};

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
    const { path } = params;

    // Prevent path traversal outside the content directory.
    const safePath = path
        .filter((segment) => !segment.includes('..'))
        .map((segment) => decodeURIComponent(segment));
    const filePath = join(process.cwd(), 'content', ...safePath);

    try {
        const file = await fs.readFile(filePath);
        const mimeType = getMimeType(filePath);

        return new Response(file, {
            headers: {
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Content-Type': mimeType,
            },
        });
    } catch {
        return new Response('File not found', { status: 404 });
    }
}
