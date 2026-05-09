/**
 * Self-contained HTML page served by the local CLI server. Opens MetaMask
 * (or any window.ethereum provider), requests EIP-712 v4 signature, POSTs
 * the result back to the localhost callback.
 *
 * No bundler, no external script — just a string template. Keeping this
 * pure-string makes it trivial to audit what gets shown to the wallet.
 */
export function buildSignPageHtml(typedDataJson: string): string {
    // TypedDataJson MUST already be a JSON string of EIP-712 v4 typed data
    // (with `domain`, `types`, `primaryType`, `message`).
    const escaped = typedDataJson
        .replace(/\\/g, String.raw`\\`)
        .replace(/`/g, '\\`')
        .replace(/<\/script>/gi, String.raw`<\/script>`);

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
    const TYPED_DATA = JSON.parse(\`${escaped}\`);
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
</script>
</body>
</html>`;
}
