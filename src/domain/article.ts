export enum ArticleCategory {
    App = 'app',
    Code = 'code',
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

export interface Article {
    content: {
        [key in ArticleLanguage]?: string;
    };
    imageUrl: string;
    metadata: {
        category: ArticleCategory;
        dateModified: string;
        datePublished: string;
        description: string;
        title: string;
    };
    publicIndex: number;
    published: boolean;
}

export type ArticleLanguage = 'en' | 'fr';

export interface ArticleRepository {
    getArticleByIndex(index: string, language?: ArticleLanguage): Promise<Article | undefined>;
    getArticles(): Promise<Article[]>;
}
