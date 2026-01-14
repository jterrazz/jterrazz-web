import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { experimentsRepository } from "../../../infrastructure/repositories/experiments.repository";

function detectPlatform(userAgent: string): "ios" | "android" | "desktop" {
  const ua = userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) {
    return "ios";
  }

  if (/android/.test(ua)) {
    return "android";
  }

  return "desktop";
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AppRedirectPage({ params }: Props) {
  const { slug } = await params;

  // Find experiment by slug
  const experiment = experimentsRepository.getBySlug(slug);

  // Only handle experiments with store links (mobile apps)
  if (!experiment?.storeLinks?.appStore && !experiment?.storeLinks?.playStore) {
    notFound();
  }

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const platform = detectPlatform(userAgent);

  // Auto-redirect based on platform
  if (platform === "ios" && experiment.storeLinks?.appStore) {
    redirect(experiment.storeLinks.appStore);
  }

  if (platform === "android" && experiment.storeLinks?.playStore) {
    redirect(experiment.storeLinks.playStore);
  }

  // Desktop/unknown or missing store link for platform → experiment page
  redirect(`/experiments/${slug}`);
}
