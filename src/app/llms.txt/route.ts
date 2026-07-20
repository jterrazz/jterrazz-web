import { SITE_CONFIG } from '../../config/site';
import { buildArticleSlug } from '../../domain/utils/slugify';
import { articlesRepository } from '../../infrastructure/repositories/articles.repository';
import { experimentsRepository } from '../../infrastructure/repositories/experiments.repository';

// The index is fully derivable from the repositories at build time.
export const dynamic = 'force-static';

/**
 * The llms.txt endpoint — a markdown index of the site for LLM consumption.
 * Spec: https://llmstxt.org
 */
export function GET(): Response {
    const baseUrl = SITE_CONFIG.baseUrl;

    const articles = articlesRepository
        .getAll()
        .filter((article) => article.published && article.content.en)
        .sort(
            (a, b) =>
                new Date(b.metadata.datePublished).getTime() -
                new Date(a.metadata.datePublished).getTime(),
        );

    const articleLines = articles.map((article) => {
        const url = `${baseUrl}/articles/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}`;
        return `- [${article.metadata.title.en}](${url}): ${article.metadata.description.en}`;
    });

    const experimentLines = experimentsRepository.getAll().map((experiment) => {
        return `- [${experiment.name}](${baseUrl}/experiments/${experiment.slug}): ${experiment.description}`;
    });

    const body = [
        `# ${SITE_CONFIG.author.name}`,
        '',
        `> ${SITE_CONFIG.description}`,
        '',
        `${SITE_CONFIG.author.name} (problem solver, mostly with code) builds small apps and tools, and writes notes on software, AI agents, and owning your own stack. Articles are available in English and French (French under /fr/).`,
        '',
        '## Articles',
        '',
        ...articleLines,
        '',
        '## Experiments',
        '',
        ...experimentLines,
        '',
        '## Optional',
        '',
        `- [Photography](${baseUrl}/photographs): Photography portfolio`,
        `- [RSS feed](${baseUrl}/feed.xml): Article feed`,
        `- [GitHub](${SITE_CONFIG.social.github}): Open-source work`,
        '',
    ].join('\n');

    return new Response(body, {
        headers: {
            'Cache-Control': 'public, max-age=3600',
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}
