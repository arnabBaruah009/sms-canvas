import { apiSetup } from "./api-setup";
import type {
  CreateSubjectRequest,
  CreateSubjectResponse,
  GetSubjectsResponse,
} from "@/app/dashboard/academics/types/subject.types";

export const subjectsApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<GetSubjectsResponse, void>({
      query: () => ({
        url: "api/v1/subjects",
        method: "GET",
      }),
      providesTags: ["Subject"],
    }),
    createSubject: builder.mutation<CreateSubjectResponse, CreateSubjectRequest>({
      query: (data) => ({
        url: "api/v1/subjects/create",
        method: "POST",
        body: { subject: data },
      }),
      invalidatesTags: ["Subject"],
    }),
  }),
});

export const { useGetSubjectsQuery, useCreateSubjectMutation } = subjectsApi;
