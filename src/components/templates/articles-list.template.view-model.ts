// Domain
import { type Article } from '../../domain/article.js';
import { UserContactType, type UserRepository } from '../../domain/user.js';

import { buildArticleSlug } from '../../lib/slugify.js';

export interface ArticleRowViewModel {
    category: string;
    isCodeCategory: boolean;
    slug: string;
    title: string;
}

export interface ArticlesListButton {
    href: string;
    text: string;
}

export interface ArticlesListViewModel {
    articles: ArticleRowViewModel[];
    button: ArticlesListButton;
    highlightDescription: string;
    highlightTitle: string;
}

export interface ViewModel<T> {
    getViewModel: () => T;
}

export class ArticlesListViewModelImpl implements ViewModel<ArticlesListViewModel> {
    constructor(
        private readonly articles: Article[],
        private readonly highlightTitle: string,
        private readonly highlightDescription: string,
        private readonly userRepo: UserRepository,
    ) {}

    getViewModel(): ArticlesListViewModel {
        const button = {
            href: this.userRepo.getContact(UserContactType.Medium).url.toString(),
            text: 'Check me on Medium',
        };

        const sortedArticles = this.articles
            .filter((article) => article.published)
            .sort(
                (a, b) =>
                    new Date(b.metadata.datePublished).getTime() -
                    new Date(a.metadata.datePublished).getTime(),
            )
            .map((article) => ({
                category: article.metadata.category,
                isCodeCategory: article.metadata.category === 'code',
                slug: buildArticleSlug(article.publicIndex, article.metadata.title.en),
                title: article.metadata.title.en,
            }));

        return {
            articles: sortedArticles,
            button,
            highlightDescription: this.highlightDescription,
            highlightTitle: this.highlightTitle,
        };
    }
}
