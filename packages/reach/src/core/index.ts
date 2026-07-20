// The model — the language of intent
export {
    type Channels,
    defineSite,
    type Discovery,
    type Languages,
    person,
    type Person,
    type SharingCard,
    type SiteDefinition,
    type Voice,
} from './model/site';
export {
    KIND_DEFAULTS,
    page,
    type PageDates,
    type PageDefinition,
    type PageKind,
    type PageProvider,
} from './model/page';
export { alternatesFor, urlFor } from './model/urls';

// The projections — the language of standards
export {
    personId,
    projectAuthorRef,
    projectIdentityGraph,
    projectPerson,
    projectWebSite,
    websiteId,
} from './projections/json-ld';
export { projectLlms } from './projections/llms';
export { projectRobots, type RobotsProjection } from './projections/robots';
export { projectSitemap, type SitemapEntry } from './projections/sitemap';
