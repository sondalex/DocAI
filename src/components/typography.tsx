interface TypographyProps {
  children: string;
}
const TypographyH1 = ({ children }: TypographyProps) => {
    return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {children}
        </h1>
    );
};

const TypographyH2 = ({ children }: TypographyProps) => {
    return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {children}
        </h2>
    );
};
const TypographyLead = ({ children }: TypographyProps) => {
    return <p className="text-xl text-muted-foreground">{children}</p>;
};

export { TypographyH1, TypographyH2, TypographyLead };
