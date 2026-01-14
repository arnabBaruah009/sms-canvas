export const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?)*$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

export const PASSWORDVALIDATION_REGEX = {
  Length: /^.{8,16}$/, // Between 8 and 16 characters
  Lowercase: /[a-z]/, // At least one lowercase letter
  Uppercase: /[A-Z]/, // At least one uppercase letter
  Digit: /\d/, // At least one digit
  SpecialChar: /[@$!%*?&#]/, // At least one special character
};
