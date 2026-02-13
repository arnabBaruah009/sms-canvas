import { apiSetup } from "./api-setup";
import type {
  GetAssessmentParams,
  GetAssessmentResponse,
  SubmitAssessmentPayload,
  SubmitAssessmentResponse,
} from "@/app/dashboard/assessment/types/assessment.types";

export const assessmentApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAssessment: builder.query<GetAssessmentResponse, GetAssessmentParams>({
      query: (params) => ({
        url: "api/v1/assessment",
        method: "GET",
        params: {
          examId: params.examId,
          subjectId: params.subjectId,
          class: params.class,
          section: params.section,
        },
      }),
      providesTags: ["Assessment"],
    }),
    submitAssessment: builder.mutation<
      SubmitAssessmentResponse,
      SubmitAssessmentPayload
    >({
      query: (body) => ({
        url: "api/v1/assessment/submit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Assessment"],
    }),
  }),
});

export const {
  useGetAssessmentQuery,
  useSubmitAssessmentMutation,
} = assessmentApi;
