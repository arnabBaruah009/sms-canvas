import { apiSetup } from "./api-setup";
import type {
  GetStudentsResponse,
  GetStudentResponse,
  CreateStudentDto,
  CreateStudentResponse,
  Student,
} from "@/app/dashboard/students/types/student.types";

export const studentsApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<GetStudentsResponse, void>({
      query: () => ({
        url: "api/v1/students",
        method: "GET",
      }),
      providesTags: ["Student"],
    }),
    getStudentById: builder.query<GetStudentResponse, string>({
      query: (id) => ({
        url: `api/v1/students/${id}`,
        method: "GET",
      }),
      providesTags: ["Student"],
    }),
    createStudent: builder.mutation<
      CreateStudentResponse,
      { student: CreateStudentDto }
    >({
      query: (body) => ({
        url: "api/v1/students",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Student"],
    }),
    deleteStudent: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `api/v1/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
