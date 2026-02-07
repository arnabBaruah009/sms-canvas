import { apiSetup } from "./api-setup";
import type {
  GetAllowListResponse,
  CreateAllowListDto,
  CreateAllowListResponse,
} from "@/app/dashboard/authorized/types/allow-list.types";

export const allowListApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    getAllowList: builder.query<GetAllowListResponse, void>({
      query: () => ({
        url: "auth/allow-list",
        method: "GET",
      }),
      providesTags: ["AllowList"],
    }),
    createAllowList: builder.mutation<
      CreateAllowListResponse,
      { allowList: CreateAllowListDto }
    >({
      query: (body) => ({
        url: "auth/allow-list",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AllowList"],
    }),
    deleteAllowList: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `auth/allow-list/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllowList"],
    }),
  }),
});

export const {
  useGetAllowListQuery,
  useCreateAllowListMutation,
  useDeleteAllowListMutation,
} = allowListApi;
