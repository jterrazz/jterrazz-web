'use client';
import React, {
    Children,
    cloneElement,
    type ReactElement,
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
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
    as?: 'div' | 'menu' | 'nav' | 'ul';
    children: ReactElement<ChildProps> | ReactElement<ChildProps>[];
    className?: string;
    containerClassName?: string;
    defaultValue?: string;
    enableHover?: boolean;
    onValueChange?: (newActiveId: null | string) => void;
    transition?: Transition;
};

const defaultTransition: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 0.8,
};

type IndicatorPosition = {
    height: number;
    left: number;
    opacity: number;
    width: number;
};

/**
 * Selection indicator with smooth animated background
 * @description Uses position-based animations for fluid transitions between items
 */
export function SelectionIndicator({
    as: Component = 'nav',
    children,
    className,
    containerClassName,
    defaultValue,
    enableHover = false,
    onValueChange,
    transition = defaultTransition,
}: SelectionIndicatorProps) {
    const [activeId, setActiveId] = useState<null | string>(defaultValue ?? null);
    const [position, setPosition] = useState<IndicatorPosition>({
        height: 0,
        left: 0,
        opacity: 0,
        width: 0,
    });
    const uniqueId = useId();
    const containerRef = useRef<HTMLElement | null>(null);
    const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
    const exitTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);

    const setContainerRef = useCallback((el: HTMLElement | null) => {
        containerRef.current = el;
    }, []);

    const updatePosition = useCallback((id: null | string) => {
        if (id === null) {
            setPosition((prev) => ({ ...prev, opacity: 0 }));
            return;
        }

        const element = itemRefs.current.get(id);
        const container = containerRef.current;

        if (element && container) {
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            setPosition({
                height: elementRect.height,
                left: elementRect.left - containerRect.left,
                opacity: 1,
                width: elementRect.width,
            });
        }
    }, []);

    const handleSetActiveId = useCallback(
        (id: null | string) => {
            // Clear any pending exit timeout
            if (exitTimeoutRef.current) {
                clearTimeout(exitTimeoutRef.current);
                exitTimeoutRef.current = null;
            }

            if (id !== null) {
                setActiveId(id);
                updatePosition(id);
            } else {
                // Fade out smoothly
                setPosition((prev) => ({ ...prev, opacity: 0 }));
                // Delay clearing active ID to allow animation
                exitTimeoutRef.current = setTimeout(() => {
                    setActiveId(null);
                }, 150);
            }

            onValueChange?.(id);
        },
        [onValueChange, updatePosition],
    );

    // Update position when activeId changes externally
    useLayoutEffect(() => {
        if (activeId) {
            updatePosition(activeId);
        }
    }, [activeId, updatePosition]);

    useEffect(() => {
        if (defaultValue !== undefined) {
            setActiveId(defaultValue);
        }
    }, [defaultValue]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (exitTimeoutRef.current) {
                clearTimeout(exitTimeoutRef.current);
            }
        };
    }, []);

    const childArray = Children.toArray(children) as ReactElement<ChildProps>[];

    return (
        <Component
            aria-label={Component === 'nav' ? 'Navigation' : undefined}
            className={cn('relative flex items-center', containerClassName)}
            onMouseLeave={enableHover ? () => handleSetActiveId(null) : undefined}
            ref={setContainerRef}
        >
            {/* Animated indicator - single element that moves between items */}
            <AnimatePresence>
                {position.opacity > 0 && (
                    <motion.div
                        animate={{
                            height: position.height,
                            left: position.left,
                            opacity: position.opacity,
                            width: position.width,
                        }}
                        className={cn('absolute top-0 pointer-events-none', className)}
                        exit={{ opacity: 0, scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        layoutId={`selection-indicator-${uniqueId}`}
                        transition={transition}
                    />
                )}
            </AnimatePresence>

            {childArray.map((child, index) => {
                const id = child.props['data-id'];
                const isActive = activeId === id;

                const interactionProps = enableHover
                    ? {
                          onClick: () => {
                              // Immediately hide indicator on click (navigation)
                              if (exitTimeoutRef.current) {
                                  clearTimeout(exitTimeoutRef.current);
                                  exitTimeoutRef.current = null;
                              }
                              setPosition((prev) => ({ ...prev, opacity: 0 }));
                              setActiveId(null);
                          },
                          onMouseEnter: () => handleSetActiveId(id),
                      }
                    : {
                          onClick: () => handleSetActiveId(id),
                      };

                const newProps = {
                    'aria-selected': isActive,
                    className: cn('relative inline-flex cursor-pointer', child.props.className),
                    'data-checked': isActive ? 'true' : 'false',
                    key: index,
                    ref: (el: HTMLElement | null) => {
                        if (el) {
                            itemRefs.current.set(id, el);
                        } else {
                            itemRefs.current.delete(id);
                        }
                    },
                    ...interactionProps,
                };

                return cloneElement(
                    child,
                    newProps as unknown as Partial<ChildProps>,
                    <span className="relative z-10 w-full">{child.props.children}</span>,
                );
            })}
        </Component>
    );
}
