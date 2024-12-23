import { Article } from '../../domain/article.js';
import { UserContactType, UserRepository } from '../../domain/user.js';

export interface ArticlesListButton {
    href: string;
    text: string;
}

export interface ArticleRowViewModel {
    index: string;
    title: string;
    category: string;
    isCodeCategory: boolean;
}

export interface ArticlesListViewModel {
    highlightTitle: string;
    highlightDescription: string;
    button: ArticlesListButton;
    articles: ArticleRowViewModel[];
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
            text: 'Follow me on Medium',
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
                index: String(article.index),
                isCodeCategory: article.metadata.category === 'code',
                title: article.metadata.title,
            }));

        return {
            articles: sortedArticles,
            button,
            highlightDescription: this.highlightDescription,
            highlightTitle: this.highlightTitle,
        };
    }
}
