import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ExperimentDetailTemplate } from '../../../presentation/templates/experiment-detail.template';
import { experimentsRepository } from '../../../infrastructure/repositories/experiments.repository';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const experiment = experimentsRepository.getBySlug(params.slug);

    if (!experiment) {
        return {
            title: 'Experiment Not Found',
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';
    const imageUrl = experiment.images?.icon ?? '/assets/icons/app-icon.jterrazz.png';

    return {
        alternates: {
            canonical: `${baseUrl}/experiments/${experiment.slug}`,
        },
        description: experiment.longDescription || experiment.description,
        openGraph: {
            description: experiment.longDescription || experiment.description,
            images: [
                {
                    alt: experiment.name,
                    height: 630,
                    url: imageUrl,
                    width: 1200,
                },
            ],
            title: `${experiment.name} | Jean-Baptiste Terrazzoni`,
            url: `${baseUrl}/experiments/${experiment.slug}`,
        },
        title: experiment.name,
        twitter: {
            card: 'summary_large_image',
            description: experiment.longDescription || experiment.description,
            images: [imageUrl],
            title: `${experiment.name} | Jean-Baptiste Terrazzoni`,
        },
    };
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
