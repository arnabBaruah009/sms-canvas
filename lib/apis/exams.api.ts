import { apiSetup } from "./api-setup";
import type {
  CreateExamDto,
  CreateExamResponse,
  GetExamResponse,
  GetExamsResponse,
} from "@/app/dashboard/academics/types/exam.types";

export const examsApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query<GetExamsResponse, void>({
      query: () => ({
        url: "api/v1/exams",
        method: "GET",
      }),
      providesTags: ["Exam"],
    }),
    getExam: builder.query<GetExamResponse, string>({
      query: (id) => ({
        url: `api/v1/exams/${id}`,
        method: "GET",
      }),
      providesTags: ["Exam"],
    }),
    createExam: builder.mutation<CreateExamResponse, CreateExamDto>({
      query: (exam) => ({
        url: "api/v1/exams/create",
        method: "POST",
        body: { exam },
      }),
      invalidatesTags: ["Exam"],
    }),
  }),
});

export const { useGetExamsQuery, useGetExamQuery, useCreateExamMutation } = examsApi;
