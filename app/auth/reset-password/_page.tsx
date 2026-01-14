"use client";

import { Input_Auth } from "@/app/auth/components/auth-input/input";
import { PrimaryButton } from "@/components/common/primary-button";
import { Heading } from "@/app/auth/components/auth-heading/heading";
import { useEffect, useState } from "react";
import { ResetPassword_Input_Type } from "@/lib/types/auth.types";
import {
  checkValidation,
  passwordValidate,
} from "@/lib/utils/validation.utils";
import { useResetMutation } from "@/lib/utils/api/auth.api";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken } from "@/lib/utils/redux/slice/auth.slice";

export default function Reset_Password() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken") || "";
  const autoPassword = searchParams.get("autoPassword") || "Wel2Nirvala@2025";
  const [isNewPasswordVisible, setIsNewPasswordVisible] =
    useState<boolean>(false);
  const [isConfirmPasswordVisible, setConfirmPasswordIsVisible] =
    useState<boolean>(false);
  const [resetPasswordInputs, setResetPasswordInputs] =
    useState<ResetPassword_Input_Type>({
      oldPassword: "",
      newPassword: "",
      confirm_password: "",
    });
  const [isResetClicked, setIsResetClicked] = useState<boolean>(false);

  useEffect(() => {
    if (accessToken) {
      dispatch(setToken(accessToken));
    }

    if (autoPassword) {
      setResetPasswordInputs({
        ...resetPasswordInputs,
        oldPassword: autoPassword,
      });
    }
  }, [accessToken]);

  const [reset, { isLoading, isSuccess }] = useResetMutation();

  const checkValidation_ResetPassword = (
    name: keyof ResetPassword_Input_Type
  ) => {
    return checkValidation(name, resetPasswordInputs, "resetPassword");
  };

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordInputs({
      ...resetPasswordInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = async () => {
    setIsResetClicked(true);

    if (
      checkValidation_ResetPassword("newPassword") ||
      checkValidation_ResetPassword("confirm_password") ||
      resetPasswordInputs.oldPassword === "" ||
      resetPasswordInputs.newPassword === "" ||
      resetPasswordInputs.confirm_password === ""
    ) {
      return;
    }

    try {
      const response = await reset({ user: resetPasswordInputs });

      if ("error" in response) {
        const message =
          (response.error as any)?.data?.message ?? "Unexpected error!";
        toast.error(message);
      } else if ("data" in response) {
        toast.success("Welcome!");
        router.push("/dashboard/settings/profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center p-6">
      <div className="flex flex-col items-center justify-center text-center space-y-2">
        <Heading title="Create Your Password" />
      </div>
      <div className="my-10 mt-16 flex flex-col justify-between gap-4 w-full sm:w-4/5">
        <Input_Auth
          type="password"
          name="newPassword"
          value={resetPasswordInputs.newPassword}
          onChange={onchange}
          isInvalid={
            checkValidation_ResetPassword("newPassword") ||
            (isResetClicked && resetPasswordInputs.newPassword === "")
          }
          isVisible={isNewPasswordVisible}
          setIsVisible={setIsNewPasswordVisible}
          placeholder="Password"
          errorMessage={
            isResetClicked && resetPasswordInputs.newPassword === ""
              ? "Password is required"
              : passwordValidate(resetPasswordInputs.newPassword)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleReset();
          }}
        />

        <Input_Auth
          type="password"
          name="confirm_password"
          value={resetPasswordInputs.confirm_password}
          onChange={onchange}
          isInvalid={
            checkValidation_ResetPassword("confirm_password") ||
            (isResetClicked && resetPasswordInputs.confirm_password === "")
          }
          isVisible={isConfirmPasswordVisible}
          setIsVisible={setConfirmPasswordIsVisible}
          placeholder="Confirm password"
          errorMessage={
            isResetClicked && resetPasswordInputs.confirm_password === ""
              ? "Confirm password is required"
              : "Password do not match"
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleReset();
          }}
        />
      </div>

      <PrimaryButton
        title="Get Started"
        onClick={handleReset}
        loading={isLoading}
      />
    </div>
  );
}
