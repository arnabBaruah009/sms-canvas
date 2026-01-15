import { Input } from "antd";
import { MailIcon } from "@/components/icons/mail-icon";
import PasswordToggle from "@/components/password-toggle/password-toggle";
import { InputProps_Auth } from "@/lib/types/input.types";

export const Input_Auth = ({
  type,
  value,
  name,
  onChange,
  isInvalid,
  className = "",
  onKeyDown,
  placeholder,
  errorMessage,
  isVisible,
  setIsVisible,
  endContent,
  disabled,
}: InputProps_Auth) => {
  const renderSuffix = () => {
    if (type === "password" && isVisible !== undefined && setIsVisible) {
      return (
        <PasswordToggle
          isVisible={isVisible}
          toggleVisibility={() => setIsVisible(!isVisible)}
        />
      );
    } else if (type === "email") {
      return (
        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
      );
    }
    return endContent;
  };

  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const inputProps = {
    name,
    value,
    onChange,
    placeholder,
    className,
    disabled,
    status: isInvalid ? ("error" as const) : undefined,
    suffix: renderSuffix(),
    onPressEnter: handlePressEnter,
    variant: "underlined" as const,
  };

  if (type === "password" && isVisible !== undefined && setIsVisible) {
    return (
      <div className="w-full">
        <Input {...inputProps} type={isVisible ? "text" : "password"} />
        {errorMessage && isInvalid && (
          <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Input {...inputProps} type={type} />
      {errorMessage && isInvalid && (
        <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
      )}
    </div>
  );
};
