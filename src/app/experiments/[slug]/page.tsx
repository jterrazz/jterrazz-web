import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ExperimentDetailTemplate } from '../../../components/templates/experiment-detail.template';
import { experimentsDataAccess } from '../../../data/experiments.data';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const experiment = experimentsDataAccess.getBySlug(params.slug);

    if (!experiment) {
        return {
            title: 'Experiment Not Found ~ Jterrazz',
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';
    const imageUrl = experiment.images?.icon ?? '/assets/icons/app-icon.jterrazz.png';

    return {
        alternates: {
            canonical: `${baseUrl}/experiments/${experiment.slug}`,
        },
        description: experiment.description,
        openGraph: {
            description: experiment.description,
            images: [
                {
                    alt: experiment.name,
                    height: 630,
                    url: imageUrl,
                    width: 1200,
                },
            ],
            title: `${experiment.name} - Experiment by Jterrazz`,
            url: `${baseUrl}/experiments/${experiment.slug}`,
        },
        title: `${experiment.name} - Experiment ~ Jterrazz`,
        twitter: {
            card: 'summary_large_image',
            description: experiment.description,
            images: [imageUrl],
            title: `${experiment.name} - Experiment by Jterrazz`,
        },
    };
}

export function generateStaticParams() {
    const experiments = experimentsDataAccess.getAll();

    return experiments.map((experiment) => ({
        slug: experiment.slug,
    }));
}

export default async function ExperimentDetailPage(props: Props) {
    const params = await props.params;
    const experiment = experimentsDataAccess.getBySlug(params.slug);

    if (!experiment) {
        notFound();
    }

    return <ExperimentDetailTemplate experiment={experiment} />;
}
