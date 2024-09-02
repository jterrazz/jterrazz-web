import { Article, ArticleRepository } from '../../domain/article.js';

import { readMarkdownArticles } from '../data/articles.data.js';

export class ArticleInMemoryRepository implements ArticleRepository {
    private markdownArticles: Article[] | undefined;

    async getMarkdownArticles() {
        if (!this.markdownArticles) {
            this.markdownArticles = await readMarkdownArticles();
        }

        return this.markdownArticles;
    }

    async getArticles() {
        const articles = await this.getMarkdownArticles();

        return articles.sort(
            (a, b) =>
                new Date(b.metadata.dateModified).getTime() -
                new Date(a.metadata.dateModified).getTime(),
        );
    }

    async getArticleByIndex(index: string) {
        const articles = await this.getMarkdownArticles();

        return articles.find((article) => String(article.index) === index);
    }
}
