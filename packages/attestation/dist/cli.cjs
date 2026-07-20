const require_sign_flow = require("./sign-flow.cjs");
const require_verify = require("./verify.cjs");
const require_audit = require("./audit.cjs");
let node_util = require("node:util");
let node_fs_promises = require("node:fs/promises");
let node_path = require("node:path");
//#region src/cli/io.ts
const supportsColor = process.stdout.isTTY === true && !process.env.NO_COLOR;
const fmt = {
	bold: (s) => supportsColor ? `\x1b[1m${s}\x1b[0m` : s,
	dim: (s) => supportsColor ? `\x1b[2m${s}\x1b[0m` : s,
	fail: (s) => supportsColor ? `\x1b[31m${s}\x1b[0m` : s,
	info: (s) => supportsColor ? `\x1b[36m${s}\x1b[0m` : s,
	ok: (s) => supportsColor ? `\x1b[32m${s}\x1b[0m` : s,
	warn: (s) => supportsColor ? `\x1b[33m${s}\x1b[0m` : s
};
function checkmark() {
	return fmt.ok("✓");
}
function crossmark() {
	return fmt.fail("✗");
}
//#endregion
//#region src/cli/sign.ts
async function runSign(args) {
	const content = await (0, node_fs_promises.readFile)(args.file, "utf8");
	const locale = args.locale ?? deriveLocale(args.file);
	const publishedAt = args.publishedAt ? new Date(args.publishedAt) : /* @__PURE__ */ new Date();
	const canonical = require_verify.canonicalize(content);
	process.stdout.write(`${checkmark()} Canonicalized ${canonical.length} bytes (${locale})\n`);
	if (!args.skipAudit) {
		const findings = require_audit.audit(canonical);
		if (findings.length > 0) {
			process.stdout.write(`${fmt.warn("!")} ${findings.length} suspicious char(s) found:\n`);
			for (const f of findings) process.stdout.write(`  line ${f.line}, col ${f.column}: U+${f.codepoint.toString(16).toUpperCase().padStart(4, "0")} (${f.name})\n`);
			process.stdout.write(`  Pass --skip-audit to sign anyway.\n`);
			throw new Error("Audit failed: clean up suspicious characters first.");
		}
	}
	const message = require_verify.buildAttestationMessage({
		content,
		locale,
		priorAttestation: args.priorAttestation,
		publishedAt,
		revision: args.revision,
		slug: args.slug,
		title: args.title
	});
	process.stdout.write(`${fmt.info("→")} Content digest: ${message.subject.contentDigest}\n`);
	process.stdout.write(`${fmt.info("→")} Opening browser to sign with your wallet…\n`);
	const { signature, signerAddress } = await require_sign_flow.signViaBrowser({ message });
	const signed = {
		...message,
		signature,
		signerAddress
	};
	process.stdout.write(`${checkmark()} Signed by ${fmt.bold(signerAddress)}\n`);
	const baseName = (0, node_path.basename)(args.file, (0, node_path.extname)(args.file));
	const dir = (0, node_path.dirname)(args.file);
	const attestationPath = (0, node_path.join)(dir, `${baseName}.attestation.json`);
	await (0, node_fs_promises.writeFile)(attestationPath, require_verify.stringify(signed), "utf8");
	process.stdout.write(`${checkmark()} Wrote ${attestationPath}\n`);
	if (!args.skipStamp) {
		process.stdout.write(`${fmt.info("→")} Submitting to OpenTimestamps calendars…\n`);
		const otsBytes = await require_sign_flow.stampDigest(hexToBytes$1(message.subject.contentDigest));
		const otsPath = (0, node_path.join)(dir, `${baseName}.ots`);
		await (0, node_fs_promises.writeFile)(otsPath, Buffer.from(otsBytes));
		process.stdout.write(`${checkmark()} Wrote ${otsPath} (${otsBytes.length} bytes, calendar-only)\n`);
		process.stdout.write(`  ${fmt.dim("Run `attestation upgrade` in ~24h to anchor in Bitcoin.")}\n`);
	}
}
function deriveLocale(file) {
	const name = (0, node_path.basename)(file, (0, node_path.extname)(file));
	if (/^[a-z]{2}$/.test(name)) return name;
	throw new Error(`Cannot derive locale from filename "${(0, node_path.basename)(file)}". Pass --locale explicitly.`);
}
function hexToBytes$1(hex) {
	const stripped = hex.slice(2);
	const out = new Uint8Array(stripped.length / 2);
	for (let i = 0; i < out.length; i++) out[i] = parseInt(stripped.slice(i * 2, i * 2 + 2), 16);
	return out;
}
//#endregion
//#region src/cli/upgrade.ts
async function runUpgrade(args) {
	if (args.files.length === 0) throw new Error("No .ots files provided.");
	for (const path of args.files) {
		process.stdout.write(`${fmt.info("→")} ${path}\n`);
		const before = await (0, node_fs_promises.readFile)(path);
		const { bytes, upgraded } = await require_sign_flow.upgradeProof(new Uint8Array(before));
		if (upgraded) {
			await (0, node_fs_promises.writeFile)(path, Buffer.from(bytes));
			process.stdout.write(`  ${checkmark()} Upgraded to Bitcoin attestation (${bytes.length} bytes)\n`);
		} else process.stdout.write(`  ${fmt.dim("· No new attestation available yet, leaving file untouched.")}\n`);
	}
}
//#endregion
//#region src/cli/verify.ts
async function runVerify(args) {
	const sources = await loadSources(args);
	const attestation = require_verify.parse(sources.attestationJson);
	const sigResult = await require_verify.verifyAttestation({
		attestation,
		content: sources.content
	});
	if (!sigResult.ok) {
		printSignatureFailure(sigResult.error);
		return false;
	}
	process.stdout.write(`${checkmark()} Content digest matches signature\n`);
	process.stdout.write(`${checkmark()} Signature valid — signed by ${fmt.bold(sigResult.signerAddress)}\n`);
	if (args.skipOts || sources.otsBytes === null) {
		process.stdout.write(`${fmt.dim("· OTS verification skipped")}\n`);
		return true;
	}
	const otsResult = await require_sign_flow.verifyOts(hexToBytes(attestation.subject.contentDigest), sources.otsBytes);
	if (!otsResult.ok) {
		process.stdout.write(`${crossmark()} OTS: ${otsResult.reason}`);
		if (otsResult.details) process.stdout.write(` — ${otsResult.details}`);
		process.stdout.write(`\n`);
		return otsResult.reason === "pending-bitcoin";
	}
	process.stdout.write(`${checkmark()} Bitcoin timestamp confirmed at ${otsResult.bitcoinBlockTime.toISOString()}\n`);
	return true;
}
async function loadSources(args) {
	if (/^https?:\/\//.test(args.target)) return loadFromUrl(args.target);
	return loadFromFile(args.target);
}
async function loadFromFile(filePath) {
	const content = await (0, node_fs_promises.readFile)(filePath, "utf8");
	const dir = (0, node_path.dirname)(filePath);
	const base = (0, node_path.basename)(filePath, (0, node_path.extname)(filePath));
	const attestationJson = await (0, node_fs_promises.readFile)((0, node_path.join)(dir, `${base}.attestation.json`), "utf8");
	let otsBytes = null;
	try {
		const buf = await (0, node_fs_promises.readFile)((0, node_path.join)(dir, `${base}.ots`));
		otsBytes = new Uint8Array(buf);
	} catch {
		otsBytes = null;
	}
	return {
		attestationJson,
		content,
		otsBytes
	};
}
async function loadFromUrl(url) {
	const proofManifestUrl = await resolveManifestUrl(url);
	const manifest = await fetchJson(proofManifestUrl);
	const base = new URL(proofManifestUrl);
	const [content, attestationJson, otsBuf] = await Promise.all([
		fetchText(new URL(manifest.content, base).toString()),
		fetchText(new URL(manifest.attestation, base).toString()),
		fetchBytes(new URL(manifest.ots, base).toString()).catch(() => null)
	]);
	return {
		attestationJson,
		content,
		otsBytes: otsBuf
	};
}
async function resolveManifestUrl(articleUrl) {
	const url = new URL(articleUrl);
	if (!url.pathname.endsWith("/")) url.pathname += "/";
	url.pathname += "proof.json";
	return url.toString();
}
async function fetchJson(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Fetch ${url} failed: HTTP ${res.status}`);
	return await res.json();
}
async function fetchText(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Fetch ${url} failed: HTTP ${res.status}`);
	return res.text();
}
async function fetchBytes(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Fetch ${url} failed: HTTP ${res.status}`);
	return new Uint8Array(await res.arrayBuffer());
}
function printSignatureFailure(error) {
	process.stdout.write(`${crossmark()} ${fmt.fail("Verification failed")}: ${error.kind}\n`);
	for (const [k, v] of Object.entries(error)) {
		if (k === "kind") continue;
		process.stdout.write(`  ${k}: ${String(v)}\n`);
	}
}
function hexToBytes(hex) {
	const stripped = hex.slice(2);
	const out = new Uint8Array(stripped.length / 2);
	for (let i = 0; i < out.length; i++) out[i] = parseInt(stripped.slice(i * 2, i * 2 + 2), 16);
	return out;
}
//#endregion
//#region src/cli/index.ts
const HELP = `${fmt.bold("attestation")} — sign articles with EIP-712 + Bitcoin (OpenTimestamps).

Usage:
  attestation sign <file> --title <t> --slug <s> [--published-at <iso>]
  attestation verify <url|file> [--skip-ots]
  attestation upgrade <ots-file> [<ots-file> …]

Run \`attestation <command> --help\` for command-specific options.
`;
async function runCli(argv) {
	const [command, ...rest] = argv;
	if (command === void 0 || command === "-h" || command === "--help" || command === "help") {
		process.stdout.write(HELP);
		return 0;
	}
	try {
		if (command === "sign") return await dispatchSign(rest);
		if (command === "verify") return await dispatchVerify(rest);
		if (command === "upgrade") return await dispatchUpgrade(rest);
		process.stderr.write(`Unknown command: ${command}\n${HELP}`);
		return 2;
	} catch (error) {
		process.stderr.write(`${fmt.fail("Error:")} ${error.message}\n`);
		return 1;
	}
}
async function dispatchSign(argv) {
	const { positionals, values } = (0, node_util.parseArgs)({
		allowPositionals: true,
		args: argv,
		options: {
			locale: { type: "string" },
			"prior-attestation": { type: "string" },
			"published-at": { type: "string" },
			revision: { type: "string" },
			"skip-audit": { type: "boolean" },
			"skip-stamp": { type: "boolean" },
			slug: { type: "string" },
			title: { type: "string" }
		}
	});
	const file = positionals[0];
	if (!file) throw new Error("Missing required <file> argument.");
	if (!values.title) throw new Error("Missing required --title.");
	if (!values.slug) throw new Error("Missing required --slug.");
	await runSign({
		file,
		locale: values.locale,
		priorAttestation: values["prior-attestation"],
		publishedAt: values["published-at"],
		revision: values.revision ? Number(values.revision) : void 0,
		skipAudit: values["skip-audit"],
		skipStamp: values["skip-stamp"],
		slug: values.slug,
		title: values.title
	});
	return 0;
}
async function dispatchVerify(argv) {
	const { positionals, values } = (0, node_util.parseArgs)({
		allowPositionals: true,
		args: argv,
		options: { "skip-ots": { type: "boolean" } }
	});
	const target = positionals[0];
	if (!target) throw new Error("Missing required <url|file> argument.");
	return await runVerify({
		skipOts: values["skip-ots"],
		target
	}) ? 0 : 1;
}
async function dispatchUpgrade(argv) {
	const { positionals } = (0, node_util.parseArgs)({
		allowPositionals: true,
		args: argv,
		options: {}
	});
	await runUpgrade({ files: positionals });
	return 0;
}
//#endregion
//#region src/cli.ts
runCli(process.argv.slice(2)).then((code) => process.exit(code));
//#endregion

//# sourceMappingURL=cli.cjs.map