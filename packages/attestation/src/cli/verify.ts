import { readFile } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';

import { parse } from '../attestation/serialize.js';
import { verifyAttestation } from '../attestation/verify.js';
import { verifyOts } from '../ots/verify.js';
import { checkmark, crossmark, fmt } from './io.js';

export type VerifyArgs = {
    /** A URL to an article, or a path to a local markdown file. */
    target: string;
    /** Skip OTS Bitcoin verification (signature-only). */
    skipOts?: boolean;
};

type Sources = {
    content: string;
    attestationJson: string;
    otsBytes: null | Uint8Array;
};

export async function runVerify(args: VerifyArgs): Promise<boolean> {
    const sources = await loadSources(args);

    const attestation = parse(sources.attestationJson);
    const sigResult = await verifyAttestation({ attestation, content: sources.content });

    if (!sigResult.ok) {
        printSignatureFailure(sigResult.error);
        return false;
    }

    process.stdout.write(`${checkmark()} Content digest matches signature\n`);
    process.stdout.write(
        `${checkmark()} Signature valid — signed by ${fmt.bold(sigResult.signerAddress)}\n`,
    );

    if (args.skipOts || sources.otsBytes === null) {
        process.stdout.write(`${fmt.dim('· OTS verification skipped')}\n`);
        return true;
    }

    const digest = hexToBytes(attestation.subject.contentDigest);
    const otsResult = await verifyOts(digest, sources.otsBytes);

    if (!otsResult.ok) {
        process.stdout.write(`${crossmark()} OTS: ${otsResult.reason}`);
        if (otsResult.details) {
            process.stdout.write(` — ${otsResult.details}`);
        }
        process.stdout.write(`\n`);
        return otsResult.reason === 'pending-bitcoin'; // Pending is not a hard fail
    }

    process.stdout.write(
        `${checkmark()} Bitcoin timestamp confirmed at ${otsResult.bitcoinBlockTime.toISOString()}\n`,
    );
    return true;
}

async function loadSources(args: VerifyArgs): Promise<Sources> {
    if (/^https?:\/\//.test(args.target)) {
        return loadFromUrl(args.target);
    }
    return loadFromFile(args.target);
}

async function loadFromFile(filePath: string): Promise<Sources> {
    const content = await readFile(filePath, 'utf8');
    const dir = dirname(filePath);
    const base = basename(filePath, extname(filePath));
    const attestationJson = await readFile(join(dir, `${base}.attestation.json`), 'utf8');
    let otsBytes: null | Uint8Array = null;
    try {
        const buf = await readFile(join(dir, `${base}.ots`));
        otsBytes = new Uint8Array(buf);
    } catch {
        otsBytes = null;
    }
    return { attestationJson, content, otsBytes };
}

async function loadFromUrl(url: string): Promise<Sources> {
    const proofManifestUrl = await resolveManifestUrl(url);
    const manifest = await fetchJson<ProofManifest>(proofManifestUrl);

    const base = new URL(proofManifestUrl);
    const [content, attestationJson, otsBuf] = await Promise.all([
        fetchText(new URL(manifest.content, base).toString()),
        fetchText(new URL(manifest.attestation, base).toString()),
        fetchBytes(new URL(manifest.ots, base).toString()).catch(() => null),
    ]);
    return { attestationJson, content, otsBytes: otsBuf };
}

type ProofManifest = {
    schemaVersion: number;
    slug: string;
    content: string;
    attestation: string;
    ots: string;
};

async function resolveManifestUrl(articleUrl: string): Promise<string> {
    // Convention: append /proof.json to the article URL (trailing slash tolerated).
    const url = new URL(articleUrl);
    if (!url.pathname.endsWith('/')) {
        url.pathname += '/';
    }
    url.pathname += 'proof.json';
    return url.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Fetch ${url} failed: HTTP ${res.status}`);
    }
    return (await res.json()) as T;
}

async function fetchText(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Fetch ${url} failed: HTTP ${res.status}`);
    }
    return res.text();
}

async function fetchBytes(url: string): Promise<Uint8Array> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Fetch ${url} failed: HTTP ${res.status}`);
    }
    return new Uint8Array(await res.arrayBuffer());
}

function printSignatureFailure(error: Record<string, unknown> & { kind: string }): void {
    process.stdout.write(`${crossmark()} ${fmt.fail('Verification failed')}: ${error.kind}\n`);
    for (const [k, v] of Object.entries(error)) {
        if (k === 'kind') {
            continue;
        }
        process.stdout.write(`  ${k}: ${String(v)}\n`);
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
