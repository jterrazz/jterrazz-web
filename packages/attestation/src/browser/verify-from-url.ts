import { parse } from '../attestation/serialize.js';
import { verifyAttestation } from '../attestation/verify.js';
import { type AuthorshipState, type DateState, type ProofManifest } from './types.js';

export type VerifyFromUrlOptions = {
    /**
     * Skip Bitcoin/OTS verification entirely. Default false — verifyFromUrl
     * lazy-loads `javascript-opentimestamps` (~200kB) and validates the proof
     * against a public Bitcoin block API. Fails open: bundling/polyfill issues
     * fall back to `skipped` rather than throwing.
     */
    skipOts?: boolean;
    /**
     * Custom fetch (useful for tests or proxies). Defaults to global fetch.
     */
    fetchFn?: typeof fetch;
};

export type VerifyFromUrlReport = {
    authorship: AuthorshipState;
    date: DateState;
};

/**
 * End-to-end verify a published article from its public URL.
 *
 * Pipeline:
 *  1. Resolve the article URL → manifest URL (`{url}/proof.json`)
 *  2. Fetch manifest, then content (md), attestation (json), ots (bytes)
 *  3. Recompute SHA-256 of canonical content, recover EIP-712 signer
 *  4. Optionally verify the OTS proof (skipped in browser by default)
 *
 * The same call works in Node, Edge runtime, and modern browsers because the
 * underlying primitives (canonicalize, sha256, recoverTypedDataAddress) are all
 * platform-agnostic.
 */
export async function verifyFromUrl(
    articleUrl: string,
    opts: VerifyFromUrlOptions = {},
): Promise<VerifyFromUrlReport> {
    const fetchFn = opts.fetchFn ?? fetch;

    const manifestUrl = resolveManifestUrl(articleUrl);
    let manifest: ProofManifest;
    try {
        manifest = await fetchJson<ProofManifest>(fetchFn, manifestUrl);
    } catch (error) {
        const details = (error as Error).message;
        return {
            authorship: { details, error: 'fetch', kind: 'failed' },
            date: { details, error: 'fetch', kind: 'failed' },
        };
    }

    const base = new URL(manifestUrl);
    let content: string;
    let attestationJson: string;
    try {
        [content, attestationJson] = await Promise.all([
            fetchText(fetchFn, new URL(manifest.content, base).toString()),
            fetchText(fetchFn, new URL(manifest.attestation, base).toString()),
        ]);
    } catch (error) {
        const details = (error as Error).message;
        return {
            authorship: { details, error: 'fetch', kind: 'failed' },
            date: { details, error: 'fetch', kind: 'failed' },
        };
    }

    const attestation = parse(attestationJson);
    const sig = await verifyAttestation({ attestation, content });

    if (!sig.ok) {
        return {
            authorship: { error: sig.error.kind, kind: 'failed' },
            date: { kind: 'skipped', reason: 'opt-out' },
        };
    }

    const authorship: AuthorshipState = {
        kind: 'verified',
        signedAt: new Date(Number(attestation.claims.publishedAt) * 1000),
        signerAddress: sig.signerAddress,
    };

    if (opts.skipOts) {
        return { authorship, date: { kind: 'skipped', reason: 'opt-out' } };
    }

    // OTS verification needs Node-only deps (fs, crypto) so it runs on the
    // Server. The manifest may point to a verifier endpoint that returns the
    // Result as JSON. If absent, browser falls back to "skipped".
    if (!manifest.otsVerifier) {
        return { authorship, date: { kind: 'skipped', reason: 'no-ots-file' } };
    }

    try {
        const verifierUrl = new URL(manifest.otsVerifier, base).toString();
        const result = await fetchJson<OtsVerifierResponse>(fetchFn, verifierUrl);
        if (result.ok) {
            return {
                authorship,
                date: { bitcoinTime: new Date(result.bitcoinTime), kind: 'verified' },
            };
        }
        if (result.reason === 'pending-bitcoin') {
            return { authorship, date: { kind: 'pending' } };
        }
        return {
            authorship,
            date: { details: result.details, error: result.reason, kind: 'failed' },
        };
    } catch (error) {
        return {
            authorship,
            date: {
                details: (error as Error).message,
                error: 'fetch',
                kind: 'failed',
            },
        };
    }
}

type OtsVerifierResponse =
    | {
          ok: false;
          reason: 'digest-mismatch' | 'invalid-proof' | 'pending-bitcoin';
          details?: string;
      }
    | { ok: true; bitcoinTime: string };

function resolveManifestUrl(articleUrl: string): string {
    // Accept absolute URLs and relative paths (browser uses location.origin).
    const g = globalThis as { location?: { origin: string } };
    const base = g.location?.origin;
    const url = new URL(articleUrl, base);
    if (!url.pathname.endsWith('/')) {
        url.pathname += '/';
    }
    url.pathname += 'proof.json';
    return url.toString();
}

async function fetchJson<T>(fetchFn: typeof fetch, url: string): Promise<T> {
    const res = await fetchFn(url);
    if (!res.ok) {
        throw new Error(`GET ${url}: HTTP ${res.status}`);
    }
    return (await res.json()) as T;
}

async function fetchText(fetchFn: typeof fetch, url: string): Promise<string> {
    const res = await fetchFn(url);
    if (!res.ok) {
        throw new Error(`GET ${url}: HTTP ${res.status}`);
    }
    return res.text();
}
