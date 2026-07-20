//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
const require_eip712_schema = require("./eip712-schema.cjs");
let javascript_opentimestamps = require("javascript-opentimestamps");
javascript_opentimestamps = __toESM(javascript_opentimestamps, 1);
let node_http = require("node:http");
//#region src/ots/stamp.ts
const { DetachedTimestampFile: DetachedTimestampFile$1, Ops: Ops$1 } = javascript_opentimestamps.default;
/**
* Submit a SHA-256 digest to OpenTimestamps calendars and return the proof bytes.
*
* The returned proof initially contains only calendar attestations. Run upgrade()
* after ~24h to anchor it in a Bitcoin block.
*/
async function stampDigest(digest) {
	if (digest.length !== 32) throw new Error(`Expected 32-byte SHA-256 digest, got ${digest.length} bytes`);
	const detached = DetachedTimestampFile$1.fromHash(new Ops$1.OpSHA256(), Buffer.from(digest));
	await javascript_opentimestamps.default.stamp(detached);
	const bytes = detached.serializeToBytes.call(detached);
	return new Uint8Array(bytes);
}
/**
* Try to upgrade a calendar-only proof to a Bitcoin-anchored proof.
*
* Returns the (possibly upgraded) proof bytes plus a flag indicating whether
* the upgrade actually attached a Bitcoin attestation this time.
*/
async function upgradeProof(otsBytes) {
	const detached = DetachedTimestampFile$1.deserialize(Buffer.from(otsBytes));
	const upgraded = await javascript_opentimestamps.default.upgrade(detached);
	const bytes = detached.serializeToBytes.call(detached);
	return {
		bytes: new Uint8Array(bytes),
		upgraded
	};
}
//#endregion
//#region src/ots/verify.ts
const { DetachedTimestampFile, Ops } = javascript_opentimestamps.default;
/**
* Verify an OTS proof attests the given digest, and return the Bitcoin block
* attestation time if present.
*
* Network: this calls a public Bitcoin block-info source via the OTS library
* to validate the Merkle path. In production-paranoid mode you should run your
* own Bitcoin node and pass it explicitly (future enhancement).
*/
async function verifyOts(digest, otsBytes) {
	if (digest.length !== 32) return {
		details: `Expected 32-byte digest, got ${digest.length}`,
		ok: false,
		reason: "digest-mismatch"
	};
	let detached;
	let original;
	try {
		detached = DetachedTimestampFile.deserialize(Buffer.from(otsBytes));
		original = DetachedTimestampFile.fromHash(new Ops.OpSHA256(), Buffer.from(digest));
	} catch (error) {
		return {
			details: error.message,
			ok: false,
			reason: "invalid-proof"
		};
	}
	let attestations;
	try {
		attestations = await javascript_opentimestamps.default.verify(detached, original);
	} catch (error) {
		return {
			details: error.message,
			ok: false,
			reason: "invalid-proof"
		};
	}
	const bitcoin = attestations["bitcoin"];
	if (bitcoin === void 0) return {
		ok: false,
		reason: "pending-bitcoin"
	};
	return {
		bitcoinBlockTime: /* @__PURE__ */ new Date(bitcoin.timestamp * 1e3),
		ok: true
	};
}
//#endregion
//#region src/eth/sign-page-html.ts
/**
* Self-contained HTML page served by the local CLI server. Opens MetaMask
* (or any window.ethereum provider), requests EIP-712 v4 signature, POSTs
* the result back to the localhost callback.
*
* No bundler, no external script — just a string template. Keeping this
* pure-string makes it trivial to audit what gets shown to the wallet.
*/
function buildSignPageHtml(typedDataJson) {
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Sign attestation</title>
<style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 4rem auto; padding: 0 1rem; line-height: 1.5; }
    button { padding: 0.75rem 1.5rem; font-size: 1rem; cursor: pointer; }
    pre { background: #f4f4f4; padding: 1rem; overflow-x: auto; font-size: 0.85rem; }
    .ok { color: #0a7d22; }
    .err { color: #b00020; white-space: pre-wrap; }
</style>
</head>
<body>
<h1>Sign attestation</h1>
<p>Review the structured data below, then click <strong>Sign</strong>. Your wallet will show the same fields.</p>
<pre id="preview"></pre>
<p><button id="sign">Sign with wallet</button></p>
<p id="status"></p>
<script>
    const TYPED_DATA = JSON.parse(\`${typedDataJson.replace(/\\/g, String.raw`\\`).replace(/`/g, "\\`").replace(/<\/script>/gi, String.raw`<\/script>`)}\`);
    document.getElementById('preview').textContent = JSON.stringify(TYPED_DATA.message, null, 2);

    document.getElementById('sign').addEventListener('click', async () => {
        const status = document.getElementById('status');
        status.className = '';
        status.textContent = 'Requesting account…';

        if (!window.ethereum) {
            status.className = 'err';
            status.textContent = 'No window.ethereum provider found. Install MetaMask (or another wallet) and reload.';
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const signer = accounts[0];

            status.textContent = 'Awaiting wallet confirmation…';
            const signature = await window.ethereum.request({
                method: 'eth_signTypedData_v4',
                params: [signer, JSON.stringify(TYPED_DATA)],
            });

            status.textContent = 'Submitting signature…';
            const res = await fetch('/done', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ signature, signerAddress: signer }),
            });
            if (!res.ok) throw new Error('Server rejected the signature: HTTP ' + res.status);

            status.className = 'ok';
            status.textContent = 'Signed. You can close this tab.';
            document.getElementById('sign').disabled = true;
        } catch (err) {
            status.className = 'err';
            status.textContent = 'Failed: ' + (err && err.message ? err.message : String(err));
        }
    });
<\/script>
</body>
</html>`;
}
//#endregion
//#region src/eth/sign-flow.ts
const DEFAULT_TIMEOUT_MS = 300 * 1e3;
/**
* Spin up a one-shot localhost HTTP server, open the browser, wait for the user
* to sign with their wallet, return the signature.
*
* The local server only accepts loopback requests (127.0.0.1).
*/
async function signViaBrowser(opts) {
	const message = opts.message;
	const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
	const typedData = {
		domain: require_eip712_schema.ATTESTATION_DOMAIN_V1,
		message: serializeMessageForBrowser(message),
		primaryType: require_eip712_schema.ATTESTATION_PRIMARY_TYPE,
		types: {
			EIP712Domain: domainTypes(),
			...require_eip712_schema.ATTESTATION_TYPES_V1
		}
	};
	const html = buildSignPageHtml(JSON.stringify(typedData));
	return new Promise((resolve, reject) => {
		const server = (0, node_http.createServer)((req, res) => {
			if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
				res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
				res.end(html);
				return;
			}
			if (req.method === "POST" && req.url === "/done") {
				let body = "";
				req.on("data", (chunk) => {
					body += chunk.toString("utf8");
				});
				req.on("end", () => {
					let parsed;
					try {
						parsed = JSON.parse(body);
					} catch {
						res.writeHead(400);
						res.end("Parse error");
						return;
					}
					if (typeof parsed.signature !== "string" || !/^0x[0-9a-fA-F]{130}$/.test(parsed.signature) || typeof parsed.signerAddress !== "string" || !/^0x[0-9a-fA-F]{40}$/.test(parsed.signerAddress)) {
						res.writeHead(400);
						res.end("Invalid payload");
						return;
					}
					res.writeHead(200, { "content-type": "text/plain" });
					res.end("OK");
					res.on("finish", () => {
						clearTimeout(timer);
						server.close();
						resolve(parsed);
					});
				});
				return;
			}
			res.writeHead(404);
			res.end("Not found");
		});
		const timer = setTimeout(() => {
			server.close();
			reject(/* @__PURE__ */ new Error(`Sign flow timed out after ${timeoutMs}ms`));
		}, timeoutMs);
		server.on("error", (err) => {
			clearTimeout(timer);
			reject(err);
		});
		server.listen(0, "127.0.0.1", () => {
			const url = `http://127.0.0.1:${server.address().port}/`;
			const ready = opts.onUrlReady ?? defaultOpenInBrowser;
			Promise.resolve(ready(url)).catch((error) => {
				clearTimeout(timer);
				server.close();
				reject(error);
			});
		});
	});
}
async function defaultOpenInBrowser(url) {
	const { default: open } = await import("open");
	await open(url);
}
/**
* Convert AttestationMessage (with bigint publishedAt) to a JSON-serializable
* form for the browser. EIP-712 v4 expects numeric strings for uint64.
*/
function serializeMessageForBrowser(message) {
	return {
		claims: {
			priorAttestation: message.claims.priorAttestation,
			publishedAt: message.claims.publishedAt.toString(),
			revision: message.claims.revision,
			slug: message.claims.slug
		},
		schemaVersion: message.schemaVersion,
		subject: message.subject
	};
}
function domainTypes() {
	return [
		{
			name: "name",
			type: "string"
		},
		{
			name: "version",
			type: "string"
		},
		{
			name: "chainId",
			type: "uint256"
		}
	];
}
//#endregion
Object.defineProperty(exports, "signViaBrowser", {
	enumerable: true,
	get: function() {
		return signViaBrowser;
	}
});
Object.defineProperty(exports, "stampDigest", {
	enumerable: true,
	get: function() {
		return stampDigest;
	}
});
Object.defineProperty(exports, "upgradeProof", {
	enumerable: true,
	get: function() {
		return upgradeProof;
	}
});
Object.defineProperty(exports, "verifyOts", {
	enumerable: true,
	get: function() {
		return verifyOts;
	}
});

//# sourceMappingURL=sign-flow.cjs.map