import { NextResponse } from 'next/server';
import { readFileSync } from 'node:fs';

import { type Article } from '../../../../domain/article';
import { buildArticleSlug } from '../../../../domain/utils/slugify';
import { articlesRepository } from '../../../../infrastructure/repositories/articles.repository';

type RouteContext = {
    params: Promise<{ slugId: string }>;
};

// OTS verification calls a public Bitcoin block source. We re-check at most
// Once per hour: pending → anchored transitions get picked up within a TTL,
// And we don't hammer Esplora when many visitors hit the verify page.
export const revalidate = 3600;

export function generateStaticParams() {
    return articlesRepository
        .getAll()
        .filter((a: Article) => a.attestation !== undefined)
        .map((a: Article) => ({
            slugId: buildArticleSlug(a.publicIndex, a.metadata.title.en),
        }));
}

/**
 * Server-side OTS verification endpoint. Reads the `.ots` proof, queries a
 * Bitcoin block-info source via the OpenTimestamps library, and returns the
 * boolean result + block time. The browser-side ProofCard fetches this so it
 * can show a real "Bitcoin anchored" status without bundling the (Node-only)
 * OTS lib client-side.
 */
export async function GET(_req: Request, ctx: RouteContext) {
    const { slugId } = await ctx.params;
    const id = slugId.split('-')[0];
    const indexNum = Number(id);
    if (!Number.isFinite(indexNum)) {
        return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const filename = articlesRepository.getFilenameByIndex(indexNum);
    if (!filename) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let attestationRaw: string;
    let otsBuffer: Buffer;
    try {
        attestationRaw = readFileSync(
            `${process.cwd()}/content/${filename}/en.attestation.json`,
            'utf8',
        );
        otsBuffer = readFileSync(`${process.cwd()}/content/${filename}/en.ots`);
    } catch {
        return NextResponse.json({ error: 'Proof files missing' }, { status: 404 });
    }

    const attestation = JSON.parse(attestationRaw) as { subject: { contentDigest: `0x${string}` } };
    const digest = hexToBytes(attestation.subject.contentDigest);

    // Lazy import — keeps the OTS lib (Node-only deps) out of the static bundle.
    const { verifyOts } = await import('@jterrazz/attestation/node');
    const result = await verifyWithTimeout(verifyOts, digest, new Uint8Array(otsBuffer));

    if (result.ok) {
        // Bitcoin attestation is immutable once it lands — long browser TTL,
        // SWR keeps it warm if the ISR snapshot ages out.
        return NextResponse.json(
            { bitcoinTime: result.bitcoinBlockTime.toISOString(), ok: true },
            {
                headers: {
                    'cache-control':
                        'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400',
                },
            },
        );
    }
    // Pending / failed: shorter browser TTL so we re-poll soon, but still let
    // The Next.js ISR layer absorb most of the load via `revalidate = 3600`.
    const fail = result as { ok: false; reason: string; details?: string };
    return NextResponse.json(
        { details: fail.details, ok: false, reason: fail.reason },
        {
            headers: {
                'cache-control': 'public, max-age=600, stale-while-revalidate=3600',
            },
        },
    );
}

// OTS upgrade rounds call public calendars; when one is down the library can
// Hang well past Next's 60s static-generation budget and fail the whole
// Build. Bound it: past the deadline we answer "pending" with a short TTL and
// Let the ISR revalidation pick the real status up later.
const VERIFY_TIMEOUT_MS = 20_000;

async function verifyWithTimeout(
    verifyOts: (digest: Uint8Array, ots: Uint8Array) => Promise<unknown>,
    digest: Uint8Array,
    ots: Uint8Array,
): Promise<{ bitcoinBlockTime: Date; ok: true } | { ok: false; reason: string }> {
    let timer: NodeJS.Timeout | undefined;
    try {
        return (await Promise.race([
            verifyOts(digest, ots),
            new Promise((resolve) => {
                timer = setTimeout(() => {
                    resolve({ ok: false, reason: 'verification timed out' });
                }, VERIFY_TIMEOUT_MS);
            }),
        ])) as { bitcoinBlockTime: Date; ok: true } | { ok: false; reason: string };
    } finally {
        clearTimeout(timer);
    }
}

function hexToBytes(hex: `0x${string}`): Uint8Array {
    const stripped = hex.slice(2);
    const out = new Uint8Array(stripped.length / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(stripped.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}
