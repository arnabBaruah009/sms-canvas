import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    expanded: true,
    submenuexpanded: false,
    activeItem: "",
    submenuActiveItem: "",
    childrenGroup: "",
  },
  reducers: {
    expandSubmenu: (state, action: PayloadAction<boolean>) => {
      state.submenuexpanded = action.payload;
    },
    toggleSidebar: (state) => {
      state.expanded = !state.expanded;
    },
    setActiveItem: (state, action: PayloadAction<string>) => {
      state.activeItem = action.payload;
    },
    setSubMenuActiveItem: (state, action: PayloadAction<string>) => {
      state.submenuActiveItem = action.payload;
    },
    setChildrenGroup: (state, action: PayloadAction<string>) => {
      state.childrenGroup = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  expandSubmenu,
  setActiveItem,
  setSubMenuActiveItem,
  setChildrenGroup,
} = sidebarSlice.actions;
export default sidebarSlice.reducer;
