import { apiSetup } from "./api-setup";
import {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/app/dashboard/settings/profile-details/types/profile.types";

export const profileApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    getProfileDetails: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: "api/v1/getProfileDetails",
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (data) => ({
        url: "api/v1/updateProfile",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useGetProfileDetailsQuery, useUpdateProfileMutation } =
  profileApi;
