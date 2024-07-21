import { ArticleRepository } from '../../domain/article/article.repository.js';

export class BlogMarkdownRepository implements ArticleRepository {
    async getPostById(id: number) {
        return {
            content: 'content',
            // date: new Date(),
            id: 0,
            // tags: [],
            title: 'title',
            year: 2021,
        };
    }
    async getPostsMetadata() {
        return [];
    }
}
