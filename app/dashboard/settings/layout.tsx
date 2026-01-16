"use client";

import { useRouter, usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Desktop layout
  return (
    <div className="w-full h-full flex flex-col md:px-8 pt-4 md:pt-6">
      <DashboardHeader
        title="Settings"
        description="Manage your settings"
        showBackButton={false}
        bottomBorder={false}
        pathname={pathname}
        tabs={[
          {
            key: `/dashboard/settings/profile-details`,
            label: "Profile Details",
          },
          {
            key: `/dashboard/settings/school-details`,
            label: "School Details",
          },
        ]}
        handleRouting={(key: string) => router.push(key)}
      />
      <div className="flex-1 overflow-y-auto scrollbar-hide">{children}</div>
    </div>
  );
}
