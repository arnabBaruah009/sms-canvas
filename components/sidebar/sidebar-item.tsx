import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  setActiveItem,
  expandSubmenu,
  toggleSidebar,
} from "@/lib/redux/slice/sidebar.slice";
import { useRouter } from "next/navigation";
import React from "react";

export interface SidebarItemProps {
  icon?: React.ReactNode;
  text: string;
  page: string;
  children?: SidebarItemProps[];
  group?: string;
  isMobile?: boolean;
  submodule?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  page,
  children,
  group = "",
  isMobile = false,
  submodule = false,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { activeItem, expanded, childrenGroup } = useSelector(
    (state: RootState) => state.sidebarSlice
  );

  const handleClick = () => {
    if (isMobile) {
      dispatch(toggleSidebar());
    }
    dispatch(setActiveItem(page));
    dispatch(expandSubmenu(false));
    router.push(page);
  };

  const isActive = activeItem.includes(text?.toLowerCase());
  const isGroupActive = childrenGroup === group;

  const renderItem = () => (
    <li className="relative" id={text}>
      {/* Parent Item */}
      <div
        onClick={handleClick}
        className={`relative flex items-center px-4  rounded-md cursor-pointer transition-colors duration-300 group ${
          submodule ? "text-xs py-1 my-1" : "text-sm py-2 my-1"
        } ${children && children.length > 0 && "mb-0"} ${
          isActive ? "bg-[#77b1ff]" : "hover:bg-[#66a2ff]"
        } ${!expanded && "justify-center"}`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all duration-500 ${
            expanded ? "w-32 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>

        {!expanded && (
          <div
            className={`
          absolute z-50 left-full rounded-md px-2 py-1 ml-6
          bg-[#77b1ff] text-white text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
          >
            {text}
          </div>
        )}
      </div>
    </li>
  );

  return renderItem();
};
