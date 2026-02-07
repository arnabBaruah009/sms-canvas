import { Validation_Test_Input } from "@/lib/types/validation.types";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PASSWORDVALIDATION_REGEX,
  PHONE_REGEX,
} from "@/lib/constants/validation.constants";
import { RcFile } from "antd/es/upload";
import toast from "react-hot-toast";

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email);

/** Returns true if value is exactly 10 digits. */
export const isValidPhone = (phone: string): boolean => PHONE_REGEX.test(phone);

export const isValidPassword = (password: string): boolean =>
  PASSWORD_REGEX.test(password);

export const checkValidation = <T extends Validation_Test_Input>(
  name: keyof T,
  inputs: T,
  type: "login" | "register" | "resetPassword" | "forgotPassword"
): boolean => {
  const inputValue = inputs[name];
  if (typeof inputValue !== "string" || inputValue === "") return false;

  let validationTest = false;

  switch (name) {
    case "email":
      validationTest = !isValidEmail(inputValue);
      break;

    case "phone":
      validationTest = !isValidPhone(inputValue);
      break;

    case "password":
    case "newPassword":
      validationTest = !isValidPassword(inputValue);
      break;

    case "confirm_password":
      validationTest =
        type === "register"
          ? inputs["password"] !== inputs["confirm_password"]
          : type === "resetPassword" || type === "forgotPassword"
          ? inputs["newPassword"] !== inputs["confirm_password"]
          : false;
      break;
  }

  return validationTest;
};

export const passwordValidate = (password: string): string => {
  if (!PASSWORDVALIDATION_REGEX.Length.test(password)) {
    return "Password must be between 8 and 16 characters long.";
  }
  if (!PASSWORDVALIDATION_REGEX.Lowercase.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!PASSWORDVALIDATION_REGEX.Uppercase.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!PASSWORDVALIDATION_REGEX.Digit.test(password)) {
    return "Password must contain at least one digit.";
  }
  if (!PASSWORDVALIDATION_REGEX.SpecialChar.test(password)) {
    return "Password must contain at least one special character.";
  }

  return "Only a-z, A-Z, 0-9, @$!%*?&# are allowed";
};

export const validateFiles = (file: RcFile, type: "image" | "document") => {
  if (type === "image") {
    const isValidFormat = ["image/png", "image/jpeg"].includes(file.type);
    const isSizeValid = file.size / 1024 / 1024 < 1; // 1MB size limit
    if (!isValidFormat) {
      toast.error("You can only upload PNG, JPEG or JPG files.");
      return false;
    }
    if (!isSizeValid) {
      toast.error("Image size must be less than 1MB.");
      return false;
    }
    return true;
  }

  if (type === "document") {
    const isValidFormat = file.type === "application/pdf";
    const isSizeValid = file.size / 1024 / 1024 < 1; // 1MB size limit
    if (!isValidFormat) {
      toast.error("You can only upload PDF files.");
      return false;
    }
    if (!isSizeValid) {
      toast.error("Document size must be less than 1MB.");
      return false;
    }
    return true;
  }
  return false;
};
