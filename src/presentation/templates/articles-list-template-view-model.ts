// Domain
import { type Article, type ArticleLanguage } from "../../domain/article";
import { UserContactType } from "../../domain/user";
import { buildArticleSlug } from "../../domain/utils/slugify";

// Infrastructure
import { type Locale } from "../../i18n/config";
import { contentLinksRepository } from "../../infrastructure/repositories/content-links.repository";
import { userRepository } from "../../infrastructure/repositories/user.repository";

export interface ArticleRowViewModel {
  category: string;
  description: string;
  experimentSlug?: string;
  imageUrl: string;
  slug: string;
  tagline: string;
  title: string;
  datePublished: string;
  readingTime: string;
}

export interface ArticlesListButton {
  href: string;
  text: string;
}

export interface ArticleSeriesViewModel {
  seriesTitle: string;
  featuredArticle: ArticleRowViewModel;
  relatedArticles: ArticleRowViewModel[];
}

export interface ArticlesListViewModel {
  series: ArticleSeriesViewModel[];
  standaloneArticles: ArticleRowViewModel[];
  latestExplorationArticle: ArticleRowViewModel | null;
  button: ArticlesListButton;
  highlightDescription: string;
  highlightTitle: string;
}

export interface ViewModel<T> {
  getViewModel: () => T;
}

export class ArticlesListViewModelImpl implements ViewModel<ArticlesListViewModel> {
  constructor(
    private readonly articles: Article[],
    private readonly highlightTitle: string,
    private readonly highlightDescription: string,
    private readonly locale: Locale = "en",
    private readonly viewMediumText: string = "View Medium",
  ) {}

  getViewModel(): ArticlesListViewModel {
    const button = {
      href: userRepository.getContact(UserContactType.Medium).url.toString(),
      text: this.viewMediumText,
    };

    const publishedArticles = this.articles
      .filter((article) => article.published)
      .sort(
        (a, b) =>
          new Date(b.metadata.datePublished).getTime() -
          new Date(a.metadata.datePublished).getTime(),
      );

    // Helper to check if an article is one of the "Latest" features
    // Note: These variables are used in logic but we need to define them before use or restructure.
    // Actually, we refactored the logic below to avoid circular dependency on these vars.
    // We can remove this helper block as it is no longer used in the new flow.

    // Group articles by series (Using the "Series takes priority" logic)
    // We only exclude an article from Series if it is NOT in a series.
    // If it IS in a series, it stays in the series, and we pick another one for "Latest" if needed.
    // HOWEVER, the requirement is: "latest article must not be one in the serie or application"
    // AND "serie thing takes the priority"

    // Correct Logic:
    // 1. Separate Series vs Standalone
    // 2. "Latest" must come from Standalone only.

    const seriesMap = new Map<string, Article[]>();
    const potentialStandaloneArticles: Article[] = [];

    for (const article of publishedArticles) {
      const seriesName = article.metadata.series;
      if (seriesName) {
        if (!seriesMap.has(seriesName)) {
          seriesMap.set(seriesName, []);
        }
        seriesMap.get(seriesName)?.push(article);
      } else {
        potentialStandaloneArticles.push(article);
      }
    }

    // Now pick Latest from Standalone
    const standaloneSorted = potentialStandaloneArticles.sort(
      (a, b) =>
        new Date(b.metadata.datePublished).getTime() - new Date(a.metadata.datePublished).getTime(),
    );

    // Latest Exploration (Standalone Exploration category)
    const standaloneExplorations = standaloneSorted.filter(
      (a) => a.metadata.category === "exploration",
    );
    const latestExplorationRawFinal =
      standaloneExplorations.length > 0 ? standaloneExplorations[0] : null;

    // Final Standalone list (excluding the featured one)
    const finalStandaloneArticles = standaloneSorted.filter(
      (a) => a.publicIndex !== latestExplorationRawFinal?.publicIndex,
    );

    // Map to View Models
    const latestExplorationArticle = latestExplorationRawFinal
      ? this.mapToViewModel(latestExplorationRawFinal)
      : null;

    // Convert series to view models
    const series: ArticleSeriesViewModel[] = [];
    seriesMap.forEach((articles, seriesTitle) => {
      if (articles.length > 1) {
        // Only create series for multiple articles
        const sortedSeriesArticles = articles.sort(
          (a, b) =>
            new Date(a.metadata.datePublished).getTime() -
            new Date(b.metadata.datePublished).getTime(),
        );

        const featuredArticle = this.mapToViewModel(sortedSeriesArticles[0]);
        const relatedArticles = sortedSeriesArticles
          .slice(1)
          .map((article) => this.mapToViewModel(article));

        series.push({
          seriesTitle,
          featuredArticle,
          relatedArticles,
        });
      } else {
        // This should ideally not happen given our data, but if it does,
        // single items go back to standalone (if we hadn't already filtered them)
        // For now, let's just map them to series to avoid losing them, or ignore if strict.
        // Given the logic, let's assume series are valid.
      }
    });

    // Sort series by custom order, then by date of the most recent article
    const seriesOrder = ["Abundant Intelligence", "Using AI", "Application Design"];
    series.sort((a, b) => {
      const aOrder = seriesOrder.indexOf(a.seriesTitle);
      const bOrder = seriesOrder.indexOf(b.seriesTitle);

      // If both are in the custom order, use that order
      if (aOrder !== -1 && bOrder !== -1) {
        return aOrder - bOrder;
      }
      // If only one is in the custom order, it comes first
      if (aOrder !== -1) return -1;
      if (bOrder !== -1) return 1;

      // Otherwise, sort by date
      const aLatestDate = Math.max(
        new Date(a.featuredArticle.datePublished).getTime(),
        ...a.relatedArticles.map((article) => new Date(article.datePublished).getTime()),
      );
      const bLatestDate = Math.max(
        new Date(b.featuredArticle.datePublished).getTime(),
        ...b.relatedArticles.map((article) => new Date(article.datePublished).getTime()),
      );
      return bLatestDate - aLatestDate;
    });

    return {
      series,
      standaloneArticles: finalStandaloneArticles.map((article) => this.mapToViewModel(article)),
      latestExplorationArticle,
      button,
      highlightDescription: this.highlightDescription,
      highlightTitle: this.highlightTitle,
    };
  }

  private calculateReadingTime(content: string): string {
    const wordsPerMinute = 225; // Standard average reading speed
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${Math.max(minutes, 1)} min read`;
  }

  private mapToViewModel(article: Article): ArticleRowViewModel {
    const lang = this.locale as ArticleLanguage;
    const content = article.content[lang] || article.content.en || "";
    const title = article.metadata.title[this.locale] ?? article.metadata.title.en;
    const description =
      article.metadata.description[this.locale] ?? article.metadata.description.en;
    const tagline = article.metadata.tagline[this.locale] ?? article.metadata.tagline.en;

    // Date locale mapping
    const dateLocaleMap: Record<Locale, string> = {
      en: "en-US",
      fr: "fr-FR",
    };

    return {
      category: article.metadata.category,
      description,
      experimentSlug: contentLinksRepository.getExperimentSlugForArticle(article.publicIndex),
      imageUrl: article.imageUrl,
      slug: buildArticleSlug(article.publicIndex, article.metadata.title.en),
      tagline,
      title,
      datePublished: new Date(article.metadata.datePublished).toLocaleDateString(
        dateLocaleMap[this.locale],
        {
          year: "numeric",
          month: "short",
        },
      ),
      readingTime: this.calculateReadingTime(content),
    };
  }
}
