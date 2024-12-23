export enum ArticleCategory {
    Code = 'code',
    App = 'app',
    World = 'world',
}

// export type ArticleStatus = 'draft' | 'published' | 'archived';

// export type Slug = string & { readonly _: unique symbol };

// export interface ArticleMetadata {
//     title: string;
//     slug: Slug;
//     description: string;
//     dateModified: Date;
//     datePublished: Date;
//     category: ArticleCategory;
//     tags: string[];
// }

// export interface Article {
//     publicId: string;
//     content: {
//         markdown: string;
//     };
//     metadata: ArticleMetadata;
//     status: ArticleStatus;
//     seo?: {
//         canonicalUrl?: string;
//         keywords?: string[];
//         ogImage?: string;
//     };
// }

export type Article = {
    publicIndex: number;
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
