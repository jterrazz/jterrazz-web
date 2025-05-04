import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { type ArticleLanguage } from '../../../../domain/article.js';

import { ArticleInMemoryRepository } from '../../../../infrastructure/repositories/article-in-memory.repository.js';
import { FeaturedId } from '../../../../infrastructure/repositories/data/features.data.js';
import { FeatureInMemoryRepository } from '../../../../infrastructure/repositories/feature-in-memory.repository.js';

import { ArticleTemplate } from '../../../../components/templates/article.template.js';

type ArticlePageProps = {
    params: Promise<{ id: string; lang: ArticleLanguage }>;
};

export default async function ArticlePage(props: ArticlePageProps) {
    const params = await props.params;

    const { id, lang } = params;

    const featureRepository = new FeatureInMemoryRepository();
    const articlesRepository = new ArticleInMemoryRepository();

    const article = await articlesRepository.getArticleByIndex(id, lang);
    const articles = await articlesRepository.getArticles();
    const features = [featureRepository.getFeatureById(FeaturedId.Source)];

    if (!article) {
        return notFound();
    }

    return (
        <ArticleTemplate
            articleId={id}
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
    const { id, lang } = params;
    const articlesRepository = new ArticleInMemoryRepository();
    const article = await articlesRepository.getArticleByIndex(id, lang);

    return {
        description: article?.metadata.description,
        title: article?.metadata.title + ' ~ Jterrazz',
    };
}

export async function generateStaticParams() {
    const articlesRepository = new ArticleInMemoryRepository();
    const articles = await articlesRepository.getArticles();

    return articles.flatMap((article) =>
        Object.keys(article.content).map((lang) => ({
            id: String(article.publicIndex),
            lang: lang as ArticleLanguage,
        })),
    );
}
