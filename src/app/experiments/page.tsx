import Script from 'next/script';

// Infrastructure
import { experimentsRepository } from '../../infrastructure/repositories/experiments.repository';
import {
    FeatureId,
    featuresRepository,
} from '../../infrastructure/repositories/features.repository';
import { buildMetadata } from '../../infrastructure/seo/build-metadata';

// Presentation
import { ExperimentsListTemplate } from '../../presentation/templates/experiments-list.template';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

const PAGE_DESCRIPTION =
    'Open-source projects, apps, and developer tools. AI agents, fintech solutions, TypeScript packages, and system-level experiments.';

export const metadata = buildMetadata({
    description: PAGE_DESCRIPTION,
    keywords: [
        'AI experiments',
        'fintech tools',
        'personal growth',
        'habit formation',
        'intelligent systems',
        'Jean-Baptiste Terrazzoni',
        'AI Agent Developer',
        'Fintech Engineer',
    ],
    path: '/experiments',
    title: 'Experiments',
});

export default function ExperimentsPage() {
    const experimentsDomain = experimentsRepository.getAll();

    // Convert URL and Date instances to plain serialisable values for client components
    const experiments = experimentsDomain.map((experiment) => ({
        ...experiment,
        articleUrl: experiment.articleUrl ?? null,
        components: experiment.components.map((component) => ({
            ...component,
            sourceUrl: component.sourceUrl.toString(),
        })),
        url: experiment.url ? experiment.url.toString() : '',
    }));
    // Convert URL instances to strings for client components
    const features = [
        featuresRepository.getById(FeatureId.Repository),
        featuresRepository.getById(FeatureId.Capitaine),
        featuresRepository.getById(FeatureId.Source),
    ].map((feature) => ({
        ...feature,
        url: feature.url.toString(),
    }));

    const highlightTitle = 'Experiments';
    const highlightDescription =
        "The code behind the concepts. A collection of tools and experiments I've built to solve real problems.";

    // Structured data for better SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description: PAGE_DESCRIPTION,
        hasPart: experiments.map((experiment) => ({
            '@type': 'SoftwareApplication',
            applicationCategory: 'ProductivityApplication',
            author: {
                '@type': 'Person',
                name: 'Jean-Baptiste Terrazzoni',
                url: 'https://jterrazz.com',
            },
            description: experiment.description,
            name: experiment.name,
            url: experiment.url.toString(),
        })),
        name: 'The Lab: Projects, Tools & Proofs of Concept',
        url: metadata.openGraph?.url,
    };

    return (
        <>
            <Script
                id="applications-json-ld"
                strategy="beforeInteractive"
                type="application/ld+json"
            >
                {JSON.stringify(jsonLd)}
            </Script>
            <ExperimentsListTemplate
                experiments={experiments}
                features={features}
                highlightDescription={highlightDescription}
                highlightTitle={highlightTitle}
            />
        </>
    );
}
