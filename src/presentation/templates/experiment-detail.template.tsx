'use client';

import {
    IconBrandApple,
    IconBrandGithubFilled,
    IconBrandGooglePlay,
    IconLock,
} from '@tabler/icons-react';
import Image from 'next/image';
import React from 'react';

// Domain
import {
    type Experiment,
    type ExperimentComponent,
    ExperimentContext,
} from '../../domain/experiment';
import {
    ArrowLink,
    Container,
    DottedGrid,
    Heading,
    Kicker,
    Lead,
    Meta,
    Section,
    Tag,
} from '../ui/design-system';
import { QRCode } from '../ui/atoms/qr-code/qr-code';
import { BadgeExperimentStatus } from '../ui/molecules/badge-experiment-status/badge-experiment-status';
import { CardArticleRow } from '../ui/molecules/card-article/card-article-row';
import { DividerSection } from '../ui/molecules/divider-section/divider-section';
import { cn } from '../utils';

type RelatedArticle = {
    imageUrl: string;
    slug: string;
    tagline: string;
    title: string;
};

type SerializableExperiment = Omit<Experiment, 'components' | 'url'> & {
    articleUrl: null | string;
    components: Array<
        Omit<ExperimentComponent, 'sourceUrl'> & {
            sourceUrl: string;
        }
    >;
    relatedArticles: RelatedArticle[];
    url: string;
};

type ExperimentDetailTranslations = {
    context: {
        hackathon: string;
        personal: string;
        professional: string;
        school42: string;
    };
    detail: {
        about: string;
        appStore: string;
        articles: string;
        availableOn: string;
        components: string;
        downloadOnAppStore: string;
        getItOnGooglePlay: string;
        privacyPolicy: string;
        readArticle: string;
        scanToDownload: string;
        showcase: string;
        sourceCode: string;
        viewProject: string;
        visitWebsite: string;
        year: string;
    };
};

type ExperimentDetailTemplateProps = {
    experiment: SerializableExperiment;
    translations: ExperimentDetailTranslations;
};

function getContextLabel(
    context: ExperimentContext,
    translations: ExperimentDetailTranslations['context'],
): string {
    switch (context) {
        case ExperimentContext.Personal:
            return translations.personal;
        case ExperimentContext.School42:
            return translations.school42;
        case ExperimentContext.Professional:
            return translations.professional;
        case ExperimentContext.Hackathon:
            return translations.hackathon;
        default:
            return context;
    }
}

// Editorial 2-column key/value — fixed mono label column + aligned values.
// Accepts ReactNode so a Tag or other inline element can sit in the value slot.
const MetaItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex items-baseline gap-4">
        <Meta className="w-20 shrink-0 uppercase tracking-widest">{label}</Meta>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
);

const AppStoreBadge: React.FC<{
    bottomText: string;
    href: string;
    icon: React.ReactNode;
    topText: string;
}> = ({ bottomText, href, icon, topText }) => (
    <a
        className="inline-flex items-center justify-center gap-3 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors min-w-[180px]"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
    >
        {icon}
        <div className="text-left">
            <div className="text-[10px] opacity-80 leading-none mb-0.5">{topText}</div>
            <div className="text-sm font-semibold leading-none">{bottomText}</div>
        </div>
    </a>
);

