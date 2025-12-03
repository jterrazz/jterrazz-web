import { type Metadata } from 'next';
import Script from 'next/script';

import { ApplicationsListTemplate } from '../../components/templates/applications-list.template';
import { data, FeatureId } from '../../data';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/experiments`,
    },
    description:
        'The code behind the concepts. A collection of tools, apps, and open-source libraries built to solve problems and test new ideas.',
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
            'The code behind the concepts. A collection of tools, apps, and open-source libraries built to solve problems and test new ideas.',
        title: 'The Lab: Projects, Tools & Proofs of Concept',
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/experiments`,
    },
    title: 'The Lab: Projects, Tools & Proofs of Concept',
};

export default function ExperimentsPage() {
    const experimentsDomain = data.experiments.getAll();

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
        data.features.getById(FeatureId.Repository),
        data.features.getById(FeatureId.Capitaine),
        data.features.getById(FeatureId.Source),
    ];

    const highlightTitle = 'Experiments';
    const highlightDescription =
        "The code behind the concepts. A collection of tools and experiments I've built to solve real problems.";

    // Structured data for better SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description:
            'The code behind the concepts. A collection of tools, apps, and open-source libraries built to solve problems and test new ideas.',
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
