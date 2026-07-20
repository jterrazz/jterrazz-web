import { page, type PageProvider } from '@jterrazz/reach';

import { site } from '../../../reach.config';
import { buildArticleSlug } from '../../domain/utils/slugify';
import { locales } from '../../i18n/config';
import { articlesRepository } from '../repositories/articles.repository';
import { experimentsRepository } from '../repositories/experiments.repository';

/**
 * The page providers — the app's content sources enumerated as page
 * declarations. This is the only bridge between the repositories and the
 * reach projections; the package never reads content itself.
 */

export const mainPagesProvider: PageProvider = () => [
    page({
        description: site.voice.description,
        kind: 'home',
        locales: [...locales],
        path: '',
        title: site.identity.name,
    }),
    page({
        description: 'Articles',
        kind: 'collection',
        locales: [...locales],
        path: '/articles',
        title: 'Articles',
    }),
    page({
        description: 'Experiments',
        kind: 'collection',
        locales: [...locales],
        path: '/experiments',
        title: 'Experiments',
    }),
    page({
        description: 'Photographs',
        kind: 'gallery',
        locales: [...locales],
        path: '/photographs',
        title: 'Photographs',
    }),
];

export const articlesProvider: PageProvider = () =>
    articlesRepository
        .getAll()
        .filter((article) => article.published)
        .map((article) =>
            page({
                dates: {
                    modified: article.metadata.dateModified,
                    published: article.metadata.datePublished,
                },
                description: article.metadata.description.en,
                image: article.imageUrl,
                kind: 'article',
                locales: Object.keys(article.content).filter((language) =>
                    locales.includes(language as (typeof locales)[number]),
                ),
                path: `/articles/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}`,
                title: article.metadata.title.en,
            }),
        );

export const experimentsProvider: PageProvider = () =>
    experimentsRepository.getAll().map((experiment) =>
        page({
            description: experiment.description,
            kind: 'software',
            locales: [...locales],
            path: `/experiments/${experiment.slug}`,
            title: experiment.name,
        }),
    );