export const ExperimentDetailTemplate: React.FC<ExperimentDetailTemplateProps> = ({
    experiment,
    translations: t,
}) => {
    const isAppWithStoreLinks =
        experiment.storeLinks?.appStore || experiment.storeLinks?.playStore;
    const contextLabel = getContextLabel(experiment.context, t.context);

    const heroActions: { href: string; label: string }[] = [];
    if (experiment.articleUrl) {
        heroActions.push({ href: experiment.articleUrl, label: t.detail.readArticle });
    }
    if (experiment.storeLinks?.web) {
        heroActions.push({ href: experiment.storeLinks.web, label: t.detail.visitWebsite });
    }
    if (experiment.url && !experiment.storeLinks?.web) {
        heroActions.push({ href: experiment.url, label: t.detail.viewProject });
    }
    if (experiment.url?.includes('github') && !experiment.storeLinks?.web) {
        // Source code already covered by viewProject when github
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {isAppWithStoreLinks ? (
                <Container>
                    <Section spacing="hero">
                        <DottedGrid intensity="medium" origin="center" />
                        <div className="flex flex-col items-center text-center">
                            {experiment.iconUrl && (
                                <Image
                                    alt={`${experiment.name} app icon`}
                                    className="rounded-2xl shadow-[0_0_24px_rgba(0,0,0,0.06)] mb-8"
                                    height={96}
                                    src={experiment.iconUrl}
                                    width={96}
                                />
                            )}
                            <Kicker className="mb-6">{contextLabel}</Kicker>
                            <Heading className="mb-6" size="display">
                                {experiment.name}
                            </Heading>
                            <Lead className="mx-auto">{experiment.description}</Lead>

                            <div className="hidden md:flex flex-col items-center mt-10">
                                <div className="p-3 bg-white rounded-xl shadow-[0_0_12px_rgba(0,0,0,0.04)]">
                                    <QRCode
                                        size={140}
                                        url={`https://jterrazz.com/go/${experiment.slug}`}
                                    />
                                </div>
                                <Meta className="mt-3 uppercase tracking-widest">
                                    {t.detail.scanToDownload}
                                </Meta>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                {experiment.storeLinks?.appStore && (
                                    <AppStoreBadge
                                        bottomText="App Store"
                                        href={experiment.storeLinks.appStore}
                                        icon={<IconBrandApple size={24} />}
                                        topText="Download on the"
                                    />
                                )}
                                {experiment.storeLinks?.playStore && (
                                    <AppStoreBadge
                                        bottomText="Google Play"
                                        href={experiment.storeLinks.playStore}
                                        icon={<IconBrandGooglePlay size={24} />}
                                        topText="Get it on"
                                    />
                                )}
                            </div>
                        </div>
                    </Section>
                </Container>
            ) : (
                <Container>
                    <Section spacing="hero">
                        <DottedGrid intensity="medium" origin="top-left" />
                        <Kicker className="mb-6">{contextLabel}</Kicker>
                        <Heading className="mb-6" size="display">
                            {experiment.name}
                        </Heading>
                        <Lead>{experiment.description}</Lead>
                        {heroActions.length > 0 && (
                            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                                {heroActions.map((action) => (
                                    <ArrowLink
                                        href={action.href}
                                        key={action.href}
                                        tone="subtle"
                                        variant="mono"
                                    >
                                        {action.label}
                                    </ArrowLink>
                                ))}
                            </div>
                        )}
                    </Section>
                </Container>
            )}

            <Container>
                <div className="space-y-12 pb-12 md:pb-16">
                    {experiment.images?.screenshots &&
                        experiment.images.screenshots.length > 0 && (
                            <section>
                                <DividerSection className="mb-4" title={t.detail.showcase} />
                                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden -mx-4 px-4">
                                    {experiment.images.screenshots.map((screenshot) => (
                                        <div
                                            className="snap-center shrink-0 relative rounded-2xl overflow-hidden shadow-[0_0_12px_rgba(0,0,0,0.05)] w-[260px] md:w-[300px] aspect-[9/19]"
                                            key={screenshot}
                                        >
                                            <Image
                                                alt={`${experiment.name} screenshot`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                fill
                                                sizes="(max-width: 768px) 260px, 300px"
                                                src={screenshot}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    <section>
                        <DividerSection className="mb-6" title={t.detail.about} />
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                            <div className="md:col-span-4 flex flex-col gap-3">
                                <MetaItem label={t.detail.year} value={experiment.year} />
                                <MetaItem label="Context" value={contextLabel} />
                                <MetaItem
                                    label="Status"
                                    value={<BadgeExperimentStatus status={experiment.status} />}
                                />
                                {experiment.hasPrivacyPolicy && (
                                    <ArrowLink
                                        className="mt-4"
                                        href={`/experiments/${experiment.slug}/privacy`}
                                        tone="subtle"
                                        variant="mono"
                                    >
                                        {t.detail.privacyPolicy}
                                    </ArrowLink>
                                )}
                            </div>
                            <div className="md:col-span-8">
                                <Lead className="whitespace-pre-line" size="lg">
                                    {experiment.longDescription || experiment.description}
                                </Lead>
                            </div>
                        </div>
                    </section>

                    {experiment.relatedArticles && experiment.relatedArticles.length > 0 && (
                        <section>
                            <DividerSection className="mb-4" title={t.detail.articles} />
                            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                                {experiment.relatedArticles.map((article) => (
                                    <CardArticleRow
                                        imageUrl={article.imageUrl}
                                        key={article.slug}
                                        slug={article.slug}
                                        tagline={article.tagline}
                                        title={article.title}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {experiment.components && experiment.components.length > 0 && (
                        <section>
                            <DividerSection className="mb-4" title={t.detail.components} />
                            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                                {experiment.components.map((component) => (
                                    <ExperimentComponentCard
                                        component={component}
                                        key={component.name}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </Container>
        </div>
    );
};

type SerializableExperimentComponent = Omit<ExperimentComponent, 'sourceUrl'> & {
    sourceUrl: string;
};

const ExperimentComponentCard: React.FC<{
    component: SerializableExperimentComponent;
}> = ({ component }) => (
    <a
        className={cn('group flex items-center gap-4 py-3')}
        href={component.sourceUrl}
        rel="noreferrer"
        target="_blank"
    >
        <div className="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-1">
            <div className="flex items-center gap-2 mb-0.5">
                <Heading
                    as="h4"
                    className="transition-colors group-hover:text-zinc-500 dark:group-hover:text-zinc-400"
                    size="title"
                >
                    {component.name}
                </Heading>
            </div>
            <Lead className="line-clamp-1" size="sm">
                {component.description}
            </Lead>
        </div>
        <BadgeExperimentStatus className="shrink-0" status={component.status} />
        {component.isPrivate && (
            <Tag className="shrink-0">
                <IconLock className="shrink-0" size={10} />
                Private
            </Tag>
        )}
        {!component.isPrivate && (
            <IconBrandGithubFilled
                className="shrink-0 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors"
                size={18}
            />
        )}
    </a>
);
