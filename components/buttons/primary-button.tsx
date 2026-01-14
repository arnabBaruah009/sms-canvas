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
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: "var(--primary-color)",
            defaultHoverBg: "#1f5d4b",
            defaultHoverBorderColor: "#1f5d4b",
            defaultHoverColor: "var(--secondary-color)",
            defaultActiveBg: "#1f5d4b", // Override active background
            defaultActiveBorderColor: "#1f5d4b", // Override active border color
            defaultColor: "white", // Ensure default text color stays white
            defaultActiveColor: "var(--secondary-color)",
          },
        },
      }}
    >
      <Button
        icon={icon}
        onClick={onClick}
        loading={loading}
        className={`text-white text-xs sm:text-sm text-center shadow-md ${className}`}
        {...props}
      >
        {title}
      </Button>
    </ConfigProvider>
  );
}
