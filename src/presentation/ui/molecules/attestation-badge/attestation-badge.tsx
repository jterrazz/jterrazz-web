'use client';

import { type AuthorshipState, type DateState, verifyFromUrl } from '@jterrazz/attestation/browser';
import { Check, Loader2, Minus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Link } from '../../../../infrastructure/navigation/navigation';
import { cn } from '../../../utils';
import { useEnsName } from '../../../utils/use-ens-name';

export type AttestationBadgeProps = {
    className?: string;
    /** Hex address of the signer. */
    signerAddress: `0x${string}`;
    /** Date the attestation was signed (from the article's publishedAt claim). */
    attestedAt: Date;
    /** Bitcoin block timestamp if the OTS proof has been upgraded server-side. */
    bitcoinTimestamp?: Date;
    /**
     * Path to the article (e.g. `/articles/14-your-moat-is-melting`).
     * The badge derives `${articleUrl}/proof.json` for live verification and
     * `${articleUrl}/verify` for the link target.
     */
    articleUrl: string;
};

const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const shortenAddress = (a: `0x${string}`) => `${a.slice(0, 6)}…${a.slice(-4)}`;

// Inline-flex centers the inner glyph perfectly. `align-middle` puts the dot
// At the optical mid-line of the text (zinc-600 13px medium).
const DOT_BASE =
    'inline-flex items-center justify-center size-[14px] rounded-full mx-1.5 align-middle shrink-0 -translate-y-[1px]';
const INNER_ICON = 'size-[10px] shrink-0';

/**
 * Reduce the per-claim states down to a single overall verdict.
 *  - any `failed`       → failed (worst case wins)
 *  - any in-flight      → still verifying
 *  - any pending/skipped → pending (orange dot)
 *  - both `verified`    → verified (black check)
 */
const combineStates = (a: AuthorshipState, b: DateState): AuthorshipState | DateState => {
    if (a.kind === 'failed') {
        return a;
    }
    if (b.kind === 'failed') {
        return b;
    }
    if (
        a.kind === 'idle' ||
        a.kind === 'fetching' ||
        a.kind === 'verifying' ||
        b.kind === 'idle' ||
        b.kind === 'fetching' ||
        b.kind === 'verifying'
    ) {
        return { kind: 'fetching' };
    }
    if (b.kind === 'pending' || b.kind === 'skipped') {
        return b;
    }
    return a; // Both verified
};

const Mark = ({ state }: { state: AuthorshipState | DateState }) => {
    switch (state.kind) {
        case 'fetching':
        case 'idle':
        case 'verifying': {
            return (
                <span
                    aria-hidden
                    className={cn(
                        DOT_BASE,
                        'bg-transparent ring-1 ring-zinc-300 dark:ring-zinc-700',
                    )}
                >
                    <Loader2
                        className={cn(INNER_ICON, 'text-zinc-400 dark:text-zinc-600 animate-spin')}
                        strokeWidth={2.5}
                    />
                </span>
            );
        }
        case 'verified': {
            return (
                <span aria-hidden className={cn(DOT_BASE, 'bg-zinc-900 dark:bg-zinc-100')}>
                    <Check
                        className={cn(INNER_ICON, 'text-white dark:text-zinc-900')}
                        strokeWidth={3.25}
                    />
                </span>
            );
        }
        case 'failed': {
            return (
                <span aria-hidden className={cn(DOT_BASE, 'bg-red-500')}>
                    <X className={cn(INNER_ICON, 'text-white')} strokeWidth={3.25} />
                </span>
            );
        }
        case 'pending':
        case 'skipped': {
            return (
                <span aria-hidden className={cn(DOT_BASE, 'bg-amber-500 dark:bg-amber-400')}>
                    <Minus
                        className={cn(INNER_ICON, 'text-white dark:text-zinc-900')}
                        strokeWidth={3.25}
                    />
                </span>
            );
        }
    }
};

export const AttestationBadge: React.FC<AttestationBadgeProps> = ({
    articleUrl,
    attestedAt,
    bitcoinTimestamp,
    className,
    signerAddress,
}) => {
    const ensName = useEnsName(signerAddress);
    const signer = ensName ?? shortenAddress(signerAddress);
    const verifyHref = `${articleUrl}/verify`;
    const status = bitcoinTimestamp ? 'Anchored to Bitcoin' : 'Calendar-only (Bitcoin pending)';

    const [authorship, setAuthorship] = useState<AuthorshipState>({ kind: 'idle' });
    const [date, setDate] = useState<DateState>(
        bitcoinTimestamp ? { bitcoinTime: bitcoinTimestamp, kind: 'verified' } : { kind: 'idle' },
    );

    useEffect(() => {
        let cancelled = false;
        setAuthorship({ kind: 'fetching' });
        if (!bitcoinTimestamp) {
            setDate({ kind: 'fetching' });
        }

        verifyFromUrl(articleUrl).then((report) => {
            if (cancelled) {
                return;
            }
            setAuthorship(report.authorship);
            if (!bitcoinTimestamp) {
                setDate(report.date);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [articleUrl, bitcoinTimestamp]);

    return (
        <Link
            aria-label={`Verify attestation by ${signer}, signed ${formatDate(attestedAt)}`}
            className={cn('inline-block hover:opacity-80 transition-opacity', className)}
            href={verifyHref}
            title={status}
        >
            <span className="text-[13px] font-medium leading-snug text-zinc-600 dark:text-zinc-400">
                Signed by{' '}
                <span className={cn(!ensName && 'font-mono', 'text-zinc-700 dark:text-zinc-300')}>
                    {signer}
                </span>
                {' on '}
                {formatDate(attestedAt)}
                <Mark state={combineStates(authorship, date)} />
            </span>
        </Link>
    );
};
