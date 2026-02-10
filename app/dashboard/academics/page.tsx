"use client";

import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";
import { AddSubject } from "./components/add-subject/add-subject";

export default function AcademicsPage() {
  return (
    <div className="w-full h-full flex flex-col md:px-8 pt-4 md:pt-6">
      <DashboardHeader
        title="Academics"
        description="Manage subjects and academic settings"
        showBackButton={false}
        bottomBorder={true}
      />
      <div className="flex-1 overflow-auto pt-4 pb-6">
        <AddSubject />
      </div>
    </div>
  );
}
