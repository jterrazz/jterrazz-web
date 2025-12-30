import { describe, expect, it } from "vitest";

import { ExperimentContext } from "../../../domain/experiment";

import {
  ARTICLES_42_RELATED_INDICES,
  buildExperimentSeoDescription,
  buildExperimentSeoKeywords,
  buildSeoTitle,
  is42Experiment,
  is42RelatedArticle,
} from "../seo-utils";

describe("buildSeoTitle", () => {
  it('should add "| 42 |" suffix for 42-related content', () => {
    const result = buildSeoTitle("Expert System", true);
    expect(result).toBe("Expert System | 42 | Jean-Baptiste Terrazzoni");
  });

  it("should use standard suffix for non-42 content", () => {
    const result = buildSeoTitle("Capitaine", false);
    expect(result).toBe("Capitaine | Jean-Baptiste Terrazzoni");
  });

  it("should handle empty title", () => {
    const result = buildSeoTitle("", true);
    expect(result).toBe(" | 42 | Jean-Baptiste Terrazzoni");
  });

  it("should handle title with special characters", () => {
    const result = buildSeoTitle("MD5 & SHA256", true);
    expect(result).toBe("MD5 & SHA256 | 42 | Jean-Baptiste Terrazzoni");
  });
});

describe("buildExperimentSeoDescription", () => {
  it('should prepend "42 Paris school project: " for School42 context', () => {
    const result = buildExperimentSeoDescription(
      "Backward chaining rule based system in Python.",
      ExperimentContext.School42,
    );
    expect(result).toBe("42 Paris school project: Backward chaining rule based system in Python.");
  });

  it("should return description unchanged for Personal context", () => {
    const result = buildExperimentSeoDescription(
      "A day to day copilot for your life.",
      ExperimentContext.Personal,
    );
    expect(result).toBe("A day to day copilot for your life.");
  });

  it("should return description unchanged for Professional context", () => {
    const result = buildExperimentSeoDescription(
      "Enterprise application.",
      ExperimentContext.Professional,
    );
    expect(result).toBe("Enterprise application.");
  });

  it("should return description unchanged for Hackathon context", () => {
    const result = buildExperimentSeoDescription("Hackathon project.", ExperimentContext.Hackathon);
    expect(result).toBe("Hackathon project.");
  });
});

describe("buildExperimentSeoKeywords", () => {
  it("should include 42-specific keywords for School42 context", () => {
    const result = buildExperimentSeoKeywords(
      "Expert System",
      "Backward chaining rule based system in Python.",
      ExperimentContext.School42,
    );

    expect(result).toContain("42 expert system");
    expect(result).toContain("42 paris");
    expect(result).toContain("42 school project");
    expect(result).toContain("42 project");
    expect(result).toContain("expert system");
    expect(result).toContain("python");
  });

  it("should not include 42 keywords for Personal context", () => {
    const result = buildExperimentSeoKeywords(
      "Capitaine",
      "A React Native application.",
      ExperimentContext.Personal,
    );

    expect(result).not.toContain("42 capitaine");
    expect(result).not.toContain("42 paris");
    expect(result).not.toContain("42 school project");
    expect(result).toContain("capitaine");
  });

  it("should extract programming languages from description", () => {
    const result = buildExperimentSeoKeywords(
      "Malloc",
      "C implementation of the malloc library using mmap.",
      ExperimentContext.School42,
    );

    expect(result).toContain("c");
  });

  it("should extract multiple programming languages", () => {
    const result = buildExperimentSeoKeywords(
      "Test Project",
      "Built with Python and TypeScript for testing.",
      ExperimentContext.Personal,
    );

    expect(result).toContain("python");
    expect(result).toContain("typescript");
  });

  it("should handle description without programming languages", () => {
    const result = buildExperimentSeoKeywords(
      "Simple App",
      "A simple application.",
      ExperimentContext.Personal,
    );

    expect(result).toContain("simple app");
    expect(result).not.toContain("python");
    expect(result).not.toContain("c");
  });
});

describe("is42Experiment", () => {
  it("should return true for School42 context", () => {
    expect(is42Experiment(ExperimentContext.School42)).toBe(true);
  });

  it("should return false for Personal context", () => {
    expect(is42Experiment(ExperimentContext.Personal)).toBe(false);
  });

  it("should return false for Professional context", () => {
    expect(is42Experiment(ExperimentContext.Professional)).toBe(false);
  });

  it("should return false for Hackathon context", () => {
    expect(is42Experiment(ExperimentContext.Hackathon)).toBe(false);
  });
});

describe("is42RelatedArticle", () => {
  it("should return true for article index 1 (Malloc)", () => {
    expect(is42RelatedArticle(1)).toBe(true);
  });

  it("should return true for article index 2 (SHA256)", () => {
    expect(is42RelatedArticle(2)).toBe(true);
  });

  it("should return true for article index 3 (NM Otool)", () => {
    expect(is42RelatedArticle(3)).toBe(true);
  });

  it("should return true for article index 4 (Quine)", () => {
    expect(is42RelatedArticle(4)).toBe(true);
  });

  it("should return true for article index 5 (Assembly)", () => {
    expect(is42RelatedArticle(5)).toBe(true);
  });

  it("should return true for article index 6 (Expert System)", () => {
    expect(is42RelatedArticle(6)).toBe(true);
  });

  it("should return false for article index 7 (Koa - not 42 related)", () => {
    expect(is42RelatedArticle(7)).toBe(false);
  });

  it("should return false for article index 13 (Fake News)", () => {
    expect(is42RelatedArticle(13)).toBe(false);
  });

  it("should return false for article index 20 (AI Levels)", () => {
    expect(is42RelatedArticle(20)).toBe(false);
  });

  it("should return false for non-existent article index", () => {
    expect(is42RelatedArticle(999)).toBe(false);
  });
});

describe("ARTICLES_42_RELATED_INDICES", () => {
  it("should contain exactly 6 article indices", () => {
    expect(ARTICLES_42_RELATED_INDICES).toHaveLength(6);
  });

  it("should contain indices 1-6", () => {
    expect(ARTICLES_42_RELATED_INDICES).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
