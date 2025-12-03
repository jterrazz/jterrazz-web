import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { ArticleTemplate } from '../../../presentation/templates/article.template';
import { articlesRepository } from '../../../infrastructure/repositories/articles.repository';
import {
    featuresRepository,
    FeatureId,
} from '../../../infrastructure/repositories/features.repository';
import { type ArticleLanguage } from '../../../domain/article';
import { buildArticleSlug } from '../../../domain/utils/slugify';

export const dynamicParams = true;

type ArticlePageProps = {
    params: Promise<{ slugId: string }>;
};

export default async function ArticlePage(props: ArticlePageProps) {
    const params = await props.params;
    const { slugId } = params;

    // Extract the numeric id prefix before the first dash
    const id = slugId.split('-')[0];

    const article = articlesRepository.getByIndex(id);

    if (!article) {
        return notFound();
    }

    // Compute canonical slug and redirect if needed
    const canonicalSlug = buildArticleSlug(article.publicIndex, article.metadata.title.en);
    if (slugId !== canonicalSlug) {
        return redirect(`/articles/${canonicalSlug}`);
    }

    const articles = articlesRepository.getAll();
    const features = [featuresRepository.getById(FeatureId.Source)];

    return (
        <ArticleTemplate
            articleId={slugId}
            articles={articles}
            availableLanguages={Object.keys(article.content) as ArticleLanguage[]}
            category={article.metadata.category}
            contentInMarkdown={article.content.en ?? ''}
            currentLanguage={'en'}
            dateModified={article.metadata.dateModified}
            datePublished={article.metadata.datePublished}
            features={features}
            title={article.metadata.title.en}
        />
    );
}

export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
    const params = await props.params;
    const { slugId } = params;
    const id = slugId.split('-')[0];

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';

    const article = articlesRepository.getByIndex(id);

    if (!article) {
        return {
            title: 'Article Not Found ~ Jterrazz',
        };
    }

    const availableLanguages = Object.keys(article.content) as ArticleLanguage[];

    const thumbnailUrl = article.imageUrl
        ? `${baseUrl}${article.imageUrl}`
        : `${baseUrl}/assets/icons/app-icon.jterrazz.png`;

    // Generate hreflang links for all available languages
    const alternates: Record<string, string> = {};
    for (const language of availableLanguages) {
        alternates[language] = `${baseUrl}/articles/${slugId}/${language}`;
    }

    return {
        alternates: {
            canonical: `${baseUrl}/articles/${slugId}/en`, // Default to English
            languages: alternates,
        },
        description: article.metadata.description.en,
        openGraph: {
            alternateLocale: availableLanguages.filter((l) => l !== 'en'),
            description: article.metadata.description.en,
            images: [
                {
                    alt: article.metadata.title.en,
                    height: 630,
                    url: thumbnailUrl,
                    width: 1200,
                },
            ],
            locale: 'en',
            title: article.metadata.title.en,
            url: `${baseUrl}/articles/${slugId}/en`,
        },
        title: `${article.metadata.title.en} ~ Jterrazz`,
    };
}

export function generateStaticParams() {
    const articles = articlesRepository.getAll();

    return articles.flatMap((article) => [
        { slugId: buildArticleSlug(article.publicIndex, article.metadata.title.en) },
        { slugId: String(article.publicIndex) },
    ]);
}
