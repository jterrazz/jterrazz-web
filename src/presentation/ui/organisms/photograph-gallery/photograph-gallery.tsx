'use client';

/* oxlint-disable next/no-img-element -- These photographs live on the Pexels
   CDN, which already resizes on demand and already content-negotiates AVIF.
   Routing them through next/image would add an origin fetch and a re-encode to
   land on the same bytes, so the responsive work is done with a plain srcset
   (see infrastructure/pexels-image.ts). */

import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Domain
import { type Photograph } from '../../../../domain/photograph';
// Infrastructure
import {
    buildPexelsLightboxUrl,
    buildPexelsSrcSet,
    buildPexelsUrl,
    PHOTOGRAPH_EAGER_COUNT,
    PHOTOGRAPH_SIZES,
} from '../../../../infrastructure/pexels-image';
// Utils
import { cn } from '../../../utils';

type PhotographGalleryProps = {
    className?: string;
    closeLabel: string;
    nextLabel: string;
    photographs: Photograph[];
    previousLabel: string;
};

/*
 * Masonry via CSS columns — same look the previous library produced, minus the
 * library. Column maths are mirrored in PHOTOGRAPH_SIZES; change both together.
 */
const COLUMNS = 'columns-1 gap-6 sm:columns-2 lg:columns-3';

export const PhotographGallery: React.FC<PhotographGalleryProps> = ({
    className,
    closeLabel,
    nextLabel,
    photographs,
    previousLabel,
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [activeIndex, setActiveIndex] = useState<null | number>(null);

    const open = (index: number) => {
        setActiveIndex(index);
        dialogRef.current?.showModal();
    };

    const step = useCallback(
        (delta: number) => {
            setActiveIndex((current) => {
                if (current === null) {
                    return current;
                }
                return (current + delta + photographs.length) % photographs.length;
            });
        },
        [photographs.length],
    );

    // Arrow keys while the dialog owns focus. Escape and the focus trap are
    // Native to <dialog>, so they need no handling here.
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) {
            return;
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                step(1);
            }
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                step(-1);
            }
        };
        dialog.addEventListener('keydown', onKeyDown);
        return () => dialog.removeEventListener('keydown', onKeyDown);
    }, [step]);

    const active = activeIndex === null ? null : photographs[activeIndex];

    return (
        <>
            <div className={cn(COLUMNS, className)}>
                {photographs.map((photograph, index) => (
                    <button
                        aria-label={photograph.metadata.description}
                        className="group mb-6 block w-full break-inside-avoid cursor-pointer"
                        key={photograph.contentUrl}
                        onClick={() => open(index)}
                        type="button"
                    >
                        <img
                            alt={photograph.metadata.description}
                            className="h-auto w-full bg-zinc-100 dark:bg-zinc-900"
                            decoding="async"
                            /* Width/height reserve the box before decode: without
                               them the page collapses and every lazy tile loads. */
                            height={photograph.height}
                            loading={index < PHOTOGRAPH_EAGER_COUNT ? 'eager' : 'lazy'}
                            sizes={PHOTOGRAPH_SIZES}
                            src={buildPexelsUrl(photograph.contentUrl, 800)}
                            srcSet={buildPexelsSrcSet(photograph.contentUrl)}
                            width={photograph.width}
                        />
                    </button>
                ))}
            </div>

            <dialog
                className="max-h-none max-w-none bg-transparent backdrop:bg-zinc-950/85 backdrop:backdrop-blur-sm m-0 h-full w-full p-0"
                onClick={(event) => {
                    // Backdrop clicks land on the dialog itself.
                    if (event.target === dialogRef.current) {
                        dialogRef.current?.close();
                    }
                }}
                onClose={() => setActiveIndex(null)}
                ref={dialogRef}
            >
                {active && (
                    <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-4 p-4">
                        <img
                            alt={active.metadata.description}
                            className="pointer-events-auto max-h-[80vh] w-auto max-w-full object-contain"
                            height={active.height}
                            src={buildPexelsLightboxUrl(active.contentUrl)}
                            width={active.width}
                        />
                        <p className="pointer-events-auto max-w-xl text-center text-sm text-zinc-300">
                            {active.metadata.description}
                        </p>

                        <button
                            aria-label={closeLabel}
                            className="pointer-events-auto absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900/70 text-white transition-colors hover:bg-zinc-900"
                            onClick={() => dialogRef.current?.close()}
                            type="button"
                        >
                            <IconX size={20} />
                        </button>

                        {photographs.length > 1 && (
                            <>
                                <button
                                    aria-label={previousLabel}
                                    className="pointer-events-auto absolute top-1/2 left-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/70 text-white transition-colors hover:bg-zinc-900 md:left-4"
                                    onClick={() => step(-1)}
                                    type="button"
                                >
                                    <IconChevronLeft size={22} />
                                </button>
                                <button
                                    aria-label={nextLabel}
                                    className="pointer-events-auto absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/70 text-white transition-colors hover:bg-zinc-900 md:right-4"
                                    onClick={() => step(1)}
                                    type="button"
                                >
                                    <IconChevronRight size={22} />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </dialog>
        </>
    );
};
