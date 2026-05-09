import { readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';

import { buildAttestationMessage } from '../attestation/create.js';
import { stringify } from '../attestation/serialize.js';
import { type SignedAttestation } from '../attestation/types.js';
import { audit } from '../core/audit.js';
import { canonicalize } from '../core/canonicalize.js';
import { signViaBrowser } from '../eth/sign-flow.js';
import { stampDigest } from '../ots/stamp.js';
import { checkmark, fmt } from './io.js';

export type SignArgs = {
    file: string;
    title: string;
    slug: string;
    locale?: string;
    publishedAt?: string;
    revision?: number;
    priorAttestation?: `0x${string}`;
    skipStamp?: boolean;
    skipAudit?: boolean;
};

export async function runSign(args: SignArgs): Promise<void> {
    const content = await readFile(args.file, 'utf8');
    const locale = args.locale ?? deriveLocale(args.file);
    const publishedAt = args.publishedAt ? new Date(args.publishedAt) : new Date();

    const canonical = canonicalize(content);
    process.stdout.write(`${checkmark()} Canonicalized ${canonical.length} bytes (${locale})\n`);

    if (!args.skipAudit) {
        const findings = audit(canonical);
        if (findings.length > 0) {
            process.stdout.write(`${fmt.warn('!')} ${findings.length} suspicious char(s) found:\n`);
            for (const f of findings) {
                process.stdout.write(
                    `  line ${f.line}, col ${f.column}: U+${f.codepoint
                        .toString(16)
                        .toUpperCase()
                        .padStart(4, '0')} (${f.name})\n`,
                );
            }
            process.stdout.write(`  Pass --skip-audit to sign anyway.\n`);
            throw new Error('Audit failed: clean up suspicious characters first.');
        }
    }

    const message = buildAttestationMessage({
        content,
        locale,
        priorAttestation: args.priorAttestation,
        publishedAt,
        revision: args.revision,
        slug: args.slug,
        title: args.title,
    });

    process.stdout.write(`${fmt.info('→')} Content digest: ${message.subject.contentDigest}\n`);
    process.stdout.write(`${fmt.info('→')} Opening browser to sign with your wallet…\n`);

    const { signature, signerAddress } = await signViaBrowser({ message });
    const signed: SignedAttestation = { ...message, signature, signerAddress };

    process.stdout.write(`${checkmark()} Signed by ${fmt.bold(signerAddress)}\n`);

    const baseName = basename(args.file, extname(args.file));
    const dir = dirname(args.file);
    const attestationPath = join(dir, `${baseName}.attestation.json`);
    await writeFile(attestationPath, stringify(signed), 'utf8');
    process.stdout.write(`${checkmark()} Wrote ${attestationPath}\n`);

    if (!args.skipStamp) {
        process.stdout.write(`${fmt.info('→')} Submitting to OpenTimestamps calendars…\n`);
        const digest = hexToBytes(message.subject.contentDigest);
        const otsBytes = await stampDigest(digest);
        const otsPath = join(dir, `${baseName}.ots`);
        await writeFile(otsPath, Buffer.from(otsBytes));
        process.stdout.write(
            `${checkmark()} Wrote ${otsPath} (${otsBytes.length} bytes, calendar-only)\n`,
        );
        process.stdout.write(
            `  ${fmt.dim('Run `attestation upgrade` in ~24h to anchor in Bitcoin.')}\n`,
        );
    }
}

function deriveLocale(file: string): string {
    const name = basename(file, extname(file));
    if (/^[a-z]{2}$/.test(name)) {
        return name;
    }
    throw new Error(
        `Cannot derive locale from filename "${basename(file)}". Pass --locale explicitly.`,
    );
}

function hexToBytes(hex: `0x${string}`): Uint8Array {
    const stripped = hex.slice(2);
    const out = new Uint8Array(stripped.length / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(stripped.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}
