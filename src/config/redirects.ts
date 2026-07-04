/**
 * Redirect registry — the single source of truth for every URL this site
 * promises to keep working.
 *
 * Consumed by:
 * - `next.config.ts` → served as real HTTP redirects
 * - `tests/e2e/redirects.e2e.test.ts` → each rule is exercised against the
 *   production build, so a broken promise fails CI
 *
 * Add new rules here only. Never edit `next.config.ts` redirects directly.
 */

export type RedirectKind =
    /** Stable short links we advertise externally (business cards, bios…) */
    | 'canonical'
    /** Old article URLs from the pre-Next era — kept alive forever */
    | 'i18n-article'
    /** Old /link/* and misc URLs from previous site structures */
    | 'legacy-article'
    /** Renamed experiments */
    | 'legacy-experiment'
    /** Old /articles/:slug/:lang structure → i18n prefix structure */
    | 'legacy-external';

export type RedirectRule = {
    destination: string;
    kind: RedirectKind;
    permanent: boolean;
    source: string;
};

export const REDIRECTS: RedirectRule[] = [
    // ------------------------------------------------------------------
    // Canonical short links (/go/*) — advertised externally, never break
    // ------------------------------------------------------------------
    {
        destination: 'https://medium.com/@jterrazz',
        kind: 'canonical',
        permanent: false,
        source: '/go/blog',
    },
    {
        destination: 'https://www.pexels.com/@jterrazz',
        kind: 'canonical',
        permanent: false,
        source: '/go/photos',
    },
    {
        destination: 'https://devpost.com/jterrazz',
        kind: 'canonical',
        permanent: false,
        source: '/go/hackathons',
    },
    {
        destination: 'https://gravatar.com/noisilywerewolffa1df1a9cc',
        kind: 'canonical',
        permanent: false,
        source: '/go/contact',
    },
    {
        destination: '/go/signews',
        kind: 'canonical',
        permanent: false,
        source: '/go/n00',
    },
    {
        destination: '/experiments/capitaine',
        kind: 'canonical',
        permanent: false,
        source: '/go/capitaine',
    },

    // ------------------------------------------------------------------
    // Renamed experiments
    // ------------------------------------------------------------------
    {
        destination: '/experiments/signews',
        kind: 'legacy-experiment',
        permanent: true,
        source: '/experiments/n00',
    },
    {
        destination: '/fr/experiments/signews',
        kind: 'legacy-experiment',
        permanent: true,
        source: '/fr/experiments/n00',
    },

    // ------------------------------------------------------------------
    // Legacy external redirects (old URLs kept working)
    // ------------------------------------------------------------------
    {
        destination: '/go/blog',
        kind: 'legacy-external',
        permanent: true,
        source: '/link/articles',
    },
    {
        destination: '/go/photos',
        kind: 'legacy-external',
        permanent: true,
        source: '/link/photographs',
    },
    {
        destination: '/go/hackathons',
        kind: 'legacy-external',
        permanent: true,
        source: '/link/hackathons',
    },
    {
        destination: '/go/contact',
        kind: 'legacy-external',
        permanent: true,
        source: '/contact',
    },
    {
        destination: '/go/n00',
        kind: 'legacy-external',
        permanent: true,
        source: '/link/applications/n00',
    },
    {
        destination: '/go/n00',
        kind: 'legacy-external',
        permanent: true,
        source: '/link/applications/fake-news',
    },

    // ------------------------------------------------------------------
    // Old article language suffixes (/articles/:slug/:lang → i18n prefix)
    // ------------------------------------------------------------------
    {
        destination: '/articles/:slugId',
        kind: 'i18n-article',
        permanent: true,
        source: '/articles/:slugId/en',
    },
    {
        destination: '/fr/articles/:slugId',
        kind: 'i18n-article',
        permanent: true,
        source: '/articles/:slugId/fr',
    },

    // ------------------------------------------------------------------
    // Pre-Next article slugs — indexed by search engines, kept forever
    // ------------------------------------------------------------------
    {
        destination: '/articles/7',
        kind: 'legacy-article',
        permanent: true,
        source: '/learn-to-build-a-simple-yet-powerful-web-server-with-typescript-and-koa',
    },
    {
        destination: '/articles/6',
        kind: 'legacy-article',
        permanent: true,
        source: '/expert-systems-how-to-implement-a-backward-chaining-resolver-in-python',
    },
    {
        destination: '/articles/5',
        kind: 'legacy-article',
        permanent: true,
        source: '/quickly-code-your-first-assembly-functions',
    },
    {
        destination: '/articles/4',
        kind: 'legacy-article',
        permanent: true,
        source: '/build-a-self-replicating-program-quine',
    },
    {
        destination: '/articles/3',
        kind: 'legacy-article',
        permanent: true,
        source: '/everything-you-need-to-build-your-own-nm-and-otool',
    },
    {
        destination: '/articles/2',
        kind: 'legacy-article',
        permanent: true,
        source: '/mastering-hash-functions-in-c-sha-256-and-md5-demystified',
    },
    {
        destination: '/articles/1',
        kind: 'legacy-article',
        permanent: true,
        source: '/master-memory-management-create-your-own-malloc-library-from-scratch',
    },
];

/**
 * Smart device-routing links served by `src/app/go/[slug]/page.tsx`.
 * Each slug must resolve for every platform — exercised by the E2E suite.
 */
export const GO_APP_LINKS = [
    {
        android: 'play.google.com',
        desktop: '/experiments/signews',
        ios: 'apps.apple.com',
        slug: 'signews',
    },
] as const;
