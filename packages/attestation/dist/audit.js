//#region src/core/audit.ts
/**
* Suspicious-character audit — runs at SIGN time, never at verify time.
*
* Verify must always remain a function of canonicalize() alone, never adding
* stricter rules. Audit is a separate, mutable layer of advice for the author:
* "you probably don't want these invisible chars in a published article".
*/
const SUSPICIOUS = /* @__PURE__ */ new Map([
	[8203, "zero-width space"],
	[8204, "zero-width non-joiner"],
	[8205, "zero-width joiner"],
	[8288, "word joiner"],
	[65279, "zero-width no-break space (interior BOM)"],
	[8234, "left-to-right embedding"],
	[8235, "right-to-left embedding"],
	[8236, "pop directional formatting"],
	[8237, "left-to-right override"],
	[8238, "right-to-left override"],
	[8294, "left-to-right isolate"],
	[8295, "right-to-left isolate"],
	[8296, "first strong isolate"],
	[8297, "pop directional isolate"]
]);
function audit(canonical) {
	const text = new TextDecoder("utf-8", { fatal: true }).decode(canonical);
	const findings = [];
	let line = 1;
	let column = 1;
	for (const ch of text) {
		const cp = ch.codePointAt(0);
		if (cp === void 0) continue;
		if (cp === 10) {
			line++;
			column = 1;
			continue;
		}
		const name = SUSPICIOUS.get(cp);
		if (name !== void 0) findings.push({
			codepoint: cp,
			column,
			line,
			name
		});
		column++;
	}
	return findings;
}
//#endregion
export { audit as t };

//# sourceMappingURL=audit.js.map