import { notFound } from 'next/navigation';

import { ExperimentDetailTemplate } from '../../../components/templates/experiment-detail.template';
import { ExperimentInMemoryRepository } from '../../../infrastructure/repositories/experiment-in-memory.repository';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateStaticParams() {
    const repository = new ExperimentInMemoryRepository();
    const experiments = repository.getExperiments();

    return experiments.map((experiment) => ({
        slug: experiment.slug,
    }));
}

export default async function ExperimentDetailPage(props: Props) {
    const params = await props.params;
    const repository = new ExperimentInMemoryRepository();
    const experiment = repository.getExperimentBySlug(params.slug);

    if (!experiment) {
        notFound();
    }

    return <ExperimentDetailTemplate experiment={experiment} />;
}
