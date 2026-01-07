import { describe, expect, it } from "vitest";

import { __test__, ArticleCategory, createArticle, type RawArticleInput } from "../article";

const { capitalizeFirst, sanitizeEmDashes, sanitizeTitle, sanitizeContent } = __test__;

describe("capitalizeFirst", () => {
  it("should capitalize first letter and preserve rest", () => {
    expect(capitalizeFirst("a guide to the AI revolution")).toBe("A guide to the AI revolution");
  });

  it("should preserve capitalization after colon", () => {
    expect(capitalizeFirst("cursor: The Compression Of Mechanical Work")).toBe(
      "Cursor: The Compression Of Mechanical Work",
    );
  });

  it("should handle multiple colons", () => {
    expect(capitalizeFirst("first Part: Second Part: Third Part")).toBe(
      "First Part: Second Part: Third Part",
    );
  });

  it("should handle single word", () => {
    expect(capitalizeFirst("hello")).toBe("Hello");
  });

  it("should handle empty string", () => {
    expect(capitalizeFirst("")).toBe("");
  });

  it("should handle already capitalized text", () => {
    expect(capitalizeFirst("Already Capitalized")).toBe("Already Capitalized");
  });

  it("should preserve acronyms like AI", () => {
    expect(capitalizeFirst("the AI revolution")).toBe("The AI revolution");
  });

  it("should handle colon at end", () => {
    expect(capitalizeFirst("a title:")).toBe("A title:");
  });
});

describe("sanitizeEmDashes", () => {
  it("should replace em dash with comma and space", () => {
    expect(sanitizeEmDashes("Hello—World")).toBe("Hello, World");
  });

  it("should replace multiple em dashes", () => {
    expect(sanitizeEmDashes("One—Two—Three")).toBe("One, Two, Three");
  });

  it("should handle text without em dashes", () => {
    expect(sanitizeEmDashes("No dashes here")).toBe("No dashes here");
  });

  it("should handle empty string", () => {
    expect(sanitizeEmDashes("")).toBe("");
  });

  it("should not replace regular hyphens", () => {
    expect(sanitizeEmDashes("well-known")).toBe("well-known");
  });

  it("should also replace en dashes", () => {
    expect(sanitizeEmDashes("2020–2024")).toBe("2020, 2024");
  });

  it("should handle dashes with surrounding whitespace", () => {
    expect(sanitizeEmDashes("word — word")).toBe("word, word");
    expect(sanitizeEmDashes("word – word")).toBe("word, word");
  });
});

describe("sanitizeTitle", () => {
  it("should apply capitalize first and em dash replacement", () => {
    expect(sanitizeTitle("a Super—Title")).toBe("A Super, Title");
  });

  it("should handle title with colon and em dash", () => {
    expect(sanitizeTitle("part One—Intro: part Two—Details")).toBe(
      "Part One, Intro: Part Two, Details",
    );
  });

  it("should handle empty string", () => {
    expect(sanitizeTitle("")).toBe("");
  });

  it("should preserve AI and other acronyms", () => {
    expect(sanitizeTitle("a guide to the AI revolution")).toBe("A guide to the AI revolution");
  });
});

describe("sanitizeContent", () => {
  it("should replace em dashes in content", () => {
    expect(sanitizeContent("This is—content with—dashes")).toBe("This is, content with, dashes");
  });

  it("should not apply sentence case", () => {
    expect(sanitizeContent("This Is Title Case Content")).toBe("This Is Title Case Content");
  });

  it("should handle empty string", () => {
    expect(sanitizeContent("")).toBe("");
  });
});

describe("createArticle", () => {
  const baseInput: RawArticleInput = {
    content: {
      en: "Some content—with dashes",
      fr: "Du contenu—avec tirets",
    },
    imageUrl: "/image.jpg",
    metadata: {
      category: ArticleCategory.Reflection,
      dateModified: "2024-01-01",
      datePublished: "2024-01-01",
      description: {
        en: "A Description—Here",
        fr: "Une Description—Ici",
      },
      tagline: {
        en: "A Tagline—Here",
        fr: "Un Slogan—Ici",
      },
      title: {
        en: "A Super Title—Here",
        fr: "Un Super Titre—Ici",
      },
    },
    publicIndex: 1,
    published: true,
  };

  it("should sanitize titles with capitalize first and em dash replacement", () => {
    const article = createArticle(baseInput);
    expect(article.metadata.title.en).toBe("A Super Title, Here");
    expect(article.metadata.title.fr).toBe("Un Super Titre, Ici");
  });

  it("should sanitize descriptions with em dash replacement only", () => {
    const article = createArticle(baseInput);
    expect(article.metadata.description.en).toBe("A Description, Here");
    expect(article.metadata.description.fr).toBe("Une Description, Ici");
  });

  it("should sanitize content with em dash replacement only", () => {
    const article = createArticle(baseInput);
    expect(article.content.en).toBe("Some content, with dashes");
    expect(article.content.fr).toBe("Du contenu, avec tirets");
  });

  it("should preserve other fields unchanged", () => {
    const article = createArticle(baseInput);
    expect(article.imageUrl).toBe("/image.jpg");
    expect(article.publicIndex).toBe(1);
    expect(article.published).toBe(true);
    expect(article.metadata.category).toBe(ArticleCategory.Reflection);
  });

  it("should preserve AI and other acronyms in titles", () => {
    const input: RawArticleInput = {
      ...baseInput,
      metadata: {
        ...baseInput.metadata,
        title: {
          en: "A guide to the AI revolution",
          fr: "Guide de la révolution IA",
        },
      },
    };
    const article = createArticle(input);
    expect(article.metadata.title.en).toBe("A guide to the AI revolution");
    expect(article.metadata.title.fr).toBe("Guide de la révolution IA");
  });
});
