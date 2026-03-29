import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./i18n/config";

/**
 * I18n routing middleware
 * @description Handles locale detection and URL prefixing
 *
 * URL behavior:
 * - `/` → English (default, no prefix)
 * - `/articles` → English
 * - `/fr` → French
 * - `/fr/articles` → French
 * - `/en/articles` → Redirects to `/articles`
 */
export default createMiddleware({
  // Default locale served without prefix
  defaultLocale,

  // Don't use cookie for locale detection (cleaner URLs)
  localeDetection: false,

  // Only add prefix for non-default locales
  localePrefix: "as-needed",

  // Supported locales
  locales,
});

export const config = {
  matcher: ["/((?!_next|api|content|assets|favicon|icon|apple-icon|robots\\.txt|sitemap\\.xml|site\\.webmanifest|.*\\..*).*)"],
};
