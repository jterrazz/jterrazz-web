// Domain
import { type Article } from '../../domain/article.js';
import { UserContactType, type UserRepository } from '../../domain/user.js';

import { buildArticleSlug } from '../../lib/slugify.js';

export interface ArticleRowViewModel {
    category: string;
    description: string;
    imageUrl: string;
    isCodeCategory: boolean;
    slug: string;
    title: string;
    datePublished: string;
    readingTime: string;
}

export interface ArticlesListButton {
    href: string;
    text: string;
}

export interface ArticleSeriesViewModel {
    seriesTitle: string;
    featuredArticle: ArticleRowViewModel;
    relatedArticles: ArticleRowViewModel[];
}

export interface ArticlesListViewModel {
    series: ArticleSeriesViewModel[];
    standaloneArticles: ArticleRowViewModel[];
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

        const publishedArticles = this.articles
            .filter((article) => article.published)
            .sort(
                (a, b) =>
                    new Date(b.metadata.datePublished).getTime() -
                    new Date(a.metadata.datePublished).getTime(),
            );

        // Group articles by series
        const seriesMap = new Map<string, Article[]>();
        const standaloneArticles: Article[] = [];

        publishedArticles.forEach((article) => {
            const seriesPrefix = this.extractSeriesPrefix(article.metadata.title.en);
            if (seriesPrefix) {
                if (!seriesMap.has(seriesPrefix)) {
                    seriesMap.set(seriesPrefix, []);
                }
                seriesMap.get(seriesPrefix)!.push(article);
            } else {
                standaloneArticles.push(article);
            }
        });

        // Convert series to view models
        const series: ArticleSeriesViewModel[] = [];
        seriesMap.forEach((articles, seriesTitle) => {
            if (articles.length > 1) { // Only create series for multiple articles
                const sortedSeriesArticles = articles.sort(
                    (a, b) => new Date(a.metadata.datePublished).getTime() - new Date(b.metadata.datePublished).getTime()
                );
                
                const featuredArticle = this.mapToViewModel(sortedSeriesArticles[0]);
                const relatedArticles = sortedSeriesArticles.slice(1).map(article => this.mapToViewModel(article));
                
                series.push({
                    seriesTitle,
                    featuredArticle,
                    relatedArticles,
                });
            } else {
                // Single article series go to standalone
                standaloneArticles.push(...articles);
            }
        });

        // Sort series by the date of the most recent article in each series
        series.sort((a, b) => {
            const aLatestDate = Math.max(
                new Date(a.featuredArticle.datePublished).getTime(),
                ...a.relatedArticles.map(article => new Date(article.datePublished).getTime())
            );
            const bLatestDate = Math.max(
                new Date(b.featuredArticle.datePublished).getTime(),
                ...b.relatedArticles.map(article => new Date(article.datePublished).getTime())
            );
            return bLatestDate - aLatestDate;
        });

        return {
            series,
            standaloneArticles: standaloneArticles.map(article => this.mapToViewModel(article)),
            button,
            highlightDescription: this.highlightDescription,
            highlightTitle: this.highlightTitle,
        };
    }

    private calculateReadingTime(description: string): string {
        const wordsPerMinute = 200;
        const words = description.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${Math.max(minutes, 1)} min read`;
    }

    private extractSeriesPrefix(title: string): null | string {
        const match = title.match(/^([^:]+):/);
        return match ? match[1] : null;
    }

    private mapToViewModel(article: Article): ArticleRowViewModel {
        return {
            category: article.metadata.category,
            description: article.metadata.description.en,
            imageUrl: article.imageUrl,
            isCodeCategory: article.metadata.category === 'code',
            slug: buildArticleSlug(article.publicIndex, article.metadata.title.en),
            title: article.metadata.title.en,
            datePublished: new Date(article.metadata.datePublished).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            readingTime: this.calculateReadingTime(article.metadata.description.en),
        };
    }
}
