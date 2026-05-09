/**
 * HTML page served by the local CLI server during batch signing. Loads the
 * full list of EIP-712 typed-data messages, walks them sequentially, and POSTs
 * each signature back as MetaMask returns it. The server closes after the user
 * either signs the last entry or clicks "Done".
 */
export function buildBatchSignPageHtml(
    entries: Array<{ id: string; label: string; typedData: object }>,
): string {
    const escaped = JSON.stringify(entries)
        .replace(/\\/g, String.raw`\\`)
        .replace(/`/g, '\\`')
        .replace(/<\/script>/gi, String.raw`<\/script>`);

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
    const ENTRIES = JSON.parse(\`${escaped}\`);
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
</script>
</body>
</html>`;
}
