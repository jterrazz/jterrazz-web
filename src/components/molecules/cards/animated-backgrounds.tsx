'use client';
import React, { Children, cloneElement, ReactElement, useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, Transition } from 'framer-motion';

import { mergeClassName } from '../../../lib/utils.js';

type AnimatedBackgroundProps = {
    children: ReactElement<{ 'data-id': string }>[] | ReactElement<{ 'data-id': string }>;
    defaultValue?: string;
    onValueChange?: (newActiveId: string | null) => void;
    className?: string;
    transition?: Transition;
    enableHover?: boolean;
};

export default function AnimatedBackground({
    children,
    defaultValue,
    onValueChange,
    className,
    transition,
    enableHover = false,
}: AnimatedBackgroundProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const uniqueId = useId();

    const handleSetActiveId = (id: string | null) => {
        setActiveId(id);

        if (onValueChange) {
            onValueChange(id);
        }
    };

    useEffect(() => {
        if (defaultValue !== undefined) {
            setActiveId(defaultValue);
        }
    }, [defaultValue]);

    return Children.map(children, (child: React.ReactElement, index) => {
        const id = child.props['data-id'];

        const interactionProps = enableHover
            ? {
                  onMouseEnter: () => handleSetActiveId(id),
                  onMouseLeave: () => handleSetActiveId(null),
              }
            : {
                  onClick: () => handleSetActiveId(id),
              };

        return cloneElement(
            child,
            {
                'aria-selected': activeId === id,
                className: mergeClassName('relative inline-flex', child.props.className),
                'data-checked': activeId === id ? 'true' : 'false',
                key: index,
                ...interactionProps,
            },
            <>
                <AnimatePresence initial={false}>
                    {activeId === id && (
                        <motion.div
                            layoutId={`background-${uniqueId}`}
                            className={mergeClassName('absolute inset-0', className)}
                            transition={transition}
                            initial={{ opacity: defaultValue ? 1 : 0 }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                        />
                    )}
                </AnimatePresence>
                <span className="z-10 w-full">{child.props.children}</span>
            </>,
        );
    });
}
