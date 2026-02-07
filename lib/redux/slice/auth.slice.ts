import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { SESSION_COOKIE_NAME } from "@/lib/utils/sessions.utils";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: Cookies.get(SESSION_COOKIE_NAME) || "",
  },
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    removeToken(state) {
      state.token = "";
    },
  },
});

export const { setToken, removeToken } = authSlice.actions;
export default authSlice.reducer;
