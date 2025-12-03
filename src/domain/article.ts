export enum ArticleCategory {
    Insight = 'insight',
    Experiment = 'experiment',
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
        series?: string;
        title: Record<ArticleLanguage, string>;
    };
    publicIndex: number;
    published: boolean;
}

export type ArticleLanguage = 'en' | 'fr';
