import { KIND_DEFAULTS, type PageDefinition } from '../model/page';
import type { SiteDefinition } from '../model/site';
import { urlFor } from '../model/urls';

/**
 * The llms.txt projection — a markdown index of the site for LLM
 * consumption (https://llmstxt.org). Pages opt in via their kind.
 */

export function projectLlms(site: SiteDefinition, pages: PageDefinition[]): string {
    const included = pages.filter((page) => KIND_DEFAULTS[page.kind].llms);
    const articles = included.filter((page) => page.kind === 'article');
    const software = included.filter((page) => page.kind === 'software');

    const line = (page: PageDefinition): string =>
        `- [${page.title}](${urlFor(site, page.path, site.languages.main)}): ${page.description}`;

    const sections: string[] = [
        `# ${site.identity.name}`,
        '',
        `> ${site.voice.description}`,
        '',
        `${site.identity.name} (${site.identity.headline.toLowerCase()}) builds small apps and tools, and writes notes on software, AI agents, and owning your own stack. Articles are available in English and French (French under /fr/).`,
    ];
    if (articles.length > 0) {
        sections.push('', '## Articles', '', ...articles.map(line));
    }
    if (software.length > 0) {
        sections.push('', '## Experiments', '', ...software.map(line));
    }
    sections.push(
        '',
        '## Optional',
        '',
        `- [Photography](${site.address}/photographs): Photography portfolio`,
        ...(site.channels.feed ? [`- [RSS feed](${site.address}/feed.xml): Article feed`] : []),
        ...site.identity.profiles
            .filter((profile) => profile.includes('github.com'))
            .map((profile) => `- [GitHub](${profile}): Open-source work`),
        '',
    );
    return sections.join('\n');
}
