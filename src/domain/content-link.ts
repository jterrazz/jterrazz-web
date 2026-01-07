/**
 * Represents a link between an article and an experiment.
 * This is the domain type for content relationships.
 */
export type ContentLink = {
  articleIndex: number;
  experimentSlug: string;
};
