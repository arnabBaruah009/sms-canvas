import { BookOpen, ClipboardList, House, Settings, ShieldCheck, Users, Users2 } from "lucide-react";

export interface MenuItem {
  icon?: React.ReactNode;
  text: string;
  page: string;
  children?: MenuItem[];
  group?: string;
  /** When set, this item is only shown when the user's role is in this array */
  roles?: string[];
}

export interface Menu {
  Menu: MenuItem[];
}

export const Menu: Menu = {
  Menu: [
    {
      icon: <House className="w-5 h-5" />,
      text: "Home",
      page: "/dashboard/home",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Students",
      page: "/dashboard/students",
    },
    {
      icon: <Users2 className="w-5 h-5" />,
      text: "Teachers",
      page: "/dashboard/teachers",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      text: "Academics",
      page: "/dashboard/academics",
    },
    {
      icon: <ClipboardList className="w-5 h-5" />,
      text: "Assessment",
      page: "/dashboard/assessment",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      text: "Authorized",
      page: "/dashboard/authorized",
      roles: ["super_admin"],
    },
    {
      icon: <Settings className="w-5 h-5" />,
      text: "Settings",
      page: "/dashboard/settings/profile-details",
    },
  ],
};
