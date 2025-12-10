import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Infrastructure
import { experimentsRepository } from '../../../infrastructure/repositories/experiments.repository';
import { buildMetadata } from '../../../infrastructure/seo/build-metadata';

import { ExperimentDetailTemplate } from '../../../presentation/templates/experiment-detail.template';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const experiment = experimentsRepository.getBySlug(params.slug);

    if (!experiment) {
        return { title: 'Experiment Not Found' };
    }

    const description = experiment.longDescription || experiment.description;
    const imageUrl = experiment.images?.thumbnail;

    return buildMetadata({
        description,
        image: imageUrl ? { alt: experiment.name, path: imageUrl } : undefined,
        path: `/experiments/${experiment.slug}`,
        title: experiment.name,
    });
}

export function generateStaticParams() {
    const experiments = experimentsRepository.getAll();

    return experiments.map((experiment) => ({
        slug: experiment.slug,
    }));
}

export default async function ExperimentDetailPage(props: Props) {
    const params = await props.params;
    const experiment = experimentsRepository.getBySlug(params.slug);

    if (!experiment) {
        notFound();
    }

    // Convert URL instances to strings for client components
    const serializedExperiment = {
        ...experiment,
        articleUrl: experiment.articleUrl ?? null,
        components: experiment.components.map((component) => ({
            ...component,
            sourceUrl: component.sourceUrl.toString(),
        })),
        url: experiment.url ? experiment.url.toString() : '',
    };

    return <ExperimentDetailTemplate experiment={serializedExperiment} />;
}
