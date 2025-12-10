import { getTranslations, setRequestLocale } from 'next-intl/server';

import { SITE_CONFIG } from '../../../config/site';
import { photographsRepository } from '../../../infrastructure/repositories/photographs.repository';
import { buildMetadata } from '../../../infrastructure/seo/build-metadata';
import {
    buildCollectionPageJsonLd,
    buildImageObjectJsonLd,
} from '../../../infrastructure/seo/json-ld';

import { PhotographsGridTemplate } from '../../../presentation/templates/photographs-grid.template';
import { JsonLdScript } from '../../../presentation/ui/atoms/json-ld-script/json-ld-script';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'photographs' });
    const path = locale === 'en' ? '/photographs' : `/${locale}/photographs`;

    return buildMetadata({
        alternateLanguages: {
            en: '/photographs',
            fr: '/fr/photographs',
        },
        description: t('seoDescription'),
        keywords: [
            'Photography',
            'Travel Photography',
            'Jean-Baptiste Terrazzoni',
            'Portfolio',
            'Visual Art',
        ],
        locale,
        path,
        title: t('title'),
    });
}

export default async function PhotographsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'photographs' });

    const photographs = photographsRepository.getAll();

    const highlightTitle = t('title');
    const highlightDescription = t('highlightDescription');

    const pageUrl = `${SITE_CONFIG.baseUrl}${locale === 'en' ? '/photographs' : `/${locale}/photographs`}`;
    const jsonLd = buildCollectionPageJsonLd({
        description: t('seoDescription'),
        items: photographs.map((photo) =>
            buildImageObjectJsonLd({
                contentUrl: photo.contentUrl,
                description: photo.metadata.description,
            }),
        ),
        name: 'Through My Lens: A Visual Journal',
        url: pageUrl,
    });

    // Translations for client component
    const translations = {
        viewPexels: t('viewPexels'),
    };

    return (
        <>
            <JsonLdScript data={jsonLd} id="photographs-json-ld" />
            <PhotographsGridTemplate
                highlightDescription={highlightDescription}
                highlightTitle={highlightTitle}
                photographs={photographs}
                translations={translations}
            />
        </>
    );
}
