import { NextResponse } from 'next/server';
import { readFileSync } from 'node:fs';

import { type Article } from '../../../../domain/article';
import { buildArticleSlug } from '../../../../domain/utils/slugify';
import { articlesRepository } from '../../../../infrastructure/repositories/articles.repository';

type RouteContext = {
    params: Promise<{ slugId: string }>;
};

// Manifest content is deterministic from the file system at build time, render
// Once and cache forever. Browsers + CDNs hold the immutable JSON.
export const dynamic = 'force-static';
export const revalidate = false;

export function generateStaticParams() {
    return articlesRepository
        .getAll()
        .filter((a: Article) => a.attestation !== undefined)
        .map((a: Article) => ({
            slugId: buildArticleSlug(a.publicIndex, a.metadata.title.en),
        }));
}

/**
 * Manifest for the attestation toolchain — flat structure pointing to the
 * single English-source attestation. The CLI's `verify <url>` mode fetches
 * this first, then the three sibling files referenced inside.
 */
export async function GET(_req: Request, ctx: RouteContext) {
    const { slugId } = await ctx.params;
    const id = slugId.split('-')[0];
    const indexNum = Number(id);
    if (!Number.isFinite(indexNum)) {
        return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const article = articlesRepository.getByIndex(id);
    const filename = articlesRepository.getFilenameByIndex(indexNum);
    if (!article || !filename) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (!hasFile(filename, 'en.attestation.json')) {
        return NextResponse.json({ error: 'No attestation available' }, { status: 404 });
    }

    const otsAvailable = hasFile(filename, 'en.ots');

    return NextResponse.json(
        {
            attestation: `/articles/${slugId}/en.attestation.json`,
            content: `/articles/${slugId}/en.md`,
            ...(otsAvailable && {
                ots: `/articles/${slugId}/en.ots`,
                otsVerifier: `/articles/${slugId}/verify-ots.json`,
            }),
            publicIndex: article.publicIndex,
            schemaVersion: 1,
            slug: slugId,
        },
        {
            headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        },
    );
}

function hasFile(filename: string, name: string): boolean {
    try {
        readFileSync(`${process.cwd()}/content/${filename}/${name}`);
        return true;
    } catch {
        return false;
    }
}
