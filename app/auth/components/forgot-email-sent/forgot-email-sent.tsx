import { Heading } from "@/app/auth/components/auth-heading/heading";

export const ForgotEmailSent: React.FC<{ email: string }> = ({ email }) => {
  return (
    <div className="w-full h-full flex flex-col items-center p-6">
      <div className="flex flex-col items-center justify-center text-center space-y-2 mb-6">
        <Heading title="Check your inbox!" />
        <div className="flex flex-row text-sm font-medium text-green-950 mt-10">
          <p>
            An email has been sent to{" "}
            <span className="font-semibold">{email}</span>. Please click the
            link provided to complete the password reset process.
          </p>
        </div>
      </div>
    </div>
  );
};
