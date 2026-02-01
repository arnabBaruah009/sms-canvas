import { House, Settings, ShieldCheck, Users, Users2 } from "lucide-react";

export interface MenuItem {
  icon?: React.ReactNode;
  text: string;
  page: string;
  children?: MenuItem[];
  group?: string;
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
      icon: <ShieldCheck className="w-5 h-5" />,
      text: "Authorized",
      page: "/dashboard/authorized",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      text: "Settings",
      page: "/dashboard/settings/profile-details",
    },
  ],
};
