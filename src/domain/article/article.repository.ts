import { PostArticle, PostMetadata } from './article.js';

export interface ArticleRepository {
    getPostById(id: number): Promise<PostArticle | undefined>;
    getPostsMetadata(): Promise<PostMetadata[]>;
}
