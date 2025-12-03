import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { data } from '../../../../data';

type Props = {
    params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
    const experiments = data.experiments.getAll();

    return experiments
        .filter((experiment) => experiment.hasPrivacyPolicy)
        .map((experiment) => ({ slug: experiment.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const experiment = data.experiments.getBySlug(params.slug);

    return {
        description: `Privacy policy for ${experiment?.name || 'this application'}.`,
        title: `Privacy Policy - ${experiment?.name || 'App'}`,
    };
}

export default async function ExperimentPrivacyPage(props: Props) {
    const params = await props.params;
    const experiment = data.experiments.getBySlug(params.slug);

    if (!experiment || !experiment.hasPrivacyPolicy) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pb-32">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 md:px-6 border-b border-zinc-100 dark:border-zinc-900 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('/assets/texture-dots.png')] bg-repeat" />

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                {experiment.name}
                            </h1>

                            <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl font-light">
                                {experiment.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Section */}
            <div className="px-4 md:px-6 pt-20">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                            Privacy Policy
                        </h3>
                        <div className="h-1 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                    </div>

                    <div className="space-y-6 text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
                        <p>
                            {experiment.name} does not collect, store, or share any personal data.
                        </p>
                        <p>All preferences are stored locally on your device.</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Contact:{' '}
                            <a
                                className="hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-2"
                                href="mailto:contact@jterrazz.com"
                            >
                                contact@jterrazz.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
