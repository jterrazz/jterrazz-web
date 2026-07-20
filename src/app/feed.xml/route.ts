import { SITE_CONFIG } from '../../config/site';
import { buildArticleSlug } from '../../domain/utils/slugify';
import { articlesRepository } from '../../infrastructure/repositories/articles.repository';

// The feed is fully derivable from the article repository at build time.
export const dynamic = 'force-static';

function escapeXml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;');
}

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

    const items = articles
        .map((article) => {
            const url = `${baseUrl}/articles/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}`;
            return [
                '        <item>',
                `            <title>${escapeXml(article.metadata.title.en)}</title>`,
                `            <link>${escapeXml(url)}</link>`,
                `            <guid isPermaLink="true">${escapeXml(url)}</guid>`,
                `            <pubDate>${new Date(article.metadata.datePublished).toUTCString()}</pubDate>`,
                `            <description>${escapeXml(article.metadata.description.en)}</description>`,
                `            <author>contact@jterrazz.com (${escapeXml(SITE_CONFIG.author.name)})</author>`,
                '        </item>',
            ].join('\n');
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${escapeXml(`Articles by ${SITE_CONFIG.author.name}`)}</title>
        <link>${escapeXml(`${baseUrl}/articles`)}</link>
        <description>${escapeXml(SITE_CONFIG.description)}</description>
        <language>en</language>
        <atom:link href="${escapeXml(`${baseUrl}/feed.xml`)}" rel="self" type="application/rss+xml"/>
${items}
    </channel>
</rss>
`;

    return new Response(xml, {
        headers: {
            'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
            'Content-Type': 'application/rss+xml; charset=utf-8',
        },
    });
}
