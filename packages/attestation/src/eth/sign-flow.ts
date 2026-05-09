import { createServer as createHttpServer } from 'node:http';
import { type AddressInfo, createServer } from 'node:net';

import {
    ATTESTATION_DOMAIN_V1,
    ATTESTATION_PRIMARY_TYPE,
    ATTESTATION_TYPES_V1,
    type AttestationMessage,
} from '../core/eip712-schema.js';
import { buildSignPageHtml } from './sign-page-html.js';

export type SignFlowOptions = {
    message: AttestationMessage;
    onUrlReady?: (url: string) => Promise<void> | void;
    timeoutMs?: number;
};

export type SignFlowResult = {
    signature: `0x${string}`;
    signerAddress: `0x${string}`;
};

const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000;

/**
 * Spin up a one-shot localhost HTTP server, open the browser, wait for the user
 * to sign with their wallet, return the signature.
 *
 * The local server only accepts loopback requests (127.0.0.1).
 */
export async function signViaBrowser(opts: SignFlowOptions): Promise<SignFlowResult> {
    const message = opts.message;
    const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    const typedData = {
        domain: ATTESTATION_DOMAIN_V1,
        message: serializeMessageForBrowser(message),
        primaryType: ATTESTATION_PRIMARY_TYPE,
        types: { EIP712Domain: domainTypes(), ...ATTESTATION_TYPES_V1 },
    };
    const html = buildSignPageHtml(JSON.stringify(typedData));

    return new Promise<SignFlowResult>((resolve, reject) => {
        const server = createHttpServer((req, res) => {
            if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
                res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
                res.end(html);
                return;
            }

            if (req.method === 'POST' && req.url === '/done') {
                let body = '';
                req.on('data', (chunk: Buffer) => {
                    body += chunk.toString('utf8');
                });
                req.on('end', () => {
                    let parsed: { signature: `0x${string}`; signerAddress: `0x${string}` };
                    try {
                        parsed = JSON.parse(body) as typeof parsed;
                    } catch {
                        res.writeHead(400);
                        res.end('Parse error');
                        return; // Keep server running so user can retry
                    }
                    if (
                        typeof parsed.signature !== 'string' ||
                        !/^0x[0-9a-fA-F]{130}$/.test(parsed.signature) ||
                        typeof parsed.signerAddress !== 'string' ||
                        !/^0x[0-9a-fA-F]{40}$/.test(parsed.signerAddress)
                    ) {
                        res.writeHead(400);
                        res.end('Invalid payload');
                        return; // Keep server running so user can retry
                    }
                    res.writeHead(200, { 'content-type': 'text/plain' });
                    res.end('OK');
                    res.on('finish', () => {
                        clearTimeout(timer);
                        server.close();
                        resolve(parsed);
                    });
                });
                return;
            }

            res.writeHead(404);
            res.end('Not found');
        });

        const timer = setTimeout(() => {
            server.close();
            reject(new Error(`Sign flow timed out after ${timeoutMs}ms`));
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

/**
 * Convert AttestationMessage (with bigint publishedAt) to a JSON-serializable
 * form for the browser. EIP-712 v4 expects numeric strings for uint64.
 */
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

// Suppress unused-import lint: createServer kept for future net-level helpers.
void createServer;
