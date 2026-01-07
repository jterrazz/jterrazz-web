"use client";

import React from "react";

import { IconFileTextFilled } from "@tabler/icons-react";
import Image from "next/image";

import { Link } from "../../../../infrastructure/navigation/navigation";

// Domain
import { type Experiment, type ExperimentStatus } from "../../../../domain/experiment";

// Utils
import { cn } from "../../../utils";

import { BadgeExperimentStatus } from "../badge-experiment-status/badge-experiment-status";

type ExperimentCardData = Pick<Experiment, "name" | "slug" | "tagline"> & {
  articleUrl?: string | null;
  iconUrl?: string;
  status: ExperimentStatus;
};

export type CardExperimentFeaturedProps = {
  className?: string;
  experiment: ExperimentCardData;
};

export const CardExperimentFeatured: React.FC<CardExperimentFeaturedProps> = ({
  className,
  experiment,
}) => {
  const hasArticle = !!experiment.articleUrl;
  const hasIcon = !!experiment.iconUrl;

  return (
    <Link
      className={cn("group flex items-center gap-4 py-3", className)}
      href={`/experiments/${experiment.slug}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline underline-offset-4">
            {experiment.name}
          </h3>
          <BadgeExperimentStatus status={experiment.status} />
          {hasArticle && (
            <span className="relative shrink-0 group/tooltip">
              <IconFileTextFilled className="text-zinc-400 dark:text-zinc-500" size={14} />
              <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-zinc-900 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                Article available
              </span>
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
          {experiment.tagline}
        </p>
      </div>
      {hasIcon && (
        <Image
          alt={experiment.name}
          className="rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0"
          height={40}
          src={experiment.iconUrl!}
          width={40}
        />
      )}
    </Link>
  );
};
