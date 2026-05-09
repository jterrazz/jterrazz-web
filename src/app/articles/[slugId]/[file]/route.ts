import { NextResponse } from 'next/server';
import { readFileSync } from 'node:fs';

import { type Article } from '../../../../domain/article';
import { buildArticleSlug } from '../../../../domain/utils/slugify';
import { articlesRepository } from '../../../../infrastructure/repositories/articles.repository';

type RouteContext = {
    params: Promise<{ slugId: string; file: string }>;
};

const ALLOWED = new Map<string, { contentType: string }>([
    ['en.md', { contentType: 'text/markdown; charset=utf-8' }],
    ['en.attestation.json', { contentType: 'application/json; charset=utf-8' }],
    ['en.ots', { contentType: 'application/vnd.opentimestamps.ots' }],
]);

// Raw artifacts are bytes-on-disk and never change for a given slug. Pre-render
// At build time and serve from the CDN with an immutable cache.
export const dynamic = 'force-static';
export const revalidate = false;

export function generateStaticParams() {
    return articlesRepository
        .getAll()
        .filter((a: Article) => a.attestation !== undefined)
        .flatMap((a: Article) => {
            const slugId = buildArticleSlug(a.publicIndex, a.metadata.title.en);
            return [...ALLOWED.keys()].map((file) => ({ file, slugId }));
        });
}

/**
 * Serves the raw attestation artifacts (English markdown bytes, attestation JSON,
 * OTS proof) so a third-party verifier can re-canonicalize and check the signature
 * offline.
 *
 * Trust-free by design: a tampered byte → hash mismatch → verifier fails.
 */
export async function GET(_req: Request, ctx: RouteContext) {
    const { file, slugId } = await ctx.params;
    const meta = ALLOWED.get(file);
    if (!meta) {
        return NextResponse.json({ error: 'File not allowed' }, { status: 404 });
    }

    const id = slugId.split('-')[0];
    const indexNum = Number(id);
    if (!Number.isFinite(indexNum)) {
        return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const filename = articlesRepository.getFilenameByIndex(indexNum);
    if (!filename) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let bytes: Buffer;
    try {
        bytes = readFileSync(`${process.cwd()}/content/${filename}/${file}`);
    } catch {
        return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(bytes), {
        headers: {
            'cache-control': 'public, max-age=31536000, immutable',
            'content-type': meta.contentType,
        },
        status: 200,
    });
}
