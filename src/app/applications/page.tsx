import { type Metadata } from 'next';
import Script from 'next/script';

import { ApplicationsListTemplate } from '../../presentation/templates/applications-list.template';
import { experimentsRepository } from '../../infrastructure/repositories/experiments.repository';
import {
    featuresRepository,
    FeatureId,
} from '../../infrastructure/repositories/features.repository';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/applications`,
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
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/applications`,
    },
    title: 'Experiments by Jean-Baptiste Terrazzoni: AI & Fintech Tools',
};

export default function ApplicationsPage() {
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
    const features = [
        featuresRepository.getById(FeatureId.Repository),
        featuresRepository.getById(FeatureId.Capitaine),
        featuresRepository.getById(FeatureId.Source),
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
        })),
        name: 'Experiments by Jean-Baptiste Terrazzoni: AI & Fintech Tools',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/applications`,
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
