import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { StudentFiltersOps } from "@/app/dashboard/students/types/student-filters.types";

interface StudentsState {
  studentsFilters: StudentFiltersOps;
}

const initialState: StudentsState = {
  studentsFilters: {},
};

export const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudentsFilters: (state, action: PayloadAction<StudentFiltersOps>) => {
      if (Object.keys(action.payload).length === 0) {
        state.studentsFilters = {};
      } else {
        state.studentsFilters = {
          ...state.studentsFilters,
          ...action.payload,
        };
      }
    },
    deleteStudentsFilterKey: (
      state,
      action: PayloadAction<keyof StudentFiltersOps>
    ) => {
      delete state.studentsFilters[action.payload];
    },
  },
});

export const { setStudentsFilters, deleteStudentsFilterKey } =
  studentsSlice.actions;
export default studentsSlice.reducer;
