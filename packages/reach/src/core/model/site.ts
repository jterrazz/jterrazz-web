/**
 * The site model — the single declaration every surface projects from.
 *
 * The model speaks the language of INTENT (identity, sharing, discovery);
 * the projections speak the language of standards (Open Graph, JSON-LD,
 * sitemap.xml). Implementation vocabulary never leaks up here.
 */

/** The person behind the site — one canonical identity, referenced everywhere. */
export interface Person {
    /** Contact email, published in the identity graph. */
    contact?: string;
    /** What the person says they do — for humans (titles, cards). */
    headline: string;
    kind: 'person';
    name: string;
    /** What the person factually does — for machines (schema jobTitle). */
    occupation: string;
    /** Square portrait path, the identity image. */
    portrait?: string;
    /** Every public profile URL (GitHub, LinkedIn, …) — consolidates identity. */
    profiles: string[];
    /** Topics the person demonstrably knows. */
    topics?: string[];
}

/** Locale configuration — what exists, what leads, how URLs carry it. */
export interface Languages {
    /** Every locale the site genuinely serves. */
    all: string[];
    /** The fallback locale — x-default resolves here. */
    main: string;
    /** Whether the main locale is path-prefixed (`/en/...`). Default false. */
    prefixMain?: boolean;
}

/** How links to the site look when shared — projected as Open Graph / Twitter Card. */
export interface SharingCard {
    /** Accessible description of the card image. */
    caption: string;
    /** Card image path — must really be `width`×`height`. */
    image: string;
    height: number;
    width: number;
}

/** What crawlers may reach — projected as robots.txt. */
export interface Discovery {
    /** AI crawlers policy: 'welcome' leaves them unblocked (GEO), 'blocked' shuts them out. */
    aiCrawlers: 'blocked' | 'welcome';
    /** Path prefixes hidden from all crawlers (`/api/`, redirect endpoints…). */
    hidden: string[];
}

/** The standards-as-products the site publishes. */
export interface Channels {
    /** RSS feed of the articles. */
    feed: boolean;
    /** Llms.txt markdown index for AI consumption. */
    llms: boolean;
}

/** The site's editorial voice — brand, title shape, default description. */
export interface Voice {
    brand: string;
    /** The default description — homepage, identity graph, llms.txt intro. */
    description: string;
    /** Title pattern, `%s` replaced by the page title. */
    titlePattern: string;
}

export interface SiteDefinition {
    /** THE canonical origin — one host, no trailing slash. Everything derives from it. */
    address: string;
    channels: Channels;
    discovery: Discovery;
    identity: Person;
    languages: Languages;
    sharing: { card: SharingCard };
    voice: Voice;
}

/** Declare the canonical person identity. */
export function person(options: Omit<Person, 'kind'>): Person {
    return { kind: 'person', ...options };
}

/** Declare the site — the one source every projection reads. */
export function defineSite(definition: SiteDefinition): SiteDefinition {
    return definition;
}
