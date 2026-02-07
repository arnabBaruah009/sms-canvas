export type AuthHeading_Props = {
  title: string;
  subtitle?: string;
};

export const Heading = ({ title, subtitle }: AuthHeading_Props) => {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-semibold font-DMSans mt-6 text-center text-[#1A423C]">
        {title}
      </h1>
      <h4 className="mt-2 text-base font-extralight text-slate-700 font-jakarta text-center">
        {subtitle}
      </h4>
    </>
  );
};
