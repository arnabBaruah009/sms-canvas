"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { Edit } from "lucide-react";
import { setIsEditingProfile, setIsEditingSchool, resetSettings } from "@/lib/redux/slice/settings.slice";
import type { RootState } from "@/lib/redux/store";

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isEditingProfile, isEditingSchool } = useSelector(
    (state: RootState) => state.settingsSlice
  );

  const isProfilePage = pathname === "/dashboard/settings/profile-details";
  const isSchoolPage = pathname === "/dashboard/settings/school-details";
  const isEditing = isProfilePage ? isEditingProfile : isSchoolPage ? isEditingSchool : false;

  // Reset editing state when switching tabs
  useEffect(() => {
    dispatch(resetSettings());
  }, [pathname, dispatch]);

  const handleEditClick = () => {
    if (isProfilePage) {
      dispatch(setIsEditingProfile(true));
    } else if (isSchoolPage) {
      dispatch(setIsEditingSchool(true));
    }
  };

  const editButton = !isEditing && (isProfilePage || isSchoolPage) ? (
    <PrimaryButton
      title="Edit"
      icon={<Edit className="w-4 h-4" />}
      onClick={handleEditClick}
    />
  ) : null;

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
        extraContent={editButton}
      />
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">{children}</div>
    </div>
  );
}
