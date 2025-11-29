import { type Metadata } from 'next';
import Script from 'next/script';

// Application
import { ApplicationsListTemplate } from '../../components/templates/applications-list.template';

// Domain
import { type Experiment } from '../../domain/experiment';

// Infrastructure
import { FeaturedId } from '../../infrastructure/repositories/data/features.data';
import { FeatureInMemoryRepository } from '../../infrastructure/repositories/feature-in-memory.repository';
import { ExperimentInMemoryRepository } from '../../infrastructure/repositories/experiment-in-memory.repository';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/experiments`,
    },
    description:
        'Discover experiments and tools by Jean-Baptiste Terrazzoni—AI Agent Developer and Fintech Engineer. Explore AI-powered personal growth platforms and fintech solutions designed to help you grow.',
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
    openGraph: {
        description:
            'Discover experiments and tools by Jean-Baptiste Terrazzoni—AI Agent Developer and Fintech Engineer.',
        title: 'Experiments by Jean-Baptiste Terrazzoni: AI & Fintech Tools',
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/experiments`,
    },
    title: 'Experiments by Jean-Baptiste Terrazzoni: AI & Fintech Tools',
};

export default async function ExperimentsPage() {
    const experimentRepository = new ExperimentInMemoryRepository();
    const featureRepository = new FeatureInMemoryRepository();

    const experimentsDomain: Experiment[] = experimentRepository.getExperiments();

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
    const features = [
        featureRepository.getFeatureById(FeaturedId.Repository),
        featureRepository.getFeatureById(FeaturedId.Capitaine),
        featureRepository.getFeatureById(FeaturedId.Source),
    ];

    const highlightTitle = 'Experiments';
    const highlightDescription =
        "The code behind the concepts. A collection of tools and experiments I've built to solve real problems.";

    // Structured data for better SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description:
            'Discover experiments and tools by Jean-Baptiste Terrazzoni—AI Agent Developer and Fintech Engineer. Explore AI-powered personal growth platforms and fintech solutions designed to help you grow.',
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
            ...(experiment.components.length > 0 && {
                softwareVersion: experiment.components
                    .flatMap((component) => component.technologies)
                    .join(', '),
            }),
        })),
        name: 'Experiments by Jean-Baptiste Terrazzoni: AI & Fintech Tools',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/experiments`,
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
            <ApplicationsListTemplate
                experiments={experiments}
                features={features}
                highlightDescription={highlightDescription}
                highlightTitle={highlightTitle}
            />
        </>
    );
}
