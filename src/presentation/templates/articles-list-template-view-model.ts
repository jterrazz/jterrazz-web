// Domain
import { type Article, type ArticleLanguage } from '../../domain/article';
import { UserContactType } from '../../domain/user';
import { calculateReadingTimeMinutes } from '../../domain/utils/article-content';
import { buildArticleSlug } from '../../domain/utils/slugify';
// Infrastructure
import { type Locale } from '../../i18n/config';
import { contentLinksRepository } from '../../infrastructure/repositories/content-links.repository';
import { userRepository } from '../../infrastructure/repositories/user.repository';

export interface ArticleRowViewModel {
    category: string;
    description: string;
    experimentSlug?: string;
    imageUrl: string;
    slug: string;
    tagline: string;
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

export type ArticlesListTimelineSection =
    | { kind: 'series'; series: ArticleSeriesViewModel }
    | { kind: 'standalones'; articles: ArticleRowViewModel[] };

export interface ArticlesListViewModel {
    series: ArticleSeriesViewModel[];
    standaloneArticles: ArticleRowViewModel[];
    timeline: ArticlesListTimelineSection[];
    latestExplorationArticle: ArticleRowViewModel | null;
    button: ArticlesListButton;
    highlightDescription: string;
    highlightTitle: string;
}

const DATE_LOCALES: Record<Locale, string> = {
    en: 'en-US',
    fr: 'fr-FR',
};

/** The series pinned to the top of the legacy `series` array, in this order. */
const SERIES_ORDER = ['Abundant Intelligence', 'Using AI', 'Application Design'];

const byPublishedAscending = (a: Article, b: Article): number =>
    new Date(a.metadata.datePublished).getTime() - new Date(b.metadata.datePublished).getTime();

const byPublishedDescending = (a: Article, b: Article): number => -byPublishedAscending(a, b);

const latestDateOf = (s: ArticleSeriesViewModel): number =>
    Math.max(
        new Date(s.featuredArticle.datePublished).getTime(),
        ...s.relatedArticles.map((article) => new Date(article.datePublished).getTime()),
    );

function mapArticle(article: Article, locale: Locale): ArticleRowViewModel {
    const lang = locale as ArticleLanguage;
    const content = article.content[lang] || article.content.en || '';
    return {
        category: article.metadata.category,
        description: article.metadata.description[locale] ?? article.metadata.description.en,
        experimentSlug: contentLinksRepository.getExperimentSlugForArticle(article.publicIndex),
        imageUrl: article.imageUrl,
        slug: buildArticleSlug(article.publicIndex, article.metadata.title.en),
        tagline: article.metadata.tagline[locale] ?? article.metadata.tagline.en,
        title: article.metadata.title[locale] ?? article.metadata.title.en,
        datePublished: new Date(article.metadata.datePublished).toLocaleDateString(
            DATE_LOCALES[locale],
            { year: 'numeric', month: 'short' },
        ),
        readingTime: `${calculateReadingTimeMinutes(content)} min read`,
    };
}

/**
 * Everything the articles list renders that is derived rather than given —
 * the series grouping, the interleaved timeline, the featured exploration.
 * A plain builder, like its sibling `article-template-view-model`.
 *
 * Series own their articles: the featured exploration only ever comes from
 * the standalones, so a series never loses its opening part to the spotlight.
 */
export function buildArticlesListViewModel(options: {
    articles: Article[];
    highlightTitle: string;
    highlightDescription: string;
    locale?: Locale;
    viewMediumText?: string;
}): ArticlesListViewModel {
    const {
        articles,
        highlightDescription,
        highlightTitle,
        locale = 'en',
        viewMediumText = 'View Medium',
    } = options;

    const toViewModel = (article: Article) => mapArticle(article, locale);

    const button = {
        href: userRepository.getContact(UserContactType.Medium).url.toString(),
        text: viewMediumText,
    };

    const publishedArticles = articles
        .filter((article) => article.published)
        .sort(byPublishedDescending);

    // Split series from standalones; the spotlight picks from standalones only.
    const seriesMap = new Map<string, Article[]>();
    const potentialStandaloneArticles: Article[] = [];
    for (const article of publishedArticles) {
        const seriesName = article.metadata.series;
        if (seriesName) {
            seriesMap.set(seriesName, [...(seriesMap.get(seriesName) ?? []), article]);
        } else {
            potentialStandaloneArticles.push(article);
        }
    }

    const standaloneSorted = potentialStandaloneArticles.sort(byPublishedDescending);
    const latestExplorationRaw =
        standaloneSorted.find((a) => a.metadata.category === 'exploration') ?? null;
    const finalStandaloneArticles = standaloneSorted.filter(
        (a) => a.publicIndex !== latestExplorationRaw?.publicIndex,
    );
    const latestExplorationArticle = latestExplorationRaw
        ? toViewModel(latestExplorationRaw)
        : null;

    // The legacy `series` array — pinned order first, then most recent activity.
    const series: ArticleSeriesViewModel[] = [];
    seriesMap.forEach((articlesInSeries, seriesTitle) => {
        if (articlesInSeries.length <= 1) {
            return;
        }
        const sorted = [...articlesInSeries].sort(byPublishedAscending);
        series.push({
            seriesTitle,
            featuredArticle: toViewModel(sorted[0]),
            relatedArticles: sorted.slice(1).map(toViewModel),
        });
    });
    series.sort((a, b) => {
        const aOrder = SERIES_ORDER.indexOf(a.seriesTitle);
        const bOrder = SERIES_ORDER.indexOf(b.seriesTitle);
        if (aOrder !== -1 && bOrder !== -1) {
            return aOrder - bOrder;
        }
        if (aOrder !== -1) {
            return -1;
        }
        if (bOrder !== -1) {
            return 1;
        }
        return latestDateOf(b) - latestDateOf(a);
    });

    /*
     * The timeline interleaves series blocks and standalone groups purely by
     * date (SERIES_ORDER only governs the legacy array above). Consecutive
     * standalones collapse into one section so the layout doesn't fragment.
     */
    type DatedItem =
        | { kind: 'series'; date: number; data: { seriesTitle: string; articles: Article[] } }
        | { kind: 'standalone'; date: number; data: Article };

    const datedItems: DatedItem[] = [];
    seriesMap.forEach((articlesInSeries, seriesTitle) => {
        if (articlesInSeries.length <= 1) {
            return;
        }
        datedItems.push({
            kind: 'series',
            date: Math.max(
                ...articlesInSeries.map((a) => new Date(a.metadata.datePublished).getTime()),
            ),
            data: { seriesTitle, articles: [...articlesInSeries].sort(byPublishedAscending) },
        });
    });
    for (const article of finalStandaloneArticles) {
        datedItems.push({
            kind: 'standalone',
            date: new Date(article.metadata.datePublished).getTime(),
            data: article,
        });
    }
    datedItems.sort((a, b) => b.date - a.date);

    const timeline: ArticlesListTimelineSection[] = [];
    for (const item of datedItems) {
        if (item.kind === 'standalone') {
            const last = timeline.at(-1);
            const articleVm = toViewModel(item.data);
            if (last && last.kind === 'standalones') {
                last.articles.push(articleVm);
            } else {
                timeline.push({ kind: 'standalones', articles: [articleVm] });
            }
        } else {
            timeline.push({
                kind: 'series',
                series: {
                    featuredArticle: toViewModel(item.data.articles[0]),
                    relatedArticles: item.data.articles.slice(1).map(toViewModel),
                    seriesTitle: item.data.seriesTitle,
                },
            });
        }
    }

    return {
        series,
        standaloneArticles: finalStandaloneArticles.map(toViewModel),
        timeline,
        latestExplorationArticle,
        button,
        highlightDescription,
        highlightTitle,
    };
}
