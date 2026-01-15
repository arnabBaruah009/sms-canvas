import { LoginRequest, LoginResponse } from "@/app/auth/types/login.types";
import {
  RegisterRequest,
  RegisterResponse,
} from "@/app/auth/types/register.types";
import { apiSetup } from "./api-setup";

export const authApi = apiSetup.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(apiSetup.util.resetApiState());
        } catch {}
      },
    }),
    // reset: builder.mutation<void, ResetRequest>({
    //   query: (data) => ({
    //     url: "auth/reset",
    //     method: "POST",
    //     body: data,
    //   }),
    // }),
    // logout: builder.mutation<void, void>({
    //   query: () => ({
    //     url: "auth/logout",
    //     method: "GET",
    //   }),
    // }),
    // forgot: builder.mutation<void, ForgotRequest>({
    //   query: (data) => ({
    //     url: "auth/forgot",
    //     method: "POST",
    //     body: data,
    //   }),
    // }),
    // resend: builder.mutation<void, void>({
    //   query: () => ({
    //     url: "auth/resend-email-verification",
    //     method: "POST",
    //   }),
    // }),
    // generateOtp: builder.mutation<GenerateOtpResponse, SearchByPhoneDto>({
    //   query: (dto) => ({
    //     url: "/nivya-conversation/generate-otp",
    //     method: "POST",
    //     body: dto,
    //   }),
    // }),
    // deleteAccount: builder.mutation<DeleteAccountResponse, DeleteAccountDto>({
    //   query: (dto) => ({
    //     url: "/nivya-conversation/delete-account",
    //     method: "POST",
    //     body: dto,
    //   }),
    // }),
  }),
});

export const {
  useRegisterMutation,
    useLoginMutation,
  //   useResetMutation,
  //   useLogoutMutation,
  //   useForgotMutation,
  //   useResendMutation,
  //   useGenerateOtpMutation,
  //   useDeleteAccountMutation,
} = authApi;
