'use client';

import { type AuthorshipState, type DateState, verifyFromUrl } from '@jterrazz/attestation/browser';
import { Check, Loader2, Minus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '../../../utils';
import { useEnsName } from '../../../utils/use-ens-name';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../../atoms/accordion/accordion';

export type ProofCardSnapshot = {
    signerAddress: `0x${string}`;
    signedAt: string;
    contentDigest: `0x${string}`;
    schemaVersion: number;
};

const shortenAddress = (a: `0x${string}`) => `${a.slice(0, 6)}…${a.slice(-4)}`;

type Props = {
    /**
     * Absolute URL to the article — `verifyFromUrl` resolves `/proof.json` from there.
     */
    articleUrl: string;
    /**
     * Read from disk at SSR time. Drives the visible labels while verification
     * is in flight; the icon flips to green/red based on the live check.
     */
    snapshot: ProofCardSnapshot;
    /**
     * If non-null at SSR time, the OTS proof has been Bitcoin-anchored already.
     * Browser runtime can't verify Bitcoin so we accept this as informative.
     */
    bitcoinTimestamp?: string;
};

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

export const ProofCard = ({ articleUrl, bitcoinTimestamp, snapshot }: Props) => {
    const [authorship, setAuthorship] = useState<AuthorshipState>({ kind: 'idle' });
    const [date, setDate] = useState<DateState>(
        bitcoinTimestamp
            ? { bitcoinTime: new Date(bitcoinTimestamp), kind: 'verified' }
            : { kind: 'idle' },
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

    // Always resolve ENS for the snapshot address — recovered address must match
    // Anyway, and this lets the label appear without waiting for full verification.
    const ensName = useEnsName(snapshot.signerAddress);
    const signerLabel = ensName ?? shortenAddress(snapshot.signerAddress);

    return (
        <Accordion className="mb-14 w-full" collapsible defaultValue="item-0" type="single">
            <AccordionItem value="item-0">
                <AccordionTrigger>
                    <div className="flex items-center gap-3">
                        <ClaimIcon state={authorship} />
                        <div className="flex flex-col items-start gap-0.5 leading-none">
                            <span>Proof of authorship</span>
                            <ClaimSummary state={authorship} />
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="relative pl-9 text-zinc-600 dark:text-zinc-400">
                    <div className="absolute top-0 bottom-3 left-3 w-px border-l border-dashed border-zinc-300 dark:border-zinc-700" />
                    <p>
                        Signed by{' '}
                        <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {signerLabel}
                        </strong>
                        , on{' '}
                        <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {formatDate(snapshot.signedAt)}
                        </strong>
                        . The signature was recovered from an EIP-712 typed message, so only the
                        owner of this wallet could have produced it.
                    </p>
                    <AuthorshipDetail state={authorship} />
                    <dl className="mt-3 grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-xs">
                        <dt className="font-mono uppercase tracking-widest text-zinc-500">
                            address
                        </dt>
                        <dd className="font-mono text-zinc-700 dark:text-zinc-300 break-all">
                            {snapshot.signerAddress}
                        </dd>
                        <dt className="font-mono uppercase tracking-widest text-zinc-500">
                            schema
                        </dt>
                        <dd className="font-mono text-zinc-700 dark:text-zinc-300">
                            v{snapshot.schemaVersion}
                        </dd>
                    </dl>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <div className="flex items-center gap-3">
                        <ClaimIcon state={date} />
                        <div className="flex flex-col items-start gap-0.5 leading-none">
                            <span>Proof of date</span>
                            <ClaimSummary state={date} />
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="relative pl-9 text-zinc-600 dark:text-zinc-400">
                    <div className="absolute top-0 bottom-3 left-3 w-px border-l border-dashed border-zinc-300 dark:border-zinc-700" />
                    <DateBody state={date} />
                    <dl className="mt-3 grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-xs">
                        <dt className="font-mono uppercase tracking-widest text-zinc-500">
                            digest
                        </dt>
                        <dd className="font-mono text-zinc-700 dark:text-zinc-300 break-all">
                            {snapshot.contentDigest}
                        </dd>
                    </dl>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

const DOT = 'inline-flex items-center justify-center size-5 rounded-full shrink-0';
const INNER = 'size-3';

const ClaimIcon = ({ state }: { state: AuthorshipState | DateState }) => {
    switch (state.kind) {
        case 'idle':
        case 'fetching':
        case 'verifying': {
            return (
                <span className={cn(DOT, 'ring-1 ring-zinc-300 dark:ring-zinc-700')}>
                    <Loader2
                        className={cn(INNER, 'text-zinc-400 dark:text-zinc-600 animate-spin')}
                        strokeWidth={2.5}
                    />
                </span>
            );
        }
        case 'verified': {
            return (
                <span className={cn(DOT, 'bg-zinc-900 dark:bg-zinc-100')}>
                    <Check
                        className={cn(INNER, 'text-white dark:text-zinc-900')}
                        strokeWidth={3.25}
                    />
                </span>
            );
        }
        case 'failed': {
            return (
                <span className={cn(DOT, 'bg-red-500')}>
                    <X className={cn(INNER, 'text-white')} strokeWidth={3.25} />
                </span>
            );
        }
        case 'pending':
        case 'skipped': {
            return (
                <span className={cn(DOT, 'bg-amber-500 dark:bg-amber-400')}>
                    <Minus
                        className={cn(INNER, 'text-white dark:text-zinc-900')}
                        strokeWidth={3.25}
                    />
                </span>
            );
        }
    }
};

const ClaimSummary = ({ state }: { state: AuthorshipState | DateState }) => {
    let label: null | string = null;
    let tone = 'text-zinc-400';
    switch (state.kind) {
        case 'fetching': {
            label = 'Fetching…';
            break;
        }
        case 'verifying': {
            label = 'Verifying…';
            break;
        }
        case 'verified': {
            label = 'Verified';
            tone = 'text-zinc-900 dark:text-zinc-100';
            break;
        }
        case 'failed': {
            label = 'Failed';
            tone = 'text-red-600 dark:text-red-400';
            break;
        }
        case 'pending': {
            label = 'Pending';
            tone = 'text-amber-600 dark:text-amber-400';
            break;
        }
        case 'skipped': {
            tone = 'text-amber-600 dark:text-amber-400';
            if (state.reason === 'no-ots-file') {
                label = 'Not stamped';
            } else if (state.reason === 'opt-out') {
                label = 'Skipped';
            } else {
                label = 'CLI only';
            }
            break;
        }
    }
    if (!label) {
        return null;
    }
    return (
        <span className={`text-2xs font-medium uppercase tracking-widest ${tone}`}>{label}</span>
    );
};

const AuthorshipDetail = ({ state }: { state: AuthorshipState }) => {
    if (state.kind === 'verified') {
        return (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                Verified locally in your browser, recovered signer matches the declared address.
            </p>
        );
    }
    if (state.kind === 'failed') {
        return (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                Verification failed: {state.error}
                {state.details ? ` (${state.details})` : ''}
            </p>
        );
    }
    return null;
};

const DateBody = ({ state }: { state: DateState }) => {
    if (state.kind === 'verified') {
        return (
            <p>
                Anchored in Bitcoin on{' '}
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatDate(state.bitcoinTime.toISOString())}
                </strong>
                . Provably no later than the block was mined, independent of this site, this wallet,
                or any third party.
            </p>
        );
    }
    if (state.kind === 'failed') {
        return (
            <p className="text-red-600 dark:text-red-400">
                OTS verification failed: {state.error}
                {state.details ? ` (${state.details})` : ''}
            </p>
        );
    }
    if (state.kind === 'skipped') {
        if (state.reason === 'no-ots-file') {
            return (
                <p>
                    No OpenTimestamps proof has been generated yet. The author needs to run{' '}
                    <code className="text-xs">attestation sign</code> with stamping enabled to queue
                    a Bitcoin anchor.
                </p>
            );
        }
        return (
            <p>
                Bitcoin anchoring is not verified in browser. Run the CLI below to validate the
                OpenTimestamps proof against a Bitcoin block, this site can&apos;t lie about that
                check.
            </p>
        );
    }
    return (
        <p>
            Awaiting Bitcoin block confirmation. The hash is queued in an OpenTimestamps calendar;
            once a block anchors it, the date becomes provable from Bitcoin&apos;s consensus history
            alone.
        </p>
    );
};
