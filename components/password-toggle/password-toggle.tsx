import React from "react";
import { EyeSlashFilledIcon } from "@/components/icons/eye-slashfilled-icon";
import { EyeFilledIcon } from "@/components/icons/eye-filled-icon";

export interface PasswordToggleProps {
  isVisible: boolean;
  toggleVisibility: () => void;
  label?: string;
}

const PasswordToggle: React.FC<PasswordToggleProps> = ({
  isVisible,
  toggleVisibility,
  label = "toggle password visibility",
}) => {
  return (
    <button
      className="focus:outline-none"
      type="button"
      onClick={toggleVisibility}
      aria-label={label}
    >
      {isVisible ? (
        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
      ) : (
        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
      )}
    </button>
  );
};

export default PasswordToggle;
