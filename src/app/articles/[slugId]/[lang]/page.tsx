import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

// Domain
import { type ArticleLanguage } from '../../../../domain/article.js';

// Infrastructure
import { ArticleInMemoryRepository } from '../../../../infrastructure/repositories/article-in-memory.repository.js';
import { FeaturedId } from '../../../../infrastructure/repositories/data/features.data.js';
import { FeatureInMemoryRepository } from '../../../../infrastructure/repositories/feature-in-memory.repository.js';

import { ArticleTemplate } from '../../../../components/templates/article.template.js';
import { buildArticleSlug } from '../../../../lib/slugify.js';

export const dynamicParams = true;

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

    const canonicalSlug = buildArticleSlug(article.publicIndex, article.metadata.title.en);
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
            contentInMarkdown={article.content[lang] ?? ''}
            currentLanguage={lang}
            dateModified={article.metadata.dateModified}
            datePublished={article.metadata.datePublished}
            features={features}
            title={article.metadata.title[lang]}
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

    // Determine primary image (thumbnail) for OpenGraph and link previews
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';
    const thumbnailUrl = article.imageUrl
        ? `${baseUrl}${article.imageUrl}`
        : `${baseUrl}/assets/icons/app-icon.jterrazz.png`;

    // Generate hreflang links
    const alternates: Record<string, string> = {};
    for (const language of availableLanguages) {
        alternates[language] = `${baseUrl}/articles/${slugId}/${language}`;
    }

    return {
        alternates: {
            canonical: `${baseUrl}/articles/${slugId}/${lang}`,
            languages: alternates,
        },
        description: article.metadata.description[lang],
        openGraph: {
            alternateLocale: availableLanguages.filter((l) => l !== lang),
            description: article.metadata.description[lang],
            images: [
                {
                    alt: article.metadata.title[lang],
                    height: 630,
                    url: thumbnailUrl,
                    width: 1200,
                },
            ],
            locale: lang,
            title: article.metadata.title[lang],
            url: `${baseUrl}/articles/${slugId}/${lang}`,
        },
        title: `${article.metadata.title[lang]} ~ Jterrazz`,
    };
}

export async function generateStaticParams() {
    const articlesRepository = new ArticleInMemoryRepository();
    const articles = await articlesRepository.getArticles();

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
