export const Tag = (
    props: Readonly<{
        value: string;
        className?: string;
        state?: 'active' | 'inactive';
    }>,
) => {
    const { value, className, state } = props;
    const commonClasses = 'rounded-full px-2.5 py-1 text-sm font-medium';

    if (state === 'active') {
        return (
            <span
                className={`bg-olive-note text-olive-note-accent text- ${commonClasses} ${className ?? ''}`}
            >
                {value}
            </span>
        );
    } else if (state === 'inactive') {
        return (
            <span
                className={`bg-apricot-sunset text-apricot-sunset-accent ${commonClasses} ${className ?? ''}`}
            >
                {value}
            </span>
        );
    }

    return (
        <span
            className={`bg-vanilla-punch text-vanilla-punch-accent ${commonClasses} ${className ?? ''}`}
        >
            {value}
        </span>
    );
};
