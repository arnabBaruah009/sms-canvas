import { apiSetup } from "./api-setup";
import { TeacherFiltersOps } from "../../app/dashboard/teachers/types/teacher-filters.types";
import type {
  GetTeachersResponse,
  GetTeacherResponse,
  CreateTeacherDto,
  UpdateTeacherDto,
  CreateTeacherResponse,
  UpdateTeacherResponse,
} from "@/app/dashboard/teachers/types/teacher.types";

export const teachersApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<GetTeachersResponse, TeacherFiltersOps | void>({
      query: (body) => ({
        url: "api/v1/teachers",
        method: "POST",
        body: { filters: body },
      }),
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ _id }) => ({ type: "Teacher" as const, id: _id })),
            { type: "Teacher", id: "LIST" },
          ]
          : [{ type: "Teacher", id: "LIST" }],
    }),
    getTeacherById: builder.query<GetTeacherResponse, string>({
      query: (id) => ({
        url: `api/v1/teachers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Teacher", id }],
    }),
    createTeacher: builder.mutation<
      CreateTeacherResponse,
      { teacher: CreateTeacherDto }
    >({
      query: (body) => ({
        url: "api/v1/teachers/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Teacher", id: "LIST" }],
    }),
    updateTeacher: builder.mutation<
      UpdateTeacherResponse,
      { id: string; teacher: UpdateTeacherDto }
    >({
      query: ({ id, teacher }) => ({
        url: `api/v1/teachers/${id}`,
        method: "PUT",
        body: { teacher },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Teacher", id },
        { type: "Teacher", id: "LIST" },
      ],
    }),
    deleteTeacher: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `api/v1/teachers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Teacher", id },
        { type: "Teacher", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teachersApi;
