import { type Metadata } from 'next';

import { Link } from '../infrastructure/navigation/navigation';
import {
    ArrowLink,
    Container,
    DottedGrid,
    Heading,
    Lead,
    Section,
} from '../presentation/ui/design-system';

/**
 * The recovery page for anything that does not resolve.
 *
 * Next's built-in 404 is a bare centred string with no navigation: a visitor
 * arriving on a dead link — a moved article, a mistyped path, a stale share —
 * has nowhere to go but Back. This one is the site's only page that assumes
 * the reader is lost, so its whole job is to offer the way out.
 *
 * It lives at the root rather than under `[locale]`, where the navbar and
 * footer are built, so the routes are spelled out here instead.
 */

const DESTINATIONS = [
    {
        description: 'Notes on what I learn while building software.',
        href: '/articles',
        label: 'Articles',
    },
    { description: "Things I've built along the way.", href: '/experiments', label: 'Experiments' },
    {
        description: 'Moments and places that caught my eye.',
        href: '/photographs',
        label: 'Photographs',
    },
];

export const metadata: Metadata = {
    // Nothing here is worth indexing, and the title should read as an answer
    // Rather than as a page in its own right.
    robots: { follow: true, index: false },
    title: 'Page not found',
};

export default function NotFound() {
    // The locale layout supplies the <main> landmark for every other page;
    // This one renders above it, so it carries its own.
    return (
        <main className="flex-1 flex flex-col overflow-x-clip w-full">
            <Container width="shell">
                <Section spacing="hero">
                    <DottedGrid intensity="medium" origin="top-left" />

                    <Heading className="mb-6" size="display">
                        This page does not exist.
                    </Heading>
                    <Lead>
                        The link may be out of date, or the address slightly off. Everything below
                        is still where it should be.
                    </Lead>

                    <div className="mt-12 flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                        {DESTINATIONS.map(({ description, href, label }) => (
                            <Link className="group flex flex-col py-4" href={href} key={href}>
                                <Heading
                                    as="h2"
                                    className="transition-colors group-hover:text-zinc-500 dark:group-hover:text-zinc-400"
                                    size="title"
                                >
                                    {label}
                                </Heading>
                                <Lead className="mt-0.5" size="sm">
                                    {description}
                                </Lead>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10">
                        <ArrowLink href="/" tone="subtle">
                            Back to the homepage
                        </ArrowLink>
                    </div>
                </Section>
            </Container>
        </main>
    );
}
