export const ButtonOfSection = (
    props: Readonly<{
        value: string;
        active?: boolean;
        className?: string;
        onClick?: () => void;
    }>,
) => {
    const { className, value, onClick } = props;
    const commonClasses = 'rounded-md px-2 py-0.5 text-sm';

    if (props.active) {
        return (
            <button
                className={`bg-olive-note text-white ${className} ${commonClasses}`}
                onClick={onClick}
            >
                {value}
            </button>
        );
    }

    return (
        <button
            className={`text-storm-cloud-accent bg-olive-note-hover hover:text-white ${className} ${commonClasses}`}
            onClick={onClick}
        >
            {value}
        </button>
    );
};
