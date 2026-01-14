import { Input } from "@nextui-org/react";
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
  const renderEndContent = () => {
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

  return (
    <Input
      type={
        type === "password" && isVisible !== undefined
          ? isVisible
            ? "text"
            : "password"
          : type
      }
      name={name}
      value={value}
      onChange={onChange}
      isInvalid={isInvalid}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      errorMessage={errorMessage}
      className={className}
      endContent={renderEndContent()}
      variant="underlined"
      disabled={disabled}
    />
  );
};
