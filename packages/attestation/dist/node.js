import { n as ATTESTATION_PRIMARY_TYPE, r as ATTESTATION_TYPES_V1, t as ATTESTATION_DOMAIN_V1 } from "./eip712-schema.js";
import { i as upgradeProof, n as verifyOts, r as stampDigest, t as signViaBrowser } from "./sign-flow.js";
import { createServer } from "node:http";
//#region src/eth/sign-batch-page-html.ts
/**
* HTML page served by the local CLI server during batch signing. Loads the
* full list of EIP-712 typed-data messages, walks them sequentially, and POSTs
* each signature back as MetaMask returns it. The server closes after the user
* either signs the last entry or clicks "Done".
*/
function buildBatchSignPageHtml(entries) {
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Sign all attestations</title>
<style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 3rem auto; padding: 0 1rem; line-height: 1.5; color: #111; }
    h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
    .lead { color: #666; margin: 0 0 2rem; }
    .controls { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; align-items: center; }
    button { padding: 0.6rem 1rem; font-size: 0.95rem; cursor: pointer; border: 1px solid #ccc; background: #fff; border-radius: 6px; }
    button.primary { background: #111; color: #fff; border-color: #111; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .progress { font-size: 0.85rem; color: #666; }
    ul.entries { list-style: none; padding: 0; margin: 0; border-top: 1px solid #eee; }
    ul.entries li { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid #eee; font-size: 0.9rem; }
    .pill { font-family: ui-monospace, monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 8px; border-radius: 999px; border: 1px solid; }
    .pill.idle { color: #999; border-color: #ddd; }
    .pill.active { color: #0070f3; border-color: #c6dfff; background: #f0f7ff; }
    .pill.signed { color: #0a7d22; border-color: #b8e6c1; background: #f0faf3; }
    .pill.skipped { color: #b78403; border-color: #f1d57f; background: #fffaeb; }
    .pill.error { color: #b00020; border-color: #f5b8c1; background: #fef0f2; }
    .label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .err-msg { font-size: 0.75rem; color: #b00020; padding: 0 0 0.5rem 0; }
    pre.preview { max-height: 200px; overflow: auto; font-size: 0.8rem; background: #f7f7f7; padding: 0.75rem; border-radius: 6px; margin: 0 0 1.5rem; }
</style>
</head>
<body>
<h1>Sign attestations</h1>
<p class="lead" id="lead"></p>
<div class="controls">
    <button class="primary" id="run">Sign all</button>
    <button id="finish" disabled>Done</button>
    <span class="progress" id="progress"></span>
</div>
<ul class="entries" id="entries"></ul>
<script>
    const ENTRIES = JSON.parse(\`${JSON.stringify(entries).replace(/\\/g, String.raw`\\`).replace(/`/g, "\\`").replace(/<\/script>/gi, String.raw`<\/script>`)}\`);
    const ul = document.getElementById('entries');
    const lead = document.getElementById('lead');
    const progress = document.getElementById('progress');
    const runBtn = document.getElementById('run');
    const finishBtn = document.getElementById('finish');

    lead.textContent = ENTRIES.length + ' article' + (ENTRIES.length === 1 ? '' : 's') + ' to sign. MetaMask will pop up once per article — review the typed data and confirm.';
    progress.textContent = '0 / ' + ENTRIES.length;

    const rows = ENTRIES.map((e, i) => {
        const li = document.createElement('li');
        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = (i + 1) + '. ' + e.label;
        const pill = document.createElement('span');
        pill.className = 'pill idle';
        pill.textContent = 'idle';
        li.appendChild(pill);
        li.appendChild(label);
        ul.appendChild(li);
        return { pill, li };
    });

    let signed = 0;

    async function signOne(i) {
        const entry = ENTRIES[i];
        rows[i].pill.className = 'pill active';
        rows[i].pill.textContent = 'signing';

        if (!window.ethereum) throw new Error('No window.ethereum provider');

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = accounts[0];

        let signature;
        try {
            signature = await window.ethereum.request({
                method: 'eth_signTypedData_v4',
                params: [signer, JSON.stringify(entry.typedData)],
            });
        } catch (err) {
            const msg = err && err.message ? err.message : String(err);
            rows[i].pill.className = 'pill error';
            rows[i].pill.textContent = 'rejected';
            const errLi = document.createElement('div');
            errLi.className = 'err-msg';
            errLi.textContent = msg;
            rows[i].li.appendChild(errLi);
            await fetch('/skip', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ id: entry.id, reason: msg }),
            });
            return false;
        }

        const res = await fetch('/sig', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: entry.id, signature, signerAddress: signer }),
        });
        if (!res.ok) {
            rows[i].pill.className = 'pill error';
            rows[i].pill.textContent = 'server-rejected';
            return false;
        }
        rows[i].pill.className = 'pill signed';
        rows[i].pill.textContent = 'signed';
        signed++;
        progress.textContent = signed + ' / ' + ENTRIES.length;
        return true;
    }

    runBtn.addEventListener('click', async () => {
        runBtn.disabled = true;
        for (let i = 0; i < ENTRIES.length; i++) {
            try { await signOne(i); } catch (err) {
                console.error(err);
                rows[i].pill.className = 'pill error';
                rows[i].pill.textContent = 'error';
            }
        }
        finishBtn.disabled = false;
        finishBtn.classList.add('primary');
    });

    finishBtn.addEventListener('click', async () => {
        finishBtn.disabled = true;
        await fetch('/done', { method: 'POST' });
        document.body.innerHTML = '<h1>Done.</h1><p>You can close this tab.</p>';
    });
<\/script>
</body>
</html>`;
}
//#endregion
//#region src/eth/sign-batch-flow.ts
const DEFAULT_TIMEOUT_MS = 1800 * 1e3;
async function signBatchViaBrowser(opts) {
	const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
	const html = buildBatchSignPageHtml(opts.entries.map((e) => ({
		id: e.id,
		label: e.label,
		typedData: {
			domain: ATTESTATION_DOMAIN_V1,
			message: serializeMessageForBrowser(e.message),
			primaryType: ATTESTATION_PRIMARY_TYPE,
			types: {
				EIP712Domain: domainTypes(),
				...ATTESTATION_TYPES_V1
			}
		}
	})));
	const signatures = /* @__PURE__ */ new Map();
	const skipped = /* @__PURE__ */ new Map();
	return new Promise((resolve, reject) => {
		const server = createServer((req, res) => {
			if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
				res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
				res.end(html);
				return;
			}
			if (req.method === "POST" && (req.url === "/sig" || req.url === "/skip")) {
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
					if (req.url === "/sig") {
						if (typeof parsed.signature !== "string" || !/^0x[0-9a-fA-F]{130}$/.test(parsed.signature) || typeof parsed.signerAddress !== "string" || !/^0x[0-9a-fA-F]{40}$/.test(parsed.signerAddress)) {
							res.writeHead(400);
							res.end("Invalid payload");
							return;
						}
						signatures.set(parsed.id, {
							signature: parsed.signature,
							signerAddress: parsed.signerAddress
						});
					} else skipped.set(parsed.id, parsed.reason ?? "skipped");
					res.writeHead(200, { "content-type": "text/plain" });
					res.end("OK");
				});
				return;
			}
			if (req.method === "POST" && req.url === "/done") {
				res.writeHead(200, { "content-type": "text/plain" });
				res.end("OK");
				res.on("finish", () => {
					clearTimeout(timer);
					server.close();
					resolve({
						signatures,
						skipped
					});
				});
				return;
			}
			res.writeHead(404);
			res.end("Not found");
		});
		const timer = setTimeout(() => {
			server.close();
			reject(/* @__PURE__ */ new Error(`Batch sign flow timed out after ${timeoutMs}ms`));
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
export { signBatchViaBrowser, signViaBrowser, stampDigest, upgradeProof, verifyOts };

//# sourceMappingURL=node.js.map