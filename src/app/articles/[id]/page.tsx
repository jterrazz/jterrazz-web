import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FeaturedId } from '../../../infrastructure/data/features.data.js';
import { ArticleInMemoryRepository } from '../../../infrastructure/repositories/article-in-memory.repository.js';
import { FeatureInMemoryRepository } from '../../../infrastructure/repositories/feature-in-memory.repository.js';

import { ArticleTemplate } from '../../../components/templates/article.template.js';

// export const metadata: Metadata = {
//     description: 'The best of my development projects, showcasing my skills and experience.',
//     title: 'Article - Jterrazz',
// };

export async function generateStaticParams() {
    const articlesRepository = new ArticleInMemoryRepository();
    const articles = await articlesRepository.getArticles();

    return articles.map((article) => {
        return { id: String(article.index) };
    });
}

type ArticlePageProps = {
    params: { id: string };
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const id = params.id;
    const articlesRepository = new ArticleInMemoryRepository();
    const article = await articlesRepository.getArticleByIndex(id);

    return {
        title: article?.metadata.title + ' ~ Jterrazz',
    };
}

export default async function ArticlePage({ params: { id } }: ArticlePageProps) {
    const featureRepository = new FeatureInMemoryRepository();
    const articlesRepository = new ArticleInMemoryRepository();

    const article = await articlesRepository.getArticleByIndex(id);
    const features = [featureRepository.getFeatureById(FeaturedId.Source)];

    if (!article) {
        return notFound();
    }

    return <ArticleTemplate features={features} contentInMarkdown={article.contentInMarkdown} />;
}