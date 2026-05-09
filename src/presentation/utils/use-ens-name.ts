'use client';

import { resolveEnsName } from '@jterrazz/attestation/browser';
import { useEffect, useState } from 'react';

/**
 * Module-level cache, deduplicates ENS lookups across every component on the
 * page (and survives Next.js client navigation). Cleared on full page reload.
 */
const cache = new Map<string, null | string>();
const inFlight = new Map<string, Promise<null | string>>();

/**
 * Reverse-resolve an Ethereum address to its primary ENS name. Pure display
 * concern — never persisted in attestations. Multiple components using the
 * same address share a single network round-trip.
 */
export function useEnsName(address: `0x${string}`): null | string {
    const [name, setName] = useState<null | string>(() => cache.get(address) ?? null);

    useEffect(() => {
        if (cache.has(address)) {
            setName(cache.get(address)!);
            return;
        }

        let cancelled = false;
        const pending =
            inFlight.get(address) ??
            (() => {
                const p = resolveEnsName(address).then((resolved) => {
                    cache.set(address, resolved);
                    inFlight.delete(address);
                    return resolved;
                });
                inFlight.set(address, p);
                return p;
            })();

        pending.then((resolved) => {
            if (!cancelled) {
                setName(resolved);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [address]);

    return name;
}
