import {
    type AnalyticsEvents,
    type AnalyticsPort,
    NoopAnalyticsAdapter,
    OpenPanelAnalyticsAdapter,
} from '@jterrazz/analytics';
import { headers } from 'next/headers';

import { SITE_CONFIG } from '../../config/site';

/**
 * Tracking plan of jterrazz-web — every server-side event must be declared
 * here. Names are object_action, snake_case, past tense.
 */
export interface WebEvents extends AnalyticsEvents {
    app_link_opened: { platform: 'android' | 'desktop' | 'ios'; slug: string };
}

/**
 * Server-side analytics composition root. Events go to the self-hosted
 * OpenPanel instance when a client id is configured, and are dropped
 * otherwise (local development, preview builds).
 */
export const analytics: AnalyticsPort<WebEvents> = SITE_CONFIG.analytics.clientId
    ? new OpenPanelAnalyticsAdapter<WebEvents>({
          apiUrl: SITE_CONFIG.analytics.apiUrl,
          clientId: SITE_CONFIG.analytics.clientId,
          clientSecret: process.env.OPENPANEL_CLIENT_SECRET,
          globalProperties: { app: 'jterrazz-web' },
      })
    : new NoopAnalyticsAdapter<WebEvents>();

/**
 * Analytics scoped to the current request: the backend derives geolocation
 * and device from the visitor's IP and user-agent instead of attributing
 * the event to the server.
 */
export async function analyticsForRequest(): Promise<AnalyticsPort<WebEvents>> {
    const headersList = await headers();

    return analytics.child({
        ip: headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
        userAgent: headersList.get('user-agent') || undefined,
    });
}
