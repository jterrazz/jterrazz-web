import type { MetadataRoute } from 'next';

import {
    type PageProvider,
    projectLlms,
    projectRobots,
    projectSitemap,
    type SiteDefinition,
} from '../core/index';

/**
 * The Next.js adapter — thin glue from the projections to the App Router
 * conventions (`app/sitemap.ts`, `app/robots.ts`, route handlers). No
 * decisions here: everything is derived in core.
 */

/** `app/sitemap.ts`: `export default createSitemap(site, providers);` */
export function createSitemap(
    site: SiteDefinition,
    providers: PageProvider[],
): () => MetadataRoute.Sitemap {
    return () =>
        projectSitemap(
            site,
            providers.flatMap((provide) => provide()),
        );
}

/** `app/robots.ts`: `export default createRobots(site);` */
export function createRobots(site: SiteDefinition): () => MetadataRoute.Robots {
    return () => {
        const projection = projectRobots(site);
        return {
            rules: projection.rules.map((rule) => ({
                allow: rule.allow,
                disallow: rule.disallow,
                userAgent: rule.userAgent,
            })),
            sitemap: projection.sitemap,
        };
    };
}

/** `app/llms.txt/route.ts`: `export const GET = createLlms(site, providers);` */
export function createLlms(site: SiteDefinition, providers: PageProvider[]): () => Response {
    return () =>
        new Response(
            projectLlms(
                site,
                providers.flatMap((provide) => provide()),
            ),
            {
                headers: {
                    'Cache-Control': 'public, max-age=3600',
                    'Content-Type': 'text/plain; charset=utf-8',
                },
            },
        );
}
