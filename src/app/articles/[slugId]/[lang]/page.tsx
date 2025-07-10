import React from 'react';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { type ArticleLanguage } from '../../../../domain/article.js';

import { ArticleInMemoryRepository } from '../../../../infrastructure/repositories/article-in-memory.repository.js';
import { FeaturedId } from '../../../../infrastructure/repositories/data/features.data.js';
import { FeatureInMemoryRepository } from '../../../../infrastructure/repositories/feature-in-memory.repository.js';

import { ArticleTemplate } from '../../../../components/templates/article.template.js';
import { buildArticleSlug } from '../../../../lib/slugify.js';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

type ArticlePageProps = {
    params: Promise<{ lang: ArticleLanguage; slugId: string }>;
};

export default async function ArticlePage(props: ArticlePageProps) {
    const params = await props.params;
    const { slugId, lang } = params;
    const id = slugId.split('-')[0];

    const featureRepository = new FeatureInMemoryRepository();
    const articlesRepository = new ArticleInMemoryRepository();

    const article = await articlesRepository.getArticleByIndex(id, lang);

    if (!article) {
        return notFound();
    }

    const canonicalSlug = buildArticleSlug(article.publicIndex, article.metadata.title);
    if (slugId !== canonicalSlug) {
        return redirect(`/articles/${canonicalSlug}/${lang}`);
    }

    const articles = await articlesRepository.getArticles();
    const features = [featureRepository.getFeatureById(FeaturedId.Source)];

    return (
        <ArticleTemplate
            articleId={slugId}
            articles={articles.filter((a) => a.publicIndex !== article.publicIndex)}
            availableLanguages={Object.keys(article.content) as ArticleLanguage[]}
            contentInMarkdown={article.content[lang]!}
            currentLanguage={lang}
            dateModified={article.metadata.dateModified}
            datePublished={article.metadata.datePublished}
            features={features}
            title={article.metadata.title}
        />
    );
}

export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
    const params = await props.params;
    const { slugId, lang } = params;
    const id = slugId.split('-')[0];

    const articlesRepository = new ArticleInMemoryRepository();
    const article = await articlesRepository.getArticleByIndex(id, lang);

    if (!article) {
        return {
            title: 'Article Not Found ~ Jterrazz',
        };
    }

    const availableLanguages = Object.keys(article.content) as ArticleLanguage[];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';

    // Generate hreflang links
    const alternates: Record<string, string> = {};
    availableLanguages.forEach((language) => {
        alternates[language] = `${baseUrl}/articles/${slugId}/${language}`;
    });

    return {
        alternates: {
            canonical: `${baseUrl}/articles/${slugId}/${lang}`,
            languages: alternates,
        },
        description: article.metadata.description,
        openGraph: {
            alternateLocale: availableLanguages.filter((l) => l !== lang),
            description: article.metadata.description,
            locale: lang,
            title: article.metadata.title,
            url: `${baseUrl}/articles/${slugId}/${lang}`,
        },
        title: article.metadata.title + ' ~ Jterrazz',
    };
}

export async function generateStaticParams() {
    const articlesRepository = new ArticleInMemoryRepository();
    const articles = await articlesRepository.getArticles();

    return articles.flatMap((article) =>
        Object.keys(article.content).flatMap((lang) => [
            {
                lang: lang as ArticleLanguage,
                slugId: buildArticleSlug(article.publicIndex, article.metadata.title),
            },
            {
                lang: lang as ArticleLanguage,
                slugId: String(article.publicIndex),
            },
        ]),
    );
}
