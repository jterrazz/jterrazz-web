import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound, permanentRedirect } from 'next/navigation';

import { SITE_CONFIG } from '../../../../config/site';
import { type ArticleLanguage } from '../../../../domain/article';
import { calculateReadingTimeMinutes } from '../../../../domain/utils/article-content';
import { buildArticleSlug } from '../../../../domain/utils/slugify';
import { type Locale, locales } from '../../../../i18n/config';
import { articlesRepository } from '../../../../infrastructure/repositories/articles.repository';
import { contentLinksRepository } from '../../../../infrastructure/repositories/content-links.repository';
import { experimentsRepository } from '../../../../infrastructure/repositories/experiments.repository';
import {
    FeatureId,
    featuresRepository,
} from '../../../../infrastructure/repositories/features.repository';
import { buildMetadata } from '../../../../infrastructure/seo/build-metadata';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '../../../../infrastructure/seo/json-ld';
import { is42RelatedArticle } from '../../../../infrastructure/seo/seo-utils';
import { ArticleTemplate } from '../../../../presentation/templates/article.template';
import { JsonLdScript } from '../../../../presentation/ui/atoms/json-ld-script/json-ld-script';

export const dynamicParams = true;

type ArticlePageProps = {
    params: Promise<{ locale: string; slugId: string }>;
};

export default async function ArticlePage(props: ArticlePageProps) {
    const params = await props.params;
    const { locale, slugId } = params;
    setRequestLocale(locale);

    const id = slugId.split('-')[0];
    const article = articlesRepository.getByIndex(id);

    if (!article) {
        return notFound();
    }

    // Compute canonical slug and redirect if needed. Permanent (308) so search
    // Engines transfer indexing to the canonical URL after a title change.
    const canonicalSlug = buildArticleSlug(article.publicIndex, article.metadata.title.en);
    if (slugId !== canonicalSlug) {
        const redirectPath =
            locale === 'en' ? `/articles/${canonicalSlug}` : `/${locale}/articles/${canonicalSlug}`;
        return permanentRedirect(redirectPath);
    }

    const articles = articlesRepository.getAll();
    const features = [featuresRepository.getById(FeatureId.Source)];

    // Get linked experiment if any
    const experimentSlug = contentLinksRepository.getExperimentSlugForArticle(article.publicIndex);
    const linkedExperiment = experimentSlug
        ? experimentsRepository.getBySlug(experimentSlug)
        : null;

    // Get content in current locale, fallback to English
    const content = article.content[locale as ArticleLanguage] ?? article.content.en ?? '';
    const title = article.metadata.title[locale as Locale] ?? article.metadata.title.en;
    const description =
        article.metadata.description[locale as Locale] ?? article.metadata.description.en;

    // Structured data — rendered server-side so crawlers see it without JavaScript
    const tNavbar = await getTranslations({ locale, namespace: 'navbar' });
    const localePrefix = locale === 'en' ? '' : `/${locale}`;
    const articleUrl = `${SITE_CONFIG.baseUrl}${localePrefix}/articles/${canonicalSlug}`;

    const articleJsonLd = buildArticleJsonLd({
        dateModified: new Date(article.metadata.dateModified).toISOString(),
        datePublished: new Date(article.metadata.datePublished).toISOString(),
        description,
        headline: title,
        imageUrl: article.imageUrl ? `${SITE_CONFIG.baseUrl}${article.imageUrl}` : undefined,
        inLanguage: Object.keys(article.content),
        readingTimeMinutes: calculateReadingTimeMinutes(content),
        url: articleUrl,
        wordCount: content.split(/\s+/u).filter(Boolean).length,
    });

    const breadcrumbJsonLd = buildBreadcrumbJsonLd({
        items: [
            { name: SITE_CONFIG.author.name, url: `${SITE_CONFIG.baseUrl}${localePrefix || '/'}` },
            { name: tNavbar('articles'), url: `${SITE_CONFIG.baseUrl}${localePrefix}/articles` },
            { name: title, url: articleUrl },
        ],
    });

    return (
        <>
            <JsonLdScript data={articleJsonLd} id="article-json-ld" />
            <JsonLdScript data={breadcrumbJsonLd} id="article-breadcrumb-json-ld" />
            <ArticleTemplate
                articleId={slugId}
                articles={articles}
                contentInMarkdown={content}
                currentLanguage={locale as ArticleLanguage}
                dateModified={article.metadata.dateModified}
                datePublished={article.metadata.datePublished}
                description={description}
                features={features}
                imageUrl={article.imageUrl}
                linkedExperiment={
                    linkedExperiment
                        ? { name: linkedExperiment.name, slug: linkedExperiment.slug }
                        : null
                }
                title={title}
            />
        </>
    );
}

export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
    const params = await props.params;
    const { locale, slugId } = params;
    const id = slugId.split('-')[0];

    const article = articlesRepository.getByIndex(id);

    if (!article) {
        return { title: 'Article Not Found' };
    }

    const availableLanguages = Object.keys(article.content) as ArticleLanguage[];

    // Generate hreflang links with new URL structure
    const alternateLanguages: Record<string, string> = {};
    for (const language of availableLanguages) {
        alternateLanguages[language] =
            language === 'en' ? `/articles/${slugId}` : `/${language}/articles/${slugId}`;
    }

    const title = article.metadata.title[locale as Locale] ?? article.metadata.title.en;
    const description =
        article.metadata.description[locale as Locale] ?? article.metadata.description.en;
    // Locales without a translation serve the EN content as fallback — their
    // Canonical points at the EN URL so search engines consolidate them.
    const hasLocaleContent = Boolean(article.content[locale as ArticleLanguage]);
    const path =
        locale === 'en' || !hasLocaleContent
            ? `/articles/${slugId}`
            : `/${locale}/articles/${slugId}`;
    const is42 = is42RelatedArticle(article.publicIndex);

    const tags = [article.metadata.category, article.metadata.series].filter((tag): tag is string =>
        Boolean(tag),
    );

    return buildMetadata({
        alternateLanguages,
        article: {
            authors: [SITE_CONFIG.author.url],
            modifiedTime: new Date(article.metadata.dateModified).toISOString(),
            publishedTime: new Date(article.metadata.datePublished).toISOString(),
            section: article.metadata.series,
            tags,
        },
        description,
        image: article.imageUrl ? { alt: title, path: article.imageUrl } : undefined,
        includeTwitterAttribution: true,
        is42Related: is42,
        locale,
        localeAlternates: availableLanguages.filter((l) => l !== locale),
        path,
        title,
        type: 'article',
    });
}

export function generateStaticParams() {
    const articles = articlesRepository.getAll();

    // Generate params for all locale + slugId combinations
    return articles.flatMap((article) =>
        locales.flatMap((locale) => {
            // Only generate if article has content in this locale
            if (!article.content[locale as ArticleLanguage]) {
                return [];
            }
            return [
                {
                    locale,
                    slugId: buildArticleSlug(article.publicIndex, article.metadata.title.en),
                },
                {
                    locale,
                    slugId: String(article.publicIndex),
                },
            ];
        }),
    );
}
