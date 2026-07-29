import { type Article, ArticleCategory } from '../../../src/domain/article';
import { type Photograph } from '../../../src/domain/photograph';
import { buildArticleSlug } from '../../../src/domain/utils/slugify';
import { articlesRepository } from '../../../src/infrastructure/repositories/articles.repository';
import { photographsRepository } from '../../../src/infrastructure/repositories/photographs.repository';

/**
 * The subjects the journeys run against, derived from the repositories rather
 * than pinned to slugs. Content is added and retitled constantly; a journey
 * naming an article would rot into a maintenance tax, and a skipped journey
 * is worse than none.
 *
 * These say WHICH content to walk. What the site must then do with it stays
 * in the journey — nothing here reimplements a page's logic.
 */

const published = (): Article[] =>
    articlesRepository.getAll().filter((article) => article.published);

/** The path a reader lands on for an article, in the default locale. */
export const pathOf = (article: Article): string =>
    `/articles/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}`;

/** The most recently modified published article — the likeliest deep-link target. */
export function latestArticle(): Article {
    const [article] = published();
    if (!article) {
        throw new Error('no published article to walk');
    }
    return article;
}

/**
 * An article that exists in both locales. The locale journey has to run on one
 * of these: an untranslated article renders under /fr but canonicalises back to
 * english on purpose, so walking one would assert the fallback and call it a bug.
 */
export function translatedArticle(): Article {
    const article = published().find((candidate) => candidate.content.en && candidate.content.fr);
    if (!article) {
        throw new Error('no article translated into french to walk');
    }
    return article;
}

/** An article with no french source — the subject of the fallback rule. */
export function untranslatedArticle(): Article {
    const article = published().find((candidate) => candidate.content.en && !candidate.content.fr);
    if (!article) {
        throw new Error('every article is translated — the fallback rule is unobservable');
    }
    return article;
}

/**
 * A series of at least two, in the reading order the article page itself uses
 * (publication date ascending). The longest one, so prev/next exists on both
 * sides of the second entry.
 */
export function seriesRun(): Article[] {
    const bySeries = new Map<string, Article[]>();
    for (const article of published()) {
        const series = article.metadata.series;
        if (series) {
            bySeries.set(series, [...(bySeries.get(series) ?? []), article]);
        }
    }
    const longest = [...bySeries.values()].sort((a, b) => b.length - a.length)[0];
    if (!longest || longest.length < 2) {
        throw new Error('no series of two or more to walk');
    }
    return [...longest].sort(
        (a, b) =>
            new Date(a.metadata.datePublished).getTime() -
            new Date(b.metadata.datePublished).getTime(),
    );
}

/** An article carrying a signed attestation — the subject of the proof journey. */
export function attestedArticle(): Article {
    const article = published().find((candidate) => candidate.attestation);
    if (!article) {
        throw new Error('no attested article to walk');
    }
    return article;
}

/**
 * One article per category, both outside every series. The discovery journey
 * asserts that filtering keeps one and drops the other, so a title that also
 * surfaces through a series card would make the negative assertion lie.
 */
export function standaloneByCategory(): Record<'exploration' | 'reflection', Article> {
    const standalone = (category: ArticleCategory): Article => {
        const article = published().find(
            (candidate) => candidate.metadata.category === category && !candidate.metadata.series,
        );
        if (!article) {
            throw new Error(`no standalone ${category} article to walk`);
        }
        return article;
    };
    return {
        exploration: standalone(ArticleCategory.Exploration),
        reflection: standalone(ArticleCategory.Reflection),
    };
}

/** The first two photographs, in the order the gallery lays them out. */
export function firstPhotographs(): [Photograph, Photograph] {
    const [first, second] = photographsRepository.getAll();
    if (!first || !second) {
        throw new Error('need two photographs to walk the lightbox');
    }
    return [first, second];
}
