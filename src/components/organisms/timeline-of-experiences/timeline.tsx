'use client';

import React from 'react';

import { TimelineContext } from './timeline-context.js';

type TimelineProps = {
    children?: React.ReactNode;
    className?: string;
};

export const Timeline: React.FC<TimelineProps> = ({ children, className }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const timelineRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const updateActiveIndex = () => {
            const timeline = timelineRef.current;
            if (!timeline) return;

            const experiences = Array.from(timeline.children);
            const viewportHeight = window.innerHeight;
            const viewportMiddle = window.scrollY + viewportHeight / 2;

            // Find the experience closest to the middle of the viewport
            let closestDistance = Infinity;
            let newActiveIndex = 0;

            experiences.forEach((experience, index) => {
                const rect = experience.getBoundingClientRect();
                const absoluteTop = rect.top + window.scrollY;
                const absoluteMiddle = absoluteTop + rect.height / 2;
                const distance = Math.abs(viewportMiddle - absoluteMiddle);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    newActiveIndex = index;
                }
            });

            setActiveIndex(newActiveIndex);
        };

        // Initial check
        updateActiveIndex();

        // Add scroll listener
        window.addEventListener('scroll', updateActiveIndex);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', updateActiveIndex);
        };
    }, []);

    return (
        <TimelineContext.Provider value={{ activeIndex }}>
            <div className={className} ref={timelineRef}>
                {children}
            </div>
        </TimelineContext.Provider>
    );
};
