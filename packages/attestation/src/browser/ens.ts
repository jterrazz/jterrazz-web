import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Default viem transport (cloudflare-eth.com) intermittently fails ENS reverse
// Lookups (returns null even when a primary name is set). publicnode.com is a
// CORS-friendly community RPC that resolves correctly.
const client = createPublicClient({
    chain: mainnet,
    transport: http('https://ethereum-rpc.publicnode.com'),
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
export async function resolveEnsName(address: `0x${string}`): Promise<null | string> {
    try {
        return await client.getEnsName({ address });
    } catch {
        return null;
    }
}
