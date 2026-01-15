"use client";

import { Sidebar } from "@/components/sidebar/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { toggleSidebar } from "@/lib/redux/slice/sidebar.slice";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const expanded = useSelector(
    (state: RootState) => state.sidebarSlice.expanded
  );

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full flex p-2 md:p-0">
        {/* Overlay to close sidebar when clicking outside */}
        {!expanded && (
          <div
            className="fixed md:hidden inset-0 bg-black bg-opacity-50 z-[55] pointer-events-auto"
            onClick={() => dispatch(toggleSidebar())}
          />
        )}

        {/* Tab and desktop sidebar */}
        <div className="h-full hidden md:inline">
          <Sidebar />
        </div>
        <div className="grow flex items-center justify-center h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
