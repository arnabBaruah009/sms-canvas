import { Button, ConfigProvider, ButtonProps } from "antd";
import { ReactNode } from "react";

interface PrimaryButtonProps extends ButtonProps {
  title: string;
  icon?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  className?: string;
}

export function PrimaryButton({
  title,
  icon,
  onClick,
  loading,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <Button icon={icon} onClick={onClick} loading={loading} {...props}>
      {title}
    </Button>
  );
}
