export const Highlight = (
    props: Readonly<{
        title: string;
        description: string;
        className?: string;
    }>,
) => {
    const { title, className, description } = props;

    return (
        <div className={className}>
            <h2 className="text-4xl">{title}</h2>
            <p>{description}</p>
        </div>
    );
};
