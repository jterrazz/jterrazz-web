import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SITE_CONFIG } from "../../../../config/site";
import type { ExperimentContext } from "../../../../domain/experiment";
import { buildArticleSlug } from "../../../../domain/utils/slugify";

import { locales } from "../../../../i18n/config";
import { articlesRepository } from "../../../../infrastructure/repositories/articles.repository";
import { contentLinksRepository } from "../../../../infrastructure/repositories/content-links.repository";
import { experimentsRepository } from "../../../../infrastructure/repositories/experiments.repository";
import { buildMetadata } from "../../../../infrastructure/seo/build-metadata";
import { buildExperimentDetailJsonLd } from "../../../../infrastructure/seo/json-ld";
import {
  buildExperimentSeoDescription,
  buildExperimentSeoKeywords,
  is42Experiment,
} from "../../../../infrastructure/seo/seo-utils";

import { ExperimentDetailTemplate } from "../../../../presentation/templates/experiment-detail.template";
import { JsonLdScript } from "../../../../presentation/ui/atoms/json-ld-script/json-ld-script";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale, slug } = params;

  const experiment = experimentsRepository.getBySlug(slug);

  if (!experiment) {
    return { title: "Experiment Not Found" };
  }

  const baseDescription = experiment.longDescription || experiment.description;
  const description = buildExperimentSeoDescription(baseDescription, experiment.context);
  const imageUrl = experiment.images?.thumbnail;
  const path = locale === "en" ? `/experiments/${slug}` : `/${locale}/experiments/${slug}`;
  const is42 = is42Experiment(experiment.context);
  const keywords = buildExperimentSeoKeywords(
    experiment.name,
    experiment.description,
    experiment.context,
  );

  return buildMetadata({
    alternateLanguages: {
      en: `/experiments/${slug}`,
      fr: `/fr/experiments/${slug}`,
    },
    description,
    image: imageUrl ? { alt: experiment.name, path: imageUrl } : undefined,
    is42Related: is42,
    keywords,
    locale,
    path,
    title: experiment.name,
  });
}

export function generateStaticParams() {
  const experiments = experimentsRepository.getAll();

  return experiments.flatMap((experiment) =>
    locales.map((locale) => ({
      locale,
      slug: experiment.slug,
    })),
  );
}

export default async function ExperimentDetailPage(props: Props) {
  const params = await props.params;
  const { locale, slug } = params;
  setRequestLocale(locale);

  const experiment = experimentsRepository.getBySlug(slug);

  if (!experiment) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "experiments" });

  // Get linked article if exists
  const linkedArticleIndex = contentLinksRepository.getArticleIndexForExperiment(slug);
  const allArticles = articlesRepository.getAll();
  const linkedArticle = linkedArticleIndex
    ? allArticles.find((a) => a.publicIndex === linkedArticleIndex)
    : undefined;
  const articleUrl = linkedArticle
    ? `/articles/${buildArticleSlug(linkedArticle.publicIndex, linkedArticle.metadata.title.en)}`
    : null;

  // Convert URL instances to strings for client components
  const serializedExperiment = {
    ...experiment,
    articleUrl,
    components: experiment.components.map((component) => ({
      ...component,
      sourceUrl: component.sourceUrl.toString(),
    })),
    url: experiment.url ? experiment.url.toString() : "",
  };

  const translations = {
    context: {
      hackathon: t("context.hackathon"),
      personal: t("context.personal"),
      professional: t("context.professional"),
      school42: t("context.school42"),
    },
    detail: {
      about: t("detail.about"),
      appStore: t("detail.appStore"),
      availableOn: t("detail.availableOn"),
      components: t("detail.components"),
      downloadOnAppStore: t("detail.downloadOnAppStore"),
      getItOnGooglePlay: t("detail.getItOnGooglePlay"),
      privacyPolicy: t("detail.privacyPolicy"),
      readArticle: t("detail.readArticle"),
      scanToDownload: t("detail.scanToDownload"),
      showcase: t("detail.showcase"),
      sourceCode: t("detail.sourceCode"),
      viewProject: t("detail.viewProject"),
      visitWebsite: t("detail.visitWebsite"),
      year: t("detail.year"),
    },
  };

  // Build JSON-LD structured data
  const is42 = is42Experiment(experiment.context);
  const experimentUrl =
    locale === "en"
      ? `${SITE_CONFIG.baseUrl}/experiments/${slug}`
      : `${SITE_CONFIG.baseUrl}/${locale}/experiments/${slug}`;
  const codeRepository = experiment.components[0]?.sourceUrl?.toString();

  const jsonLd = buildExperimentDetailJsonLd({
    codeRepository,
    description: experiment.longDescription || experiment.description,
    is42Project: is42,
    name: experiment.name,
    url: experimentUrl,
    year: experiment.year,
  });

  return (
    <>
      <JsonLdScript data={jsonLd} id="experiment-detail-json-ld" />
      <ExperimentDetailTemplate experiment={serializedExperiment} translations={translations} />
    </>
  );
}
