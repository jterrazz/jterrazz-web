import { getTranslations, setRequestLocale } from 'next-intl/server';

// Infrastructure
import { experimentsRepository } from '../../../infrastructure/repositories/experiments.repository';
import {
    FeatureId,
    featuresRepository,
} from '../../../infrastructure/repositories/features.repository';
import { buildMetadata } from '../../../infrastructure/seo/build-metadata';
import {
    buildCollectionPageJsonLd,
    buildSoftwareApplicationJsonLd,
} from '../../../infrastructure/seo/json-ld';

import { SITE_CONFIG } from '../../../config/site';
import { ExperimentsListTemplate } from '../../../presentation/templates/experiments-list.template';
import { JsonLdScript } from '../../../presentation/ui/atoms/json-ld-script/json-ld-script';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'experiments' });
    const path = locale === 'en' ? '/experiments' : `/${locale}/experiments`;

    return buildMetadata({
        alternateLanguages: {
            en: '/experiments',
            fr: '/fr/experiments',
        },
        description: t('seoDescription'),
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
        locale,
        path,
        title: t('title'),
    });
}

export default async function ExperimentsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'experiments' });

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
    ].map((feature) => ({
        ...feature,
        url: feature.url.toString(),
    }));

    const highlightTitle = t('title');
    const highlightDescription = t('highlightDescription');

    const pageUrl = `${SITE_CONFIG.baseUrl}${locale === 'en' ? '/experiments' : `/${locale}/experiments`}`;
    const jsonLd = buildCollectionPageJsonLd({
        description: t('seoDescription'),
        items: experiments.map((experiment) =>
            buildSoftwareApplicationJsonLd({
                description: experiment.description,
                name: experiment.name,
                url: experiment.url,
            }),
        ),
        name: 'The Lab: Projects, Tools & Proofs of Concept',
        url: pageUrl,
    });

    // Translations for client component
    const translations = {
        applications: t('applications'),
        context: {
            hackathon: t('context.hackathon'),
            personal: t('context.personal'),
            professional: t('context.professional'),
            school42: t('context.school42'),
        },
        readMore: t('readMore'),
        status: {
            active: t('status.active'),
            archived: t('status.archived'),
            building: t('status.building'),
            completed: t('status.completed'),
            concept: t('status.concept'),
        },
        systems: t('systems'),
        tooling: t('tooling'),
        viewGitHub: t('viewGitHub'),
        viewProject: t('viewProject'),
    };

    return (
        <>
            <JsonLdScript data={jsonLd} id="experiments-json-ld" />
            <ExperimentsListTemplate
                experiments={experiments}
                features={features}
                highlightDescription={highlightDescription}
                highlightTitle={highlightTitle}
                translations={translations}
            />
        </>
    );
}
