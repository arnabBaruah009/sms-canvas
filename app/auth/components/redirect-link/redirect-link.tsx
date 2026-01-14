import Link from "next/link";

export type Redirect_Link_Props = {
  message: string;
  redirectTo: string;
  path: string;
};

export const RedirectLink = ({
  message,
  redirectTo,
  path,
}: Redirect_Link_Props) => {
  return (
    <p className="mt-4 font-thin font-quicksand text-xs sm:text-sm">
      {message}{" "}
      <Link href={path}>
        <span className="text-green-700 font-semibold underline underline-offset-4">
          {redirectTo}
        </span>
      </Link>
    </p>
  );
};
