import { type ContentLink } from "../../domain/content-link";

/**
 * Single source of truth for article-experiment relationships.
 * Maps article publicIndex to experiment slug.
 */
const CONTENT_LINKS: ContentLink[] = [
  { articleIndex: 1, experimentSlug: "malloc" },
  { articleIndex: 2, experimentSlug: "md5-sha256" },
  { articleIndex: 3, experimentSlug: "nm-otool" },
  { articleIndex: 4, experimentSlug: "dr-quine" },
  { articleIndex: 5, experimentSlug: "libft-asm" },
  { articleIndex: 6, experimentSlug: "expert-system" },
  { articleIndex: 13, experimentSlug: "n00" },
];

export const contentLinksRepository = {
  /**
   * Get all content links
   */
  getAll: (): ContentLink[] => CONTENT_LINKS,

  /**
   * Get the experiment slug linked to an article
   */
  getExperimentSlugForArticle: (articleIndex: number): string | undefined => {
    const link = CONTENT_LINKS.find((l) => l.articleIndex === articleIndex);
    return link?.experimentSlug;
  },

  /**
   * Get the article index linked to an experiment
   */
  getArticleIndexForExperiment: (experimentSlug: string): number | undefined => {
    const link = CONTENT_LINKS.find((l) => l.experimentSlug === experimentSlug);
    return link?.articleIndex;
  },

  /**
   * Check if an article has a linked experiment
   */
  hasExperimentLink: (articleIndex: number): boolean => {
    return CONTENT_LINKS.some((l) => l.articleIndex === articleIndex);
  },

  /**
   * Check if an experiment has a linked article
   */
  hasArticleLink: (experimentSlug: string): boolean => {
    return CONTENT_LINKS.some((l) => l.experimentSlug === experimentSlug);
  },
};
