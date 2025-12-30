import { SITE_CONFIG } from "../../config/site";
import { ExperimentContext } from "../../domain/experiment";

/**
 * SEO utility functions for building optimized metadata
 * Handles special formatting for 42 Paris school projects
 */

/**
 * Builds a SEO-optimized title with optional 42 suffix
 * Format: "{Title} | 42 | Jean-Baptiste Terrazzoni" for 42 projects
 * Format: "{Title} | Jean-Baptiste Terrazzoni" for other content
 */
export function buildSeoTitle(title: string, is42Related: boolean): string {
  if (is42Related) {
    return `${title} | 42 | ${SITE_CONFIG.author.name}`;
  }
  return `${title} | ${SITE_CONFIG.author.name}`;
}

/**
 * Builds a SEO-optimized description for experiments
 * Prepends "42 Paris school project: " for School42 context
 */
export function buildExperimentSeoDescription(
  description: string,
  context: ExperimentContext,
): string {
  if (context === ExperimentContext.School42) {
    return `42 Paris school project: ${description}`;
  }
  return description;
}

/**
 * Generates SEO keywords for experiments
 * Includes 42-specific keywords for School42 context
 */
export function buildExperimentSeoKeywords(
  experimentName: string,
  experimentDescription: string,
  context: ExperimentContext,
): string[] {
  const baseKeywords = [experimentName.toLowerCase()];

  // Extract key technical terms from description (simple extraction)
  const technicalTerms = extractTechnicalTerms(experimentDescription);
  baseKeywords.push(...technicalTerms);

  if (context === ExperimentContext.School42) {
    return [
      `42 ${experimentName.toLowerCase()}`,
      "42 paris",
      "42 school project",
      "42 project",
      ...baseKeywords,
    ];
  }

  return baseKeywords;
}

/**
 * Extracts simple technical terms from a description
 * Focuses on programming languages and key concepts
 * Uses word boundary matching to avoid false positives
 */
function extractTechnicalTerms(description: string): string[] {
  const terms: string[] = [];
  const lowerDesc = description.toLowerCase();

  // Common programming languages and tools with word boundary patterns
  const languages: Array<{ name: string; pattern: RegExp }> = [
    { name: "python", pattern: /\bpython\b/ },
    { name: "c", pattern: /\bc\b/ },
    { name: "assembly", pattern: /\bassembly\b/ },
    { name: "typescript", pattern: /\btypescript\b/ },
    { name: "javascript", pattern: /\bjavascript\b/ },
    { name: "rust", pattern: /\brust\b/ },
    { name: "go", pattern: /\bgo\b/ },
  ];

  for (const { name, pattern } of languages) {
    if (pattern.test(lowerDesc)) {
      terms.push(name);
    }
  }

  return terms;
}

/**
 * Checks if an experiment is from 42 Paris school
 */
export function is42Experiment(context: ExperimentContext): boolean {
  return context === ExperimentContext.School42;
}

/**
 * Article indices that are related to 42 school projects
 * These articles document 42 project implementations
 */
export const ARTICLES_42_RELATED_INDICES: number[] = [
  1, // Malloc
  2, // SHA256
  3, // NM Otool
  4, // Quine
  5, // Assembly
  6, // Expert System
];

/**
 * Checks if an article is related to 42 projects by its index
 */
export function is42RelatedArticle(publicIndex: number): boolean {
  return ARTICLES_42_RELATED_INDICES.includes(publicIndex);
}
