// Domain
import { type Article, type ArticleLanguage, type ArticleRepository } from '../../domain/article';

import { readMarkdownArticles } from './data/articles.data';

export class ArticleInMemoryRepository implements ArticleRepository {
    private markdownArticles: Article[] | undefined;

    async getArticleByIndex(index: string, language: ArticleLanguage = 'en') {
        const articles = await this.getMarkdownArticles();
        const article = articles.find((article) => String(article.publicIndex) === index);

        if (!article || !article.content[language]) return undefined;

        return article;
    }

    async getArticles() {
        const articles = await this.getMarkdownArticles();

        return articles.sort(
            (a, b) =>
                new Date(b.metadata.dateModified).getTime() -
                new Date(a.metadata.dateModified).getTime(),
        );
    }

    async getMarkdownArticles() {
        if (!this.markdownArticles) {
            this.markdownArticles = await readMarkdownArticles();
        }

        return this.markdownArticles;
    }
}
