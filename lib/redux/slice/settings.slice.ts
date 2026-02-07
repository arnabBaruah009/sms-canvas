import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  isEditingProfile: boolean;
  isEditingSchool: boolean;
}

const initialState: SettingsState = {
  isEditingProfile: false,
  isEditingSchool: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setIsEditingProfile: (state, action: PayloadAction<boolean>) => {
      state.isEditingProfile = action.payload;
    },
    setIsEditingSchool: (state, action: PayloadAction<boolean>) => {
      state.isEditingSchool = action.payload;
    },
    resetSettings: (state) => {
      state.isEditingProfile = false;
      state.isEditingSchool = false;
    },
  },
});

export const {
  setIsEditingProfile,
  setIsEditingSchool,
  resetSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;
