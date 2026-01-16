import { apiSetup } from "./api-setup";

export interface UploadImageResponse {
  data: {
    url: string;
  };
  message?: string;
}

export const uploadApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "api/v1/uploadImage",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
