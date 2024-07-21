import React from 'react';
import Image from 'next/image';

import { HeadingSubSection } from '../atoms/typography/Heading.SubSection.js';

export type FooterProps = {
    className?: string;
};

export const TheFooter: React.FC<FooterProps> = ({ className }) => {
    const generatedClassName = `flex flex-col items-center justify-center py-12 text-storm-cloud-accent border-t border-black-and-white ${className}`;

    return (
        <footer className={generatedClassName}>
            <div className="flex flex-row items-center bg-black-and-white border border-black-and-white rounded-3xl px-8 py-6 mb-6">
                <Image
                    src="/assets/profil.jpg"
                    alt="Capitaine.io"
                    width="96"
                    height="96"
                    className="rounded-full mr-4"
                />
                <p className="text-center">
                    <span className="font-bold">
                        Jean-Baptiste Terrazzoni ~ @jterrazz <br />
                    </span>

                    <p className="text-sm text-storm-cloud text-center">Full-Stack Developer</p>
                </p>
            </div>

            <HeadingSubSection className="mb-6" title="Applications" size="large" />
            <div className="flex mb-12">
                <div>
                    <div className="rounded-3xl border border-black-and-white">
                        <Image
                            src="/assets/applications/capitaine-logo.svg"
                            alt="Capitaine.io"
                            width="96"
                            height="96"
                        />
                    </div>
                    <div className="px-2 mt-2">
                        <h5 className="text-sm font-bold">Capitaine</h5>
                        <div className="mt-1 text-xs text-storm-cloud">Mobile</div>
                    </div>
                </div>
                <div className="ml-4">
                    <div className="rounded-3xl border border-black-and-white">
                        <Image
                            src="/assets/applications/terrazzoni-logo.svg"
                            alt="Jterrazz.com"
                            width="96"
                            height="96"
                        />
                    </div>
                    <div className="px-2 mt-2">
                        <h5 className="text-sm font-bold">Terrazzoni</h5>
                        <div className="mt-1 text-xs text-storm-cloud">Website</div>
                    </div>
                </div>
            </div>

            <p className="text-sm">© 2024. All rights reserved.</p>
        </footer>
    );
};

// TODO https://thenounproject.com/icon/time-6975004/
// TODO https://thenounproject.com/icon/easel-342677/
// TODO https://thenounproject.com/icon/right-1920905/
