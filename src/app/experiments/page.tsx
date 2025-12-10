// Infrastructure
import { experimentsRepository } from '../../infrastructure/repositories/experiments.repository';
import {
    FeatureId,
    featuresRepository,
} from '../../infrastructure/repositories/features.repository';
import { buildMetadata } from '../../infrastructure/seo/build-metadata';
import {
    buildCollectionPageJsonLd,
    buildSoftwareApplicationJsonLd,
} from '../../infrastructure/seo/json-ld';

// Presentation
import { ExperimentsListTemplate } from '../../presentation/templates/experiments-list.template';
import { JsonLdScript } from '../../presentation/ui/atoms/json-ld-script/json-ld-script';

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

    const jsonLd = buildCollectionPageJsonLd({
        description: PAGE_DESCRIPTION,
        items: experiments.map((experiment) =>
            buildSoftwareApplicationJsonLd({
                description: experiment.description,
                name: experiment.name,
                url: experiment.url,
            }),
        ),
        name: 'The Lab: Projects, Tools & Proofs of Concept',
        url: metadata.openGraph?.url as string,
    });

    return (
        <>
            <JsonLdScript data={jsonLd} id="experiments-json-ld" />
            <ExperimentsListTemplate
                experiments={experiments}
                features={features}
                highlightDescription={highlightDescription}
                highlightTitle={highlightTitle}
            />
        </>
    );
}
