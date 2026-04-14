import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { defaultLocale, locales } from './i18n/config';

const intlMiddleware = createMiddleware({
    defaultLocale,
    localeDetection: false,
    localePrefix: 'as-needed',
    locales,
});

// Paths that must bypass i18n routing — otherwise next-intl rewrites them
// under `/en/...` and static assets 404. Next.js 16's proxy/middleware no
// longer accepts `export const config = { matcher }`, so we filter here.
const BYPASS = /^\/(?:_next|api|content|assets|favicon|icon|apple-icon|robots\.txt|sitemap\.xml|site\.webmanifest)|\.[^/]+$/;

export default function middleware(request: NextRequest) {
    if (BYPASS.test(request.nextUrl.pathname)) {
        return NextResponse.next();
    }
    return intlMiddleware(request);
}
