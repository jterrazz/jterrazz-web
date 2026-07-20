import type { SiteDefinition } from '../model/site';

/**
 * JSON-LD projection — the identity graph. One Person entity with a stable
 * @id, one WebSite publishing it, rendered once per page from the layout.
 * Standards vocabulary (schema.org) lives here, never in the model.
 */

export function personId(site: SiteDefinition): string {
    return `${site.address}/#person`;
}

export function websiteId(site: SiteDefinition): string {
    return `${site.address}/#website`;
}

/** The Person reference used by authored content (articles, images). */
export function projectAuthorRef(site: SiteDefinition) {
    return {
        '@id': personId(site),
        '@type': 'Person' as const,
        name: site.identity.name,
        url: site.address,
    };
}

/** The full canonical Person entity. */
export function projectPerson(site: SiteDefinition) {
    const { identity } = site;
    return {
        '@id': personId(site),
        '@type': 'Person',
        description: site.voice.description,
        ...(identity.contact ? { email: `mailto:${identity.contact}` } : {}),
        ...(identity.portrait ? { image: `${site.address}${identity.portrait}` } : {}),
        jobTitle: identity.occupation,
        ...(identity.topics ? { knowsAbout: identity.topics } : {}),
        name: identity.name,
        sameAs: identity.profiles,
        url: site.address,
    };
}

/** The WebSite entity, published by the Person. */
export function projectWebSite(site: SiteDefinition) {
    return {
        '@id': websiteId(site),
        '@type': 'WebSite',
        description: site.voice.description,
        inLanguage: site.languages.all,
        name: site.identity.name,
        publisher: { '@id': personId(site) },
        url: site.address,
    };
}

/** The site-wide identity graph — rendered once, in the root layout. */
export function projectIdentityGraph(site: SiteDefinition) {
    return {
        '@context': 'https://schema.org',
        '@graph': [projectWebSite(site), projectPerson(site)],
    };
}
