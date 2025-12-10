import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

// Domain
import { type ArticleLanguage } from '../../../domain/article';
import { buildArticleSlug } from '../../../domain/utils/slugify';

// Infrastructure
import { articlesRepository } from '../../../infrastructure/repositories/articles.repository';
import {
    FeatureId,
    featuresRepository,
} from '../../../infrastructure/repositories/features.repository';
import { buildMetadata } from '../../../infrastructure/seo/build-metadata';

import { ArticleTemplate } from '../../../presentation/templates/article.template';

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
            contentInMarkdown={article.content.en ?? ''}
            currentLanguage={'en'}
            dateModified={article.metadata.dateModified}
            datePublished={article.metadata.datePublished}
            description={article.metadata.description.en}
            features={features}
            title={article.metadata.title.en}
        />
    );
}

export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
    const params = await props.params;
    const { slugId } = params;
    const id = slugId.split('-')[0];

    const article = articlesRepository.getByIndex(id);

    if (!article) {
        return { title: 'Article Not Found' };
    }

    const availableLanguages = Object.keys(article.content) as ArticleLanguage[];

    // Generate hreflang links for all available languages
    const alternateLanguages: Record<string, string> = {};
    for (const language of availableLanguages) {
        alternateLanguages[language] = `/articles/${slugId}/${language}`;
    }

    return buildMetadata({
        alternateLanguages,
        description: article.metadata.description.en,
        image: article.imageUrl
            ? { alt: article.metadata.title.en, path: article.imageUrl }
            : undefined,
        locale: 'en',
        localeAlternates: availableLanguages.filter((l) => l !== 'en'),
        path: `/articles/${slugId}/en`,
        title: article.metadata.title.en,
        type: 'article',
    });
}

export function generateStaticParams() {
    const articles = articlesRepository.getAll();

    return articles.flatMap((article) => [
        { slugId: buildArticleSlug(article.publicIndex, article.metadata.title.en) },
        { slugId: String(article.publicIndex) },
    ]);
}
