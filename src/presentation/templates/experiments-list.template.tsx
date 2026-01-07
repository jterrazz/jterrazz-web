"use client";

import React from "react";

import Script from "next/script";

// Domain
import { type Experiment, ExperimentCategory } from "../../domain/experiment";
import { type Feature } from "../../domain/feature";
import { UserContactType } from "../../domain/user";

type SerializableFeature = Omit<Feature, "url"> & { url: string };

// Infrastructure
import { userRepository } from "../../infrastructure/repositories/user.repository";

import { CardExperimentFeatured } from "../ui/molecules/card-experiment-featured/card-experiment-featured";
import { DividerSection } from "../ui/molecules/divider-section/divider-section";
import { SectionHero } from "../ui/molecules/section-hero/section-hero";

type ExperimentsListTranslations = {
  applications: string;
  hackathons: string;
  systems: string;
  tools: string;
  viewGitHub: string;
};

type ExperimentsListTemplateProps = {
  experiments: readonly SerializableExperiment[];
  features: readonly SerializableFeature[];
  highlightDescription: string;
  highlightTitle: string;
  translations: ExperimentsListTranslations;
};

type SerializableExperiment = Omit<Experiment, "components" | "url"> & {
  articleUrl: null | string;
  components: Array<
    Omit<Experiment["components"][number], "sourceUrl"> & {
      sourceUrl: string;
    }
  >;
  url: string;
};

export const ExperimentsListTemplate: React.FC<ExperimentsListTemplateProps> = ({
  experiments,
  highlightDescription,
  highlightTitle,
  translations: t,
}) => {
  const button = {
    href: userRepository.getContact(UserContactType.GitHub).url.toString(),
    text: t.viewGitHub,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    description: highlightDescription,
    name: highlightTitle,
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://jterrazz.com"}/experiments`,
  };

  const apps = experiments.filter((p) => p.category === ExperimentCategory.App);
  const hackathons = experiments.filter((p) => p.category === ExperimentCategory.Hackathon);
  const systems = experiments.filter((p) => p.category === ExperimentCategory.System);
  const tools = experiments.filter((p) => p.category === ExperimentCategory.Tool);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
      <Script id="experiments-list-json-ld" strategy="beforeInteractive" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      {/* Hero Section */}
      <div className="w-full">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <SectionHero button={button} description={highlightDescription} title={highlightTitle} />
        </div>
      </div>

      {/* Experiments Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-24 space-y-16">
        {/* Applications */}
        {apps.length > 0 && (
          <section>
            <DividerSection className="mb-8" title={t.applications} />
            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
              {apps.map((experiment) => (
                <CardExperimentFeatured
                  className="first:pt-0 last:pb-0"
                  experiment={experiment}
                  key={experiment.name}
                />
              ))}
            </div>
          </section>
        )}

        {/* Hackathons */}
        {hackathons.length > 0 && (
          <section>
            <DividerSection className="mb-8" title={t.hackathons} />
            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
              {hackathons.map((experiment) => (
                <CardExperimentFeatured
                  className="first:pt-0 last:pb-0"
                  experiment={experiment}
                  key={experiment.name}
                />
              ))}
            </div>
          </section>
        )}

        {/* Systems */}
        {systems.length > 0 && (
          <section>
            <DividerSection className="mb-8" title={t.systems} />
            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
              {systems.map((experiment) => (
                <CardExperimentFeatured
                  className="first:pt-0 last:pb-0"
                  experiment={experiment}
                  key={experiment.name}
                />
              ))}
            </div>
          </section>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <section>
            <DividerSection className="mb-8" title={t.tools} />
            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
              {tools.map((experiment) => (
                <CardExperimentFeatured
                  className="first:pt-0 last:pb-0"
                  experiment={experiment}
                  key={experiment.name}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
