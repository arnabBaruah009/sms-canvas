import { apiSetup } from "./api-setup";

export interface UploadImageResponse {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  message?: string;
}

export const uploadApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "api/v1/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
