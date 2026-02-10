import { apiSetup } from "./api-setup";
import type {
  CreateExamDto,
  CreateExamResponse,
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

export const { useGetExamsQuery, useCreateExamMutation } = examsApi;
