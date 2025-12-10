import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { locales } from '../../../../i18n/config';
import { experimentsRepository } from '../../../../infrastructure/repositories/experiments.repository';
import { buildMetadata } from '../../../../infrastructure/seo/build-metadata';

import { ExperimentDetailTemplate } from '../../../../presentation/templates/experiment-detail.template';

type Props = {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { locale, slug } = params;

    const experiment = experimentsRepository.getBySlug(slug);

    if (!experiment) {
        return { title: 'Experiment Not Found' };
    }

    const description = experiment.longDescription || experiment.description;
    const imageUrl = experiment.images?.thumbnail;
    const path = locale === 'en' ? `/experiments/${slug}` : `/${locale}/experiments/${slug}`;

    return buildMetadata({
        alternateLanguages: {
            en: `/experiments/${slug}`,
            fr: `/fr/experiments/${slug}`,
        },
        description,
        image: imageUrl ? { alt: experiment.name, path: imageUrl } : undefined,
        locale,
        path,
        title: experiment.name,
    });
}

export function generateStaticParams() {
    const experiments = experimentsRepository.getAll();

    return experiments.flatMap((experiment) =>
        locales.map((locale) => ({
            locale,
            slug: experiment.slug,
        })),
    );
}

export default async function ExperimentDetailPage(props: Props) {
    const params = await props.params;
    const { locale, slug } = params;
    setRequestLocale(locale);

    const experiment = experimentsRepository.getBySlug(slug);

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

