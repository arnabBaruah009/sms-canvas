import { apiSetup } from "./api-setup";
import { GetProfileResponse } from "@/app/dashboard/settings/profile-details/types/profile.types";

export const profileApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    getProfileDetails: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: "api/v1/getProfileDetails",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProfileDetailsQuery } = profileApi;
