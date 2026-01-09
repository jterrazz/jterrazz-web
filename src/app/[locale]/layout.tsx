import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Domain
import { UserContactType } from '../../domain/user';

// Infrastructure
import { createRouteBuilder, ExternalLinks } from '../../infrastructure/navigation/routes';
import { userRepository } from '../../infrastructure/repositories/user.repository';

import { type Locale, locales } from '../../i18n/config';
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

    // Convert `URL` instances to plain strings to safely pass to the client navigation bar.
    const contacts = [
        userRepository.getContact(UserContactType.GitHub),
        userRepository.getContact(UserContactType.Medium),
        userRepository.getContact(UserContactType.X),
    ].map((contact) => ({
        name: contact.type,
        type: contact.type,
        url: contact.url.toString(),
        value: contact.value,
    }));

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

    const navbarTranslations = {
        appStoreLink: ExternalLinks.n00AppStore,
        downloadApp: tNavbar('downloadApp'),
        getApp: tNavbar('getApp'),
        homeHref: routes.home(),
        opensInNewTab: tNavbar('opensInNewTab'),
    };

    const footerTranslations = {
        allRightsReserved: tFooter('allRightsReserved'),
        opensInNewTab: tFooter('opensInNewTab'),
        status: tFooter('status'),
        tagline: tFooter('tagline'),
    };

    return (
        <LocaleProvider locale={locale as Locale}>
            <div className="sticky top-0 z-[50] pointer-events-none">
                <Navbar contacts={contacts} pages={pages} translations={navbarTranslations} />
            </div>
            <main className="flex-1 flex flex-col overflow-x-hidden w-full">{children}</main>
            <SiteFooter translations={footerTranslations} />
        </LocaleProvider>
    );
}
