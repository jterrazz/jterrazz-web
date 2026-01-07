import React from "react";

import { IconArrowRight } from "@tabler/icons-react";

import { Link } from "../../../../infrastructure/navigation/navigation";

// Utils
import { cn } from "../../../utils";

export type DividerSectionProps = {
  /**
   * Semantic heading level for accessibility
   * @default 'h2'
   */
  as?: "h2" | "h3" | "h4" | "span";
  className?: string;
  /**
   * Optional link displayed at the end of the divider
   */
  link?: {
    href: string;
    text: string;
  };
  title: string;
};

/**
 * Section divider with label, horizontal line, and optional link
 * @description Used to separate major content sections throughout the app
 */
export const DividerSection: React.FC<DividerSectionProps> = ({
  as: Tag = "h2",
  className,
  link,
  title,
}) => {
  return (
    <div className={cn("flex items-center w-full gap-4", className)}>
      <Tag className="text-sm font-medium text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
        {title}
      </Tag>
      <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800 dark:to-transparent" />
      {link && (
        <Link
          className="hidden md:flex items-center gap-1.5 text-sm font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors whitespace-nowrap"
          href={link.href}
        >
          {link.text}
          <IconArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};
