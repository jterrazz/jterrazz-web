export enum ArticleCategory {
    Build = 'build',
    Code = 'code',
    Insight = 'insight',
}

export interface Article {
    content: {
        [key in ArticleLanguage]?: string;
    };
    imageUrl: string;
    metadata: {
        category: ArticleCategory;
        dateModified: string;
        datePublished: string;
        description: Record<ArticleLanguage, string>;
        title: Record<ArticleLanguage, string>;
    };
    publicIndex: number;
    published: boolean;
}

export type ArticleLanguage = 'en' | 'fr';

export interface ArticleRepository {
    getArticleByIndex(index: string, language?: ArticleLanguage): Promise<Article | undefined>;
    getArticles(): Promise<Article[]>;
}
