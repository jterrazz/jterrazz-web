export enum ArticleCategory {
    Code = 'code',
    App = 'app',
    World = 'world',
}

export type Article = {
    index: number;
    contentInMarkdown: string;
    metadata: {
        title: string;
        description: string;
        dateModified: string;
        datePublished: string;
        category: ArticleCategory;
    };
    published: boolean;
};

export interface ArticleRepository {
    getArticleByIndex(index: string): Promise<Article | undefined>;
    getArticles(): Promise<Article[]>;
}
