import { a as toStored, d as canonicalize, i as stringify, l as sha256Hex, n as fromStored, o as buildAttestationMessage, r as parse, t as verifyAttestation, u as InvalidContentError } from "./verify.js";
import { i as NO_PRIOR_ATTESTATION, n as ATTESTATION_PRIMARY_TYPE, r as ATTESTATION_TYPES_V1, t as ATTESTATION_DOMAIN_V1 } from "./eip712-schema.js";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
//#region src/browser/ens.ts
const client = createPublicClient({
	chain: mainnet,
	transport: http("https://ethereum-rpc.publicnode.com")
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
	const attestation = parse(attestationJson);
	const sig = await verifyAttestation({
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
export { ATTESTATION_DOMAIN_V1, ATTESTATION_PRIMARY_TYPE, ATTESTATION_TYPES_V1, InvalidContentError, NO_PRIOR_ATTESTATION, buildAttestationMessage, canonicalize, fromStored, parse, resolveEnsName, sha256Hex, stringify, toStored, verifyAttestation, verifyFromUrl };

//# sourceMappingURL=browser.js.map