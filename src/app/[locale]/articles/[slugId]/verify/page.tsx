import { IconChevronRight, IconFile, IconFolderFilled } from '@tabler/icons-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { type ArticleLanguage } from '../../../../../domain/article';
import { buildArticleSlug } from '../../../../../domain/utils/slugify';
import { type Locale, locales } from '../../../../../i18n/config';
import { Link } from '../../../../../infrastructure/navigation/navigation';
import { articlesRepository } from '../../../../../infrastructure/repositories/articles.repository';
import { ProofCard } from '../../../../../presentation/ui/molecules/proof-card/proof-card';
import { Container } from '../../../../../presentation/ui/organisms/container/container';

type VerifyPageProps = {
    params: Promise<{ locale: string; slugId: string }>;
};

export default async function VerifyArticlePage(props: VerifyPageProps) {
    const { locale, slugId } = await props.params;
    setRequestLocale(locale);

    const id = slugId.split('-')[0];
    const article = articlesRepository.getByIndex(id, locale as ArticleLanguage);
    if (!article) {
        return notFound();
    }

    const attestation = article.attestation;
    if (!attestation) {
        return (
            <Container className="py-12 max-w-3xl">
                <h1 className="text-2xl font-bold mb-4">No attestation available</h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                    This article hasn&apos;t been cryptographically signed (yet).
                </p>
                <p className="mt-4">
                    <Link className="text-emerald-600 hover:underline" href={`/articles/${slugId}`}>
                        ← Back to article
                    </Link>
                </p>
            </Container>
        );
    }

    const articleAbsoluteUrl = `https://jterrazz.com/articles/${slugId}`;
    const cliCommand = `npx @jterrazz/attestation verify ${articleAbsoluteUrl}`;
    const articleTitle = article.metadata.title.en;

    return (
        <Container className="py-12 max-w-3xl">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                <Link
                    className="hover:text-zinc-900 dark:hover:text-zinc-100"
                    href={`/articles/${slugId}`}
                >
                    ← {articleTitle}
                </Link>
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">Verify this article</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-12">
                Cryptographically signed proof of authorship and date. The signature is on the
                English source, translations are derived and shown for convenience.
            </p>

            <ProofCard
                articleUrl={`/articles/${slugId}`}
                bitcoinTimestamp={attestation.bitcoinTimestamp}
                snapshot={{
                    contentDigest: attestation.contentDigest,
                    schemaVersion: attestation.schemaVersion,
                    signedAt: attestation.attestedAt,
                    signerAddress: attestation.signerAddress,
                }}
            />

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-3">Verify it yourself</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    Run this in your terminal, no trust in this site required:
                </p>
                <pre className="bg-zinc-900 text-zinc-100 dark:bg-zinc-950 rounded-md p-4 overflow-x-auto text-sm">
                    <code>{cliCommand}</code>
                </pre>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                    The CLI fetches the markdown bytes, recomputes the SHA-256 digest, recovers the
                    signer from the EIP-712 signature, and validates the OpenTimestamps proof
                    against Bitcoin.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-3">How it works</h2>
                <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
                    <p>
                        <strong>Signature.</strong> The article&apos;s canonicalized bytes are
                        hashed with SHA-256, and the hash is signed by an Ethereum wallet using
                        EIP-712 typed data. The signer&apos;s address is recoverable from the
                        signature; tampering with one byte invalidates it.
                    </p>
                    <p>
                        <strong>Timestamp.</strong> The same hash is anchored into a Bitcoin block
                        via OpenTimestamps. Once a block is mined, the timestamp becomes part of
                        Bitcoin&apos;s consensus history, provably no later than the block&apos;s
                        mining time.
                    </p>
                    <p>
                        <strong>Trust-free verification.</strong> Anyone can verify both properties
                        independently with the CLI above (or by reading the raw files at{' '}
                        <code className="text-xs">/articles/{slugId}/proof.json</code>). The proof
                        doesn&apos;t depend on this site staying online.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-3">Raw artifacts</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                    Four files at{' '}
                    <code className="text-xs bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">
                        /articles/{slugId}/
                    </code>{' '}
                    are the entire proof.
                </p>
                <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-3">
                    <FileTree slugId={slugId} />
                </div>
            </section>
        </Container>
    );
}

export function generateMetadata(): Metadata {
    return {
        description: 'Cryptographic proof of authorship and date for this article.',
        // Utility page: thin, near-duplicate content across articles — keep out
        // Of the index so crawl budget goes to the articles themselves.
        robots: { follow: true, index: false },
        title: 'Verify · jterrazz.com',
    };
}

// The page itself is fully derivable from the article repository, so pre-render
// At build time. The live verification is a Client Component (`<ProofCard>`)
// That hydrates on the visitor's machine and updates the status pills.
export const dynamic = 'force-static';
export const dynamicParams = true;

export function generateStaticParams() {
    const articles = articlesRepository.getAll().filter((a) => a.attestation !== undefined);
    return articles.flatMap((article) =>
        locales.map((locale: Locale) => ({
            locale,
            slugId: buildArticleSlug(article.publicIndex, article.metadata.title.en),
        })),
    );
}

const ARTIFACTS = [
    { description: 'manifest', name: 'proof.json' },
    { description: 'signed bytes', name: 'en.md' },
    { description: 'EIP-712 signature', name: 'en.attestation.json' },
    { description: 'Bitcoin timestamp proof', name: 'en.ots' },
] as const;

const FileTree = ({ slugId }: { slugId: string }) => (
    <details className="group/root" open>
        <summary className="flex items-center gap-2 cursor-pointer py-1 list-none [&::-webkit-details-marker]:hidden font-mono text-sm">
            <IconChevronRight
                className="text-zinc-400 shrink-0 transition-transform group-open/root:rotate-90"
                size={14}
            />
            <IconFolderFilled className="text-amber-500 shrink-0" size={14} />
            <span className="text-zinc-700 dark:text-zinc-300">{slugId}/</span>
        </summary>
        <ul className="ml-5 mt-0.5 border-l border-zinc-200 dark:border-zinc-800">
            {ARTIFACTS.map((artifact) => (
                <li key={artifact.name}>
                    <Link
                        className="flex items-center gap-2 py-1 px-3 -ml-px font-mono text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                        href={`/articles/${slugId}/${artifact.name}`}
                    >
                        <IconFile className="text-zinc-400 shrink-0" size={14} />
                        <span>{artifact.name}</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-xs ml-auto font-sans">
                            {artifact.description}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    </details>
);
