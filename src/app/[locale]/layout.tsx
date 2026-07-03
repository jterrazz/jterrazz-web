import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Domain
import { type Locale, locales } from '../../i18n/config';
// Infrastructure
import { createRouteBuilder, ExternalLinks } from '../../infrastructure/navigation/routes';
import { experimentsRepository } from '../../infrastructure/repositories/experiments.repository';
import { LocaleProvider } from '../../presentation/context/locale-context';
import { Navbar } from '../../presentation/ui/organisms/navbar/navbar';
import { SiteFooter } from '../../presentation/ui/organisms/site-footer/site-footer';

type LocaleLayoutProps = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

/**
 * Generate static params for all locales
 */
export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

/**
 * Locale layout wrapper
 * @description Sets the request locale for all pages under [locale]
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params;

    // Validate locale
    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    const tNavbar = await getTranslations({ locale, namespace: 'navbar' });
    const tFooter = await getTranslations({ locale, namespace: 'footer' });
    const routes = createRouteBuilder(locale);

    const pages = [
        {
            href: routes.home(),
            name: tNavbar('hello'),
        },
        {
            href: routes.experiments(),
            name: tNavbar('experiments'),
        },
        {
            href: routes.articles(),
            name: tNavbar('articles'),
        },
        {
            href: routes.photographs(),
            name: tNavbar('photographs'),
        },
    ];

    // Get experiments with store links to hide app button on their pages
    const experimentsWithStoreLinks = experimentsRepository
        .getAll()
        .filter((exp) => exp.storeLinks?.appStore || exp.storeLinks?.playStore)
        .flatMap((exp) => [`/experiments/${exp.slug}`, `/fr/experiments/${exp.slug}`]);

    const navbarTranslations = {
        appStoreLink: ExternalLinks.signewApp,
        downloadApp: tNavbar('downloadApp'),
        getApp: tNavbar('getApp'),
        hideAppButtonOnPaths: experimentsWithStoreLinks,
        homeHref: routes.home(),
        opensInNewTab: tNavbar('opensInNewTab'),
    };

    const footerTranslations = {
        allRightsReserved: tFooter('allRightsReserved'),
        opensInNewTab: tFooter('opensInNewTab'),
        tagline: tFooter('tagline'),
    };

    return (
        <LocaleProvider locale={locale as Locale}>
            <Navbar pages={pages} translations={navbarTranslations} />
            <main className="flex-1 flex flex-col overflow-x-clip w-full">{children}</main>
            <SiteFooter translations={footerTranslations} />
        </LocaleProvider>
    );
}
