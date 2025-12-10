import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

// Domain
import { type ArticleLanguage } from '../../../../domain/article';
import { buildArticleSlug } from '../../../../domain/utils/slugify';

// Infrastructure
import { articlesRepository } from '../../../../infrastructure/repositories/articles.repository';
import {
    FeatureId,
    featuresRepository,
} from '../../../../infrastructure/repositories/features.repository';
import { buildMetadata } from '../../../../infrastructure/seo/build-metadata';

import { ArticleTemplate } from '../../../../presentation/templates/article.template';

export const dynamicParams = true;

type ArticlePageProps = {
    params: Promise<{ lang: ArticleLanguage; slugId: string }>;
};

export default async function ArticlePage(props: ArticlePageProps) {
    const params = await props.params;
    const { slugId, lang } = params;
    const id = slugId.split('-')[0];

    const article = articlesRepository.getByIndex(id, lang);

    if (!article) {
        return notFound();
    }

    const canonicalSlug = buildArticleSlug(article.publicIndex, article.metadata.title.en);
    if (slugId !== canonicalSlug) {
        return redirect(`/articles/${canonicalSlug}/${lang}`);
    }

    const articles = articlesRepository.getAll();
    const features = [featuresRepository.getById(FeatureId.Source)];

    return (
        <ArticleTemplate
            articleId={slugId}
            articles={articles}
            availableLanguages={Object.keys(article.content) as ArticleLanguage[]}
            contentInMarkdown={article.content[lang] ?? ''}
            currentLanguage={lang}
            dateModified={article.metadata.dateModified}
            datePublished={article.metadata.datePublished}
            description={article.metadata.description[lang]}
            features={features}
            imageUrl={article.imageUrl}
            title={article.metadata.title[lang]}
        />
    );
}

export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
    const params = await props.params;
    const { slugId, lang } = params;
    const id = slugId.split('-')[0];

    const article = articlesRepository.getByIndex(id, lang);

    if (!article) {
        return { title: 'Article Not Found' };
    }

    const availableLanguages = Object.keys(article.content) as ArticleLanguage[];

    // Generate hreflang links
    const alternateLanguages: Record<string, string> = {};
    for (const language of availableLanguages) {
        alternateLanguages[language] = `/articles/${slugId}/${language}`;
    }

    return buildMetadata({
        alternateLanguages,
        description: article.metadata.description[lang],
        image: article.imageUrl
            ? { alt: article.metadata.title[lang], path: article.imageUrl }
            : undefined,
        includeTwitterAttribution: true,
        locale: lang,
        localeAlternates: availableLanguages.filter((l) => l !== lang),
        path: `/articles/${slugId}/${lang}`,
        title: article.metadata.title[lang],
        type: 'article',
    });
}

export function generateStaticParams() {
    const articles = articlesRepository.getAll();

    return articles.flatMap((article) =>
        Object.keys(article.content).flatMap((lang) => [
            {
                lang: lang as ArticleLanguage,
                slugId: buildArticleSlug(article.publicIndex, article.metadata.title.en),
            },
            {
                lang: lang as ArticleLanguage,
                slugId: String(article.publicIndex),
            },
        ]),
    );
}
