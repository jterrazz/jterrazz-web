import { createContext, useContext } from 'react';

type TimelineContextType = {
    activeIndex: number;
};

export const TimelineContext = createContext<TimelineContextType>({ activeIndex: 0 });

export const useTimelineContext = () => useContext(TimelineContext);
