import { House } from "lucide-react";

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
  ],
};
