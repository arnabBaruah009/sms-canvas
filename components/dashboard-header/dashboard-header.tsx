import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs } from "antd";

interface BaseProps {
  title: string;
  description?: string;
  buttons?: React.ReactNode[];
  bottomBorder?: boolean;
  tabs?: { key: string; label: string }[];
  pathname?: string;
  handleRouting?: (key: string) => void;
  extraContent?: React.ReactNode;
}

interface WithBackButton extends BaseProps {
  showBackButton: true;
  backText: string;
  backLink: string;
}

interface WithoutBackButton extends BaseProps {
  showBackButton?: false;
  backText?: never;
  backLink?: never;
}

type DashboardHeaderProps = WithBackButton | WithoutBackButton;

export function DashboardHeader({
  title,
  description,
  buttons = [],
  showBackButton,
  backText,
  backLink,
  bottomBorder = true,
  tabs,
  pathname,
  handleRouting,
  extraContent,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(backLink as string); // Fallback to backLink if no history
    }
  };

  return (
    <div
      className={`${bottomBorder && !tabs && "pb-2 border-b"} ${
        !showBackButton && "pt-2"
      }`}
    >
      {showBackButton && (
        <p
          className={`flex items-center gap-x-2 cursor-pointer ${
            description ? "mb-1" : "mb-3"
          }`}
          onClick={handleBack}
        >
          <ArrowLeft className="size-4" />
          <span className="text-slate-600 hover:text-black">{backText}</span>
        </p>
      )}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl xl:text-3xl font-semibold mb-1 p-0 leading-[26px]">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-xs xl:text-base">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {buttons.map((button, index) => (
            <div key={index}>{button}</div>
          ))}
        </div>
      </div>

      {tabs && tabs.length > 0 && (
        <Tabs
          activeKey={pathname}
          items={tabs}
          onTabClick={(key: string) => handleRouting?.(key)}
          tabBarExtraContent={extraContent}
        />
      )}
    </div>
  );
}
