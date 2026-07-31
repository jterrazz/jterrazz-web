// Domain
import { type Article, type ArticleAttestation } from '../../domain/article';
import {
    calculateReadingTimeMinutes,
    stripArticleMasthead,
} from '../../domain/utils/article-content';
import { buildArticleSlug } from '../../domain/utils/slugify';

/** How many suggestions the footer of a standalone article carries. */
const RELATED_ARTICLES_LIMIT = 3;

export interface ArticleTemplateViewModel {
    /** The signed proof, when this article carries one. */
    attestation?: ArticleAttestation;
    /** Markdown with the masthead removed — the page renders that itself. */
    body: string;
    /** Suggestions for the footer: the rest of the series, or a recent mix. */
    relatedArticles: Article[];
    /** Minutes, computed on the full source rather than the stripped body. */
    readingTimeMinutes: number;
    seriesName?: string;
    /** 1-based, and only meaningful when the article belongs to a series. */
    seriesPosition?: number;
    seriesTotal?: number;
    /** Sibling paths, already built — null at the ends of the run. */
    nextHref: null | string;
    prevHref: null | string;
}

const byPublishedAscending = (a: Article, b: Article): number =>
    new Date(a.metadata.datePublished).getTime() - new Date(b.metadata.datePublished).getTime();

const byPublishedDescending = (a: Article, b: Article): number => -byPublishedAscending(a, b);

const pathOf = (article: Article): string =>
    `/articles/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}`;

/** The article being read, matched by full slug or by its leading index. */
function findCurrent(articles: Article[], articleId: string): Article | undefined {
    return articles.find(
        (article) =>
            buildArticleSlug(article.publicIndex, article.metadata.title.en) === articleId ||
            String(article.publicIndex) === articleId.split('-')[0],
    );
}

/**
 * Outside a series there is no "next", so the footer suggests a spread instead:
 * the opening part of each series plus the standalones, most recent first. One
 * entry per series keeps a long run from crowding out everything else.
 */
function suggestionsFor(articles: Article[], current: Article | undefined): Article[] {
    const openings = new Map<string, Article>();
    const standalones: Article[] = [];

    for (const article of articles) {
        if (!article.published || article.publicIndex === current?.publicIndex) {
            continue;
        }
        const series = article.metadata.series;
        if (!series) {
            standalones.push(article);
            continue;
        }
        const opening = openings.get(series);
        if (!opening || byPublishedAscending(article, opening) < 0) {
            openings.set(series, article);
        }
    }

    return [...openings.values(), ...standalones]
        .sort(byPublishedDescending)
        .slice(0, RELATED_ARTICLES_LIMIT);
}

/**
 * Everything the article page needs that is derived rather than given —
 * series position, sibling links, suggestions, the stripped body.
 *
 * Lives here rather than in the template for the reason its sibling
 * `articles-list-template-view-model` does: a template that computes is a
 * template you can only exercise by rendering it.
 */
export function buildArticleTemplateViewModel(options: {
    articleId: string;
    articles: Article[];
    contentInMarkdown: string;
}): ArticleTemplateViewModel {
    const { articleId, articles, contentInMarkdown } = options;

    const current = findCurrent(articles, articleId);
    const seriesName = current?.metadata.series;

    const run = seriesName
        ? articles
              .filter((article) => article.metadata.series === seriesName)
              .sort(byPublishedAscending)
        : [];
    const index = run.findIndex(
        (article) => buildArticleSlug(article.publicIndex, article.metadata.title.en) === articleId,
    );

    const previous = index > 0 ? run[index - 1] : null;
    const next = index !== -1 && index < run.length - 1 ? run[index + 1] : null;

    const { body } = stripArticleMasthead(contentInMarkdown);

    return {
        ...(current?.attestation ? { attestation: current.attestation } : {}),
        body,
        nextHref: next ? pathOf(next) : null,
        prevHref: previous ? pathOf(previous) : null,
        readingTimeMinutes: calculateReadingTimeMinutes(contentInMarkdown),
        relatedArticles: seriesName ? run : suggestionsFor(articles, current),
        ...(seriesName ? { seriesName, seriesPosition: index + 1, seriesTotal: run.length } : {}),
    };
}
