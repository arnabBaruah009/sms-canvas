import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TeacherFiltersOps } from "@/app/dashboard/teachers/types/teacher-filters.types";

interface TeachersState {
    teachersFilters: TeacherFiltersOps;
}

const initialState: TeachersState = {
    teachersFilters: {},
};

export const teachersSlice = createSlice({
    name: "teachers",
    initialState,
    reducers: {
        setTeachersFilters: (state, action: PayloadAction<TeacherFiltersOps>) => {
            if (Object.keys(action.payload).length === 0) {
                state.teachersFilters = {};
            } else {
                state.teachersFilters = {
                    ...state.teachersFilters,
                    ...action.payload,
                };
            }
        },
        deleteTeachersFilterKey: (
            state,
            action: PayloadAction<keyof TeacherFiltersOps>
        ) => {
            delete state.teachersFilters[action.payload];
        },
    },
});

export const { setTeachersFilters, deleteTeachersFilterKey } =
    teachersSlice.actions;
export default teachersSlice.reducer;
