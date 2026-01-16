import { apiSetup } from "./api-setup";
import {
  CreateSchoolRequest,
  CreateSchoolResponse,
  GetSchoolResponse,
} from "@/app/dashboard/settings/school-details/types/school.types";

export const schoolApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    getSchool: builder.query<GetSchoolResponse, void>({
      query: () => ({
        url: "api/v1/school",
        method: "GET",
      }),
    }),
    createSchool: builder.mutation<CreateSchoolResponse, CreateSchoolRequest>({
      query: (data) => ({
        url: "api/v1/school",
        method: "POST",
        body: data,
      }),
    }),
    updateSchool: builder.mutation<
      CreateSchoolResponse,
      CreateSchoolRequest & { id: string }
    >({
      query: ({ id, ...data }) => ({
        url: `api/v1/school/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSchoolQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
} = schoolApi;
