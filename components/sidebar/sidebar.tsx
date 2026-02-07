import { ChevronFirst, ChevronLast, LogOut, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  toggleSidebar,
  expandSubmenu,
  setSubMenuActiveItem,
  setActiveItem,
  setChildrenGroup,
} from "@/lib/redux/slice/sidebar.slice";
import { SidebarItem } from "@/components/sidebar/sidebar-item";
import { useLogoutMutation } from "@/lib/apis/auth.api";
import { deleteSession } from "@/lib/utils/sessions.utils";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Menu } from "@/lib/constants/sidebar.constants";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { decodeJWT } from "@/lib/utils/sessions.utils";
import { useGetUserQuery } from "@/lib/apis/profile.api";
import { Avatar, Button, Tooltip } from "antd";

export function Sidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const expanded = useSelector(
    (state: RootState) => state.sidebarSlice.expanded
  );
  const token = useSelector((state: RootState) => state.authSlice.token);
  const pathname = usePathname();
  const { data } = useGetUserQuery();
  const profile = data?.data;

  const menuItems = useMemo(() => {
    const decoded = token ? decodeJWT(token) : null;
    const role = decoded?.role;
    return Menu.Menu.filter(
      (item) => !item.roles || (role && item.roles.includes(role))
    );
  }, [token]);

  useEffect(() => {
    const segments = pathname?.split("/") || [];
    const index = segments.indexOf("dashboard");
    const nextSegment = index !== -1 ? segments[index + 1] : "";
    dispatch(setActiveItem(nextSegment));
    dispatch(setSubMenuActiveItem(pathname));
    if (pathname.includes("settings")) dispatch(expandSubmenu(true));

    if (pathname.includes("facilities")) {
      dispatch(setChildrenGroup("facilities"));
    } else if (pathname.includes("events")) {
      dispatch(setChildrenGroup("events"));
    } else {
      dispatch(setChildrenGroup(""));
    }
  }, [pathname]);

  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      deleteSession();
      await logout().unwrap();
      toast.success("Logged out!");
      router.push("/auth/login");
    } catch (error) {
      router.push("/auth/login");
    }
  };

  const handleSubmenuItemClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="h-screen">
      <aside className="h-full flex flex-col border-r z-10 bg-primary text-white">
        {/* Header Section - Fixed at top */}
        <div
          className={`w-full flex flex-row items-center p-4 transition-all ${expanded ? "gap-2 pl-8 justify-between" : "justify-center"
            }`}
        >
          <div
            className={`flex justify-start items-center ${expanded && "gap-x-2"
              }`}
          >
            {expanded ? (
              <p className="text-md font-Parkinsans">S-M-S</p>
            ) : (
              <button
                onClick={() => dispatch(toggleSidebar())}
                className={`rounded-lg hover:bg-gray-400 transition-all overflow-hidden p-1.5`}
              >
                <ChevronLast />
              </button>
            )}

            <p
              className={`text-2xl text-transparent bg-clip-text bg-logo-gradient tracking-wide font-Parkinsans transition-all duration-500 overflow-hidden ${expanded ? "w-max" : "w-0"
                }`}
            >
              S-M-S
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleSidebar())}
            className={`rounded-lg hover:bg-gray-400 transition-all overflow-hidden ${expanded ? "p-1.5" : "w-0"
              }`}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Scrollable Navigation Section */}
        <div className="flex-1 overflow-y-auto">
          <div
            className={`w-full transition-all ${expanded ? "pr-4 pl-2" : ""}`}
          >
            <ul className="flex-1 px-2 mb-4">
              {menuItems.map((item) => {
                const sidebarItem = (
                  <SidebarItem
                    key={item.page}
                    icon={item.icon}
                    text={item.text}
                    page={item.page}
                    children={item.children?.map((child) => {
                      return {
                        icon: child.icon,
                        text: child.text,
                        page: child.page,
                        group: child.group,
                      };
                    })}
                    group={item.group}
                  />
                );

                return sidebarItem;
              })}
            </ul>
          </div>
        </div>

        <div
          className={`w-full flex items-center gap-3 p-4 ${expanded ? "justify-start pl-1" : "justify-center"
            }`}
        >
          {profile?.avatar_url ? (
            <Avatar className="size-8" src={profile.avatar_url} />
          ) : (
            <Avatar className="size-8">
              {profile?.name ? (
                `${profile?.name?.charAt(0)}`
              ) : (
                <User className="size-6" />
              )}
            </Avatar>
          )}
          {expanded && (
            <div
              className={`flex flex-row grow justify-between items-center transition-all duration-500 ${!expanded && "hidden"
                }`}
            >
              <div className="flex flex-col">
                <span
                  className={`overflow-hidden transition-all duration-500 text-xs font-medium ${expanded ? "w-40" : "w-0"
                    }`}
                >
                  {profile?.name ?? ""}
                </span>
                <span
                  className={`overflow-hidden transition-all duration-500 text-xs ${expanded ? "w-40" : "w-0"
                    }`}
                  style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                >
                  {profile?.phone_number ?? ""}
                </span>
              </div>
              <Tooltip title="Logout">
                <Button
                  type="text"
                  shape="circle"
                  icon={<LogOut className="size-4 text-white" />}
                  disabled={isLoading}
                  loading={isLoading}
                  onClick={handleLogout}
                />
              </Tooltip>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
