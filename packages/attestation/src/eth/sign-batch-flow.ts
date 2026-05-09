import { createServer } from 'node:http';
import { type AddressInfo } from 'node:net';

import {
    ATTESTATION_DOMAIN_V1,
    ATTESTATION_PRIMARY_TYPE,
    ATTESTATION_TYPES_V1,
    type AttestationMessage,
} from '../core/eip712-schema.js';
import { buildBatchSignPageHtml } from './sign-batch-page-html.js';

export type BatchSignEntry = {
    /** Unique key — used to correlate signatures back to entries. */
    id: string;
    /** Human-readable label shown in the browser UI. */
    label: string;
    /** EIP-712 message to sign. */
    message: AttestationMessage;
};

export type BatchSignFlowOptions = {
    entries: BatchSignEntry[];
    onUrlReady?: (url: string) => Promise<void> | void;
    /** Total session timeout. Default 30 minutes. */
    timeoutMs?: number;
};

export type BatchSignature = {
    signature: `0x${string}`;
    signerAddress: `0x${string}`;
};

export type BatchSignFlowResult = {
    signatures: Map<string, BatchSignature>;
    /** Entries the user explicitly skipped or that failed (rejected wallet, etc.). */
    skipped: Map<string, string>;
};

const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000;

export async function signBatchViaBrowser(
    opts: BatchSignFlowOptions,
): Promise<BatchSignFlowResult> {
    const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    const wireEntries = opts.entries.map((e) => ({
        id: e.id,
        label: e.label,
        typedData: {
            domain: ATTESTATION_DOMAIN_V1,
            message: serializeMessageForBrowser(e.message),
            primaryType: ATTESTATION_PRIMARY_TYPE,
            types: { EIP712Domain: domainTypes(), ...ATTESTATION_TYPES_V1 },
        },
    }));
    const html = buildBatchSignPageHtml(wireEntries);

    const signatures = new Map<string, BatchSignature>();
    const skipped = new Map<string, string>();

    return new Promise<BatchSignFlowResult>((resolve, reject) => {
        const server = createServer((req, res) => {
            if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
                res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
                res.end(html);
                return;
            }

            if (req.method === 'POST' && (req.url === '/sig' || req.url === '/skip')) {
                let body = '';
                req.on('data', (chunk: Buffer) => {
                    body += chunk.toString('utf8');
                });
                req.on('end', () => {
                    let parsed: {
                        id: string;
                        signature?: `0x${string}`;
                        signerAddress?: `0x${string}`;
                        reason?: string;
                    };
                    try {
                        parsed = JSON.parse(body) as typeof parsed;
                    } catch {
                        res.writeHead(400);
                        res.end('Parse error');
                        return;
                    }
                    if (req.url === '/sig') {
                        if (
                            typeof parsed.signature !== 'string' ||
                            !/^0x[0-9a-fA-F]{130}$/.test(parsed.signature) ||
                            typeof parsed.signerAddress !== 'string' ||
                            !/^0x[0-9a-fA-F]{40}$/.test(parsed.signerAddress)
                        ) {
                            res.writeHead(400);
                            res.end('Invalid payload');
                            return;
                        }
                        signatures.set(parsed.id, {
                            signature: parsed.signature,
                            signerAddress: parsed.signerAddress,
                        });
                    } else {
                        skipped.set(parsed.id, parsed.reason ?? 'skipped');
                    }
                    res.writeHead(200, { 'content-type': 'text/plain' });
                    res.end('OK');
                });
                return;
            }

            if (req.method === 'POST' && req.url === '/done') {
                res.writeHead(200, { 'content-type': 'text/plain' });
                res.end('OK');
                res.on('finish', () => {
                    clearTimeout(timer);
                    server.close();
                    resolve({ signatures, skipped });
                });
                return;
            }

            res.writeHead(404);
            res.end('Not found');
        });

        const timer = setTimeout(() => {
            server.close();
            reject(new Error(`Batch sign flow timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        server.on('error', (err) => {
            clearTimeout(timer);
            reject(err);
        });

        server.listen(0, '127.0.0.1', () => {
            const addr = server.address() as AddressInfo;
            const url = `http://127.0.0.1:${addr.port}/`;
            const ready = opts.onUrlReady ?? defaultOpenInBrowser;
            void Promise.resolve(ready(url)).catch((error: unknown) => {
                clearTimeout(timer);
                server.close();
                reject(error);
            });
        });
    });
}

async function defaultOpenInBrowser(url: string): Promise<void> {
    const { default: open } = await import('open');
    await open(url);
}

function serializeMessageForBrowser(message: AttestationMessage): Record<string, unknown> {
    return {
        claims: {
            priorAttestation: message.claims.priorAttestation,
            publishedAt: message.claims.publishedAt.toString(),
            revision: message.claims.revision,
            slug: message.claims.slug,
        },
        schemaVersion: message.schemaVersion,
        subject: message.subject,
    };
}

function domainTypes(): Array<{ name: string; type: string }> {
    return [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
    ];
}
