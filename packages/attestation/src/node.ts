// Node-only API surface (no side effects). Pulls in Node-only modules
// (`fs`, `crypto`, `node:http`, the OpenTimestamps lib) so it must NOT be
// Imported from browser bundles. The browser consumer should import from
// `@jterrazz/attestation/browser` instead.

export { stampDigest, upgradeProof } from './ots/stamp.js';
export {
    type OtsVerifyFail,
    type OtsVerifyOk,
    type OtsVerifyResult,
    verifyOts,
} from './ots/verify.js';
export { type SignFlowOptions, type SignFlowResult, signViaBrowser } from './eth/sign-flow.js';
export {
    type BatchSignature,
    type BatchSignEntry,
    type BatchSignFlowOptions,
    type BatchSignFlowResult,
    signBatchViaBrowser,
} from './eth/sign-batch-flow.js';
