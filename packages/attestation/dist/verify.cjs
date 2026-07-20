const require_eip712_schema = require("./eip712-schema.cjs");
let _noble_hashes_sha2_js = require("@noble/hashes/sha2.js");
let viem = require("viem");
//#region src/version.ts
const SCHEMA_VERSION = 1;
const CANONICAL_VERSION = 1;
//#endregion
//#region src/core/canonicalize.ts
/**
* Canonicalize an article body for attestation v1.
*
* FROZEN CONTRACT — v1 rules below must NEVER change. Any modification requires
* publishing a v2 alongside (and v1 verifiers stay alive forever).
*
* Rules applied in order:
*  1. Reject unpaired UTF-16 surrogates (corrupt input).
*  2. Strip a leading BOM (U+FEFF) if present.
*  3. Apply Unicode NFC normalization.
*  4. Convert CRLF and stray CR to LF.
*  5. Trim trailing whitespace and append exactly one LF.
*  6. Encode as UTF-8 bytes.
*
* No markdown parsing. No per-line whitespace trim (would break "  \n" soft breaks).
* No tab → space substitution (would break code blocks).
* No interior whitespace collapsing.
*/
function canonicalize(input) {
	assertValidUtf16(input);
	let s = input;
	if (s.charCodeAt(0) === 65279) s = s.slice(1);
	s = s.normalize("NFC");
	s = s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	s = `${s.replace(/\s+$/u, "")}\n`;
	return new TextEncoder().encode(s);
}
var InvalidContentError = class extends Error {
	name = "InvalidContentError";
};
function assertValidUtf16(s) {
	for (let i = 0; i < s.length; i++) {
		const code = s.charCodeAt(i);
		if (code >= 55296 && code <= 56319) {
			const next = s.charCodeAt(i + 1);
			if (!(next >= 56320 && next <= 57343)) throw new InvalidContentError(`Unpaired high surrogate at index ${i}`);
			i++;
		} else if (code >= 56320 && code <= 57343) throw new InvalidContentError(`Unpaired low surrogate at index ${i}`);
	}
}
//#endregion
//#region src/core/sha256.ts
/**
* SHA-256 of bytes, returned as bare hex (no 0x prefix).
*
* Uses @noble/hashes — pure JS, sync, audited, runs identically in Node, Bun,
* Deno, and every modern browser. This is the only hash primitive used by the
* package, so swapping the implementation here is the single point of change.
*/
function sha256Hex(bytes) {
	const out = (0, _noble_hashes_sha2_js.sha256)(bytes);
	let hex = "";
	for (const byte of out) hex += byte.toString(16).padStart(2, "0");
	return hex;
}
//#endregion
//#region src/attestation/create.ts
function buildAttestationMessage(input) {
	const digest = sha256Hex(canonicalize(input.content));
	return {
		claims: {
			priorAttestation: input.priorAttestation ?? "0x0000000000000000000000000000000000000000000000000000000000000000",
			publishedAt: toUnixSeconds(input.publishedAt),
			revision: input.revision ?? 1,
			slug: input.slug
		},
		schemaVersion: 1,
		subject: {
			contentDigest: `0x${digest}`,
			locale: input.locale,
			title: input.title
		}
	};
}
async function signAttestation(message, account) {
	const signature = await account.signTypedData({
		domain: require_eip712_schema.ATTESTATION_DOMAIN_V1,
		message,
		primaryType: require_eip712_schema.ATTESTATION_PRIMARY_TYPE,
		types: require_eip712_schema.ATTESTATION_TYPES_V1
	});
	return {
		...message,
		signature,
		signerAddress: account.address
	};
}
async function createAttestation(input, account) {
	return signAttestation(buildAttestationMessage(input), account);
}
function toUnixSeconds(value) {
	if (typeof value === "bigint") return value;
	if (typeof value === "number") return BigInt(Math.floor(value));
	return BigInt(Math.floor(value.getTime() / 1e3));
}
//#endregion
//#region src/attestation/serialize.ts
function toStored(att) {
	return {
		claims: {
			priorAttestation: att.claims.priorAttestation,
			publishedAt: att.claims.publishedAt.toString(),
			revision: att.claims.revision,
			slug: att.claims.slug
		},
		schemaVersion: att.schemaVersion,
		signature: att.signature,
		signerAddress: att.signerAddress,
		subject: att.subject
	};
}
function fromStored(stored) {
	return {
		claims: {
			priorAttestation: stored.claims.priorAttestation,
			publishedAt: BigInt(stored.claims.publishedAt),
			revision: stored.claims.revision,
			slug: stored.claims.slug
		},
		schemaVersion: stored.schemaVersion,
		signature: stored.signature,
		signerAddress: stored.signerAddress,
		subject: stored.subject
	};
}
function stringify(att) {
	return `${JSON.stringify(toStored(att), null, 2)}\n`;
}
function parse(json) {
	return fromStored(JSON.parse(json));
}
//#endregion
//#region src/attestation/verify.ts
async function verifyAttestation(input) {
	const att = input.attestation;
	if (att.schemaVersion !== 1) return {
		error: {
			kind: "schema-version-unsupported",
			version: att.schemaVersion
		},
		ok: false
	};
	const expected = att.subject.contentDigest;
	const actual = `0x${sha256Hex(canonicalize(input.content))}`;
	if (actual !== expected) return {
		error: {
			actualDigest: actual,
			expectedDigest: expected,
			kind: "content-mismatch"
		},
		ok: false
	};
	let recovered;
	try {
		recovered = await (0, viem.recoverTypedDataAddress)({
			domain: require_eip712_schema.ATTESTATION_DOMAIN_V1,
			message: {
				claims: att.claims,
				schemaVersion: att.schemaVersion,
				subject: att.subject
			},
			primaryType: require_eip712_schema.ATTESTATION_PRIMARY_TYPE,
			signature: att.signature,
			types: require_eip712_schema.ATTESTATION_TYPES_V1
		});
	} catch (error) {
		return {
			error: {
				kind: "invalid-signature",
				reason: error.message
			},
			ok: false
		};
	}
	if (recovered.toLowerCase() !== att.signerAddress.toLowerCase()) return {
		error: {
			declared: att.signerAddress,
			kind: "signer-mismatch",
			recovered
		},
		ok: false
	};
	return {
		ok: true,
		signerAddress: recovered
	};
}
//#endregion
Object.defineProperty(exports, "CANONICAL_VERSION", {
	enumerable: true,
	get: function() {
		return CANONICAL_VERSION;
	}
});
Object.defineProperty(exports, "InvalidContentError", {
	enumerable: true,
	get: function() {
		return InvalidContentError;
	}
});
Object.defineProperty(exports, "SCHEMA_VERSION", {
	enumerable: true,
	get: function() {
		return SCHEMA_VERSION;
	}
});
Object.defineProperty(exports, "buildAttestationMessage", {
	enumerable: true,
	get: function() {
		return buildAttestationMessage;
	}
});
Object.defineProperty(exports, "canonicalize", {
	enumerable: true,
	get: function() {
		return canonicalize;
	}
});
Object.defineProperty(exports, "createAttestation", {
	enumerable: true,
	get: function() {
		return createAttestation;
	}
});
Object.defineProperty(exports, "fromStored", {
	enumerable: true,
	get: function() {
		return fromStored;
	}
});
Object.defineProperty(exports, "parse", {
	enumerable: true,
	get: function() {
		return parse;
	}
});
Object.defineProperty(exports, "sha256Hex", {
	enumerable: true,
	get: function() {
		return sha256Hex;
	}
});
Object.defineProperty(exports, "signAttestation", {
	enumerable: true,
	get: function() {
		return signAttestation;
	}
});
Object.defineProperty(exports, "stringify", {
	enumerable: true,
	get: function() {
		return stringify;
	}
});
Object.defineProperty(exports, "toStored", {
	enumerable: true,
	get: function() {
		return toStored;
	}
});
Object.defineProperty(exports, "verifyAttestation", {
	enumerable: true,
	get: function() {
		return verifyAttestation;
	}
});

//# sourceMappingURL=verify.cjs.map