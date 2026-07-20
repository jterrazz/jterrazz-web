Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_verify = require("./verify.cjs");
const require_eip712_schema = require("./eip712-schema.cjs");
let viem = require("viem");
let viem_chains = require("viem/chains");
//#region src/browser/ens.ts
const client = (0, viem.createPublicClient)({
	chain: viem_chains.mainnet,
	transport: (0, viem.http)("https://ethereum-rpc.publicnode.com")
});
/**
* Reverse-resolve an Ethereum address to its primary ENS name.
*
* Pure display concern — never persisted in the attestation file. The signer
* lib operates on addresses; this is rendered dynamically by web consumers who
* want a friendlier label.
*
* Returns null on any failure (network, no name set, malformed reply).
*/
async function resolveEnsName(address) {
	try {
		return await client.getEnsName({ address });
	} catch {
		return null;
	}
}
//#endregion
//#region src/browser/verify-from-url.ts
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
async function verifyFromUrl(articleUrl, opts = {}) {
	const fetchFn = opts.fetchFn ?? fetch;
	const manifestUrl = resolveManifestUrl(articleUrl);
	let manifest;
	try {
		manifest = await fetchJson(fetchFn, manifestUrl);
	} catch (error) {
		const details = error.message;
		return {
			authorship: {
				details,
				error: "fetch",
				kind: "failed"
			},
			date: {
				details,
				error: "fetch",
				kind: "failed"
			}
		};
	}
	const base = new URL(manifestUrl);
	let content;
	let attestationJson;
	try {
		[content, attestationJson] = await Promise.all([fetchText(fetchFn, new URL(manifest.content, base).toString()), fetchText(fetchFn, new URL(manifest.attestation, base).toString())]);
	} catch (error) {
		const details = error.message;
		return {
			authorship: {
				details,
				error: "fetch",
				kind: "failed"
			},
			date: {
				details,
				error: "fetch",
				kind: "failed"
			}
		};
	}
	const attestation = require_verify.parse(attestationJson);
	const sig = await require_verify.verifyAttestation({
		attestation,
		content
	});
	if (!sig.ok) return {
		authorship: {
			error: sig.error.kind,
			kind: "failed"
		},
		date: {
			kind: "skipped",
			reason: "opt-out"
		}
	};
	const authorship = {
		kind: "verified",
		signedAt: /* @__PURE__ */ new Date(Number(attestation.claims.publishedAt) * 1e3),
		signerAddress: sig.signerAddress
	};
	if (opts.skipOts) return {
		authorship,
		date: {
			kind: "skipped",
			reason: "opt-out"
		}
	};
	if (!manifest.otsVerifier) return {
		authorship,
		date: {
			kind: "skipped",
			reason: "no-ots-file"
		}
	};
	try {
		const result = await fetchJson(fetchFn, new URL(manifest.otsVerifier, base).toString());
		if (result.ok) return {
			authorship,
			date: {
				bitcoinTime: new Date(result.bitcoinTime),
				kind: "verified"
			}
		};
		if (result.reason === "pending-bitcoin") return {
			authorship,
			date: { kind: "pending" }
		};
		return {
			authorship,
			date: {
				details: result.details,
				error: result.reason,
				kind: "failed"
			}
		};
	} catch (error) {
		return {
			authorship,
			date: {
				details: error.message,
				error: "fetch",
				kind: "failed"
			}
		};
	}
}
function resolveManifestUrl(articleUrl) {
	const base = globalThis.location?.origin;
	const url = new URL(articleUrl, base);
	if (!url.pathname.endsWith("/")) url.pathname += "/";
	url.pathname += "proof.json";
	return url.toString();
}
async function fetchJson(fetchFn, url) {
	const res = await fetchFn(url);
	if (!res.ok) throw new Error(`GET ${url}: HTTP ${res.status}`);
	return await res.json();
}
async function fetchText(fetchFn, url) {
	const res = await fetchFn(url);
	if (!res.ok) throw new Error(`GET ${url}: HTTP ${res.status}`);
	return res.text();
}
//#endregion
exports.ATTESTATION_DOMAIN_V1 = require_eip712_schema.ATTESTATION_DOMAIN_V1;
exports.ATTESTATION_PRIMARY_TYPE = require_eip712_schema.ATTESTATION_PRIMARY_TYPE;
exports.ATTESTATION_TYPES_V1 = require_eip712_schema.ATTESTATION_TYPES_V1;
exports.InvalidContentError = require_verify.InvalidContentError;
exports.NO_PRIOR_ATTESTATION = require_eip712_schema.NO_PRIOR_ATTESTATION;
exports.buildAttestationMessage = require_verify.buildAttestationMessage;
exports.canonicalize = require_verify.canonicalize;
exports.fromStored = require_verify.fromStored;
exports.parse = require_verify.parse;
exports.resolveEnsName = resolveEnsName;
exports.sha256Hex = require_verify.sha256Hex;
exports.stringify = require_verify.stringify;
exports.toStored = require_verify.toStored;
exports.verifyAttestation = require_verify.verifyAttestation;
exports.verifyFromUrl = verifyFromUrl;

//# sourceMappingURL=browser.cjs.map