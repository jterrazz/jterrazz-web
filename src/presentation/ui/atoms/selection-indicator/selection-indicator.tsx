'use client';
import React, {
    Children,
    cloneElement,
    type ReactElement,
    useEffect,
    useId,
    useState,
} from 'react';

import { AnimatePresence, motion, type Transition } from 'framer-motion';

// Utils
import { cn } from '../../../utils';

type ChildProps = {
    children?: React.ReactNode;
    className?: string;
    'data-id': string;
};

type SelectionIndicatorProps = {
    children: ReactElement<ChildProps> | ReactElement<ChildProps>[];
    className?: string;
    defaultValue?: string;
    enableHover?: boolean;
    onValueChange?: (newActiveId: null | string) => void;
    transition?: Transition;
};

export function SelectionIndicator({
    children,
    className,
    defaultValue,
    enableHover = false,
    onValueChange,
    transition,
}: SelectionIndicatorProps) {
    const [activeId, setActiveId] = useState<null | string>(null);
    const uniqueId = useId();

    const handleSetActiveId = (id: null | string) => {
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

    return Children.map(children, (child: ReactElement<ChildProps>, index) => {
        const id = child.props['data-id'];

        const interactionProps = enableHover
            ? {
                  onMouseEnter: () => handleSetActiveId(id),
                  onMouseLeave: () => handleSetActiveId(null),
              }
            : {
                  onClick: () => handleSetActiveId(id),
              };

        const newProps = {
            'aria-selected': activeId === id,
            className: cn('relative inline-flex', child.props.className),
            'data-checked': activeId === id ? 'true' : 'false',
            key: index,
            ...interactionProps,
        };

        return cloneElement(
            child,
            newProps as unknown as Partial<ChildProps>,
            <>
                <AnimatePresence initial={false}>
                    {activeId === id && (
                        <motion.div
                            animate={{
                                opacity: 1,
                            }}
                            className={cn('absolute inset-0', className)}
                            exit={{
                                opacity: 0,
                            }}
                            initial={{ opacity: defaultValue ? 1 : 0 }}
                            layoutId={`background-${uniqueId}`}
                            transition={transition}
                        />
                    )}
                </AnimatePresence>
                <span className="z-10 w-full">{child.props.children}</span>
            </>,
        );
    });
}
