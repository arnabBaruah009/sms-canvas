interface InputProps {
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errorMessage?: string;
  endContent?: React.ReactNode;
  disabled?: boolean;
}

export interface InputProps_Auth extends InputProps {
  type: "email" | "password" | "tel";
  isVisible?: boolean;
  setIsVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}
