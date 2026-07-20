import { o as AttestationMessage } from "./eip712-schema.cjs";
//#region src/ots/stamp.d.ts
/**
 * Submit a SHA-256 digest to OpenTimestamps calendars and return the proof bytes.
 *
 * The returned proof initially contains only calendar attestations. Run upgrade()
 * after ~24h to anchor it in a Bitcoin block.
 */
declare function stampDigest(digest: Uint8Array): Promise<Uint8Array>;
/**
 * Try to upgrade a calendar-only proof to a Bitcoin-anchored proof.
 *
 * Returns the (possibly upgraded) proof bytes plus a flag indicating whether
 * the upgrade actually attached a Bitcoin attestation this time.
 */
declare function upgradeProof(otsBytes: Uint8Array): Promise<{
  bytes: Uint8Array;
  upgraded: boolean;
}>;
//#endregion
//#region src/ots/verify.d.ts
type OtsVerifyOk = {
  ok: true;
  bitcoinBlockTime: Date;
};
type OtsVerifyFail = {
  ok: false;
  reason: 'digest-mismatch' | 'invalid-proof' | 'pending-bitcoin';
  details?: string;
};
type OtsVerifyResult = OtsVerifyFail | OtsVerifyOk;
/**
 * Verify an OTS proof attests the given digest, and return the Bitcoin block
 * attestation time if present.
 *
 * Network: this calls a public Bitcoin block-info source via the OTS library
 * to validate the Merkle path. In production-paranoid mode you should run your
 * own Bitcoin node and pass it explicitly (future enhancement).
 */
declare function verifyOts(digest: Uint8Array, otsBytes: Uint8Array): Promise<OtsVerifyResult>;
//#endregion
//#region src/eth/sign-flow.d.ts
type SignFlowOptions = {
  message: AttestationMessage;
  onUrlReady?: (url: string) => Promise<void> | void;
  timeoutMs?: number;
};
type SignFlowResult = {
  signature: `0x${string}`;
  signerAddress: `0x${string}`;
};
/**
 * Spin up a one-shot localhost HTTP server, open the browser, wait for the user
 * to sign with their wallet, return the signature.
 *
 * The local server only accepts loopback requests (127.0.0.1).
 */
declare function signViaBrowser(opts: SignFlowOptions): Promise<SignFlowResult>;
//#endregion
//#region src/eth/sign-batch-flow.d.ts
type BatchSignEntry = {
  /** Unique key — used to correlate signatures back to entries. */
  id: string;
  /** Human-readable label shown in the browser UI. */
  label: string;
  /** EIP-712 message to sign. */
  message: AttestationMessage;
};
type BatchSignFlowOptions = {
  entries: BatchSignEntry[];
  onUrlReady?: (url: string) => Promise<void> | void;
  /** Total session timeout. Default 30 minutes. */
  timeoutMs?: number;
};
type BatchSignature = {
  signature: `0x${string}`;
  signerAddress: `0x${string}`;
};
type BatchSignFlowResult = {
  signatures: Map<string, BatchSignature>;
  /** Entries the user explicitly skipped or that failed (rejected wallet, etc.). */
  skipped: Map<string, string>;
};
declare function signBatchViaBrowser(opts: BatchSignFlowOptions): Promise<BatchSignFlowResult>;
//#endregion
export { type BatchSignEntry, type BatchSignFlowOptions, type BatchSignFlowResult, type BatchSignature, type OtsVerifyFail, type OtsVerifyOk, type OtsVerifyResult, type SignFlowOptions, type SignFlowResult, signBatchViaBrowser, signViaBrowser, stampDigest, upgradeProof, verifyOts };
//# sourceMappingURL=node.d.cts.map