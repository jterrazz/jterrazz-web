import { describe, expect, it } from "vitest";

import { buildExperimentDetailJsonLd } from "../json-ld";

describe("buildExperimentDetailJsonLd", () => {
  it("should build basic JSON-LD for non-42 project", () => {
    const result = buildExperimentDetailJsonLd({
      codeRepository: "https://github.com/jterrazz/capitaine-mobile",
      description: "A day to day copilot for your life.",
      is42Project: false,
      name: "Capitaine",
      url: "https://jterrazz.com/experiments/capitaine",
      year: 2026,
    });

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("SoftwareSourceCode");
    expect(result.name).toBe("Capitaine");
    expect(result.description).toBe("A day to day copilot for your life.");
    expect(result.url).toBe("https://jterrazz.com/experiments/capitaine");
    expect(result.dateCreated).toBe("2026-01-01");
    expect(result.codeRepository).toBe("https://github.com/jterrazz/capitaine-mobile");
    expect(result.author).toEqual({
      "@type": "Person",
      name: "Jean-Baptiste Terrazzoni",
      url: "https://jterrazz.com",
    });
    expect(result).not.toHaveProperty("provider");
    expect(result).not.toHaveProperty("educationalLevel");
  });

  it("should build JSON-LD with LearningResource type for 42 project", () => {
    const result = buildExperimentDetailJsonLd({
      codeRepository: "https://github.com/jterrazz/42-expert-system",
      description: "Backward chaining rule based system in Python.",
      is42Project: true,
      name: "Expert System",
      url: "https://jterrazz.com/experiments/expert-system",
      year: 2019,
    });

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toEqual(["SoftwareSourceCode", "LearningResource"]);
    expect(result.name).toBe("Expert System");
    expect(result.description).toBe("Backward chaining rule based system in Python.");
    expect(result.dateCreated).toBe("2019-01-01");
    expect(result.educationalLevel).toBe("Advanced");
    expect(result.provider).toEqual({
      "@type": "EducationalOrganization",
      name: "42 Paris",
      url: "https://42.fr",
    });
  });

  it("should handle missing codeRepository", () => {
    const result = buildExperimentDetailJsonLd({
      codeRepository: undefined,
      description: "Some project.",
      is42Project: false,
      name: "Test",
      url: "https://jterrazz.com/experiments/test",
      year: 2024,
    });

    expect(result.codeRepository).toBeUndefined();
  });

  it("should include author information", () => {
    const result = buildExperimentDetailJsonLd({
      description: "Test project.",
      is42Project: false,
      name: "Test",
      url: "https://jterrazz.com/experiments/test",
      year: 2024,
    });

    expect(result.author).toBeDefined();
    expect(result.author["@type"]).toBe("Person");
    expect(result.author.name).toBe("Jean-Baptiste Terrazzoni");
  });

  it("should format year correctly in dateCreated", () => {
    const result = buildExperimentDetailJsonLd({
      description: "Test.",
      is42Project: false,
      name: "Test",
      url: "https://jterrazz.com/experiments/test",
      year: 2017,
    });

    expect(result.dateCreated).toBe("2017-01-01");
  });
});
