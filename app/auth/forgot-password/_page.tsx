"use client";

import { Input_Auth } from "@/app/auth/components/auth-input/input";
import { PrimaryButton } from "@/components/common/primary-button";
import { RedirectLink } from "@/app/auth/components/redirect-link/redirect-link";
import { Heading } from "@/app/auth/components/auth-heading/heading";
import { useState } from "react";
import {
  checkValidation,
  passwordValidate,
} from "@/lib/utils/validation.utils";
import { ForgotPassword_Input_Type } from "@/lib/types/auth.types";
import { useForgotMutation } from "@/lib/utils/api/auth.api";
import { toast } from "react-hot-toast";
import { ForgotEmailSent } from "@/app/auth/components/forgot-email-sent/forgot-email-sent";

export default function Forgot_Password() {
  const [isNewPasswordVisible, setIsNewPasswordVisible] =
    useState<boolean>(false);
  const [isConfirmPasswordVisible, setConfirmPasswordIsVisible] =
    useState<boolean>(false);
  const [forgotPasswordInputs, setForgotPasswordInputs] =
    useState<ForgotPassword_Input_Type>({
      email: "",
      newPassword: "",
      confirm_password: "",
    });
  const [forgot, { isLoading, isSuccess }] = useForgotMutation();
  const [isForgotClicked, setIsForgotClicked] = useState<boolean>(false);

  const checkValidation_ForgotPassword = (
    name: keyof ForgotPassword_Input_Type
  ) => {
    return checkValidation(name, forgotPasswordInputs, "forgotPassword");
  };

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotPasswordInputs({
      ...forgotPasswordInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotpassword = async () => {
    setIsForgotClicked(true);

    if (
      checkValidation_ForgotPassword("email") ||
      checkValidation_ForgotPassword("newPassword") ||
      checkValidation_ForgotPassword("confirm_password") ||
      forgotPasswordInputs.email === "" ||
      forgotPasswordInputs.newPassword === "" ||
      forgotPasswordInputs.confirm_password === ""
    ) {
      return;
    }

    try {
      const response = await forgot({ user: forgotPasswordInputs });

      if ("error" in response) {
        const message =
          (response.error as any)?.data?.message ?? "Server not reachable!";
        toast.error(message);
      } else if ("data" in response) {
        toast.success("Email sent!");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <>
      {isSuccess ? (
        <ForgotEmailSent email={forgotPasswordInputs.email} />
      ) : (
        <div className="w-full md:w-1/2 flex flex-col items-center p-6">
          <Heading title="Forgot Your Password?" />
          <div className="my-10 mt-16 box-border flex flex-col justify-between gap-4 w-full sm:w-4/5">
            <Input_Auth
              type="email"
              name="email"
              value={forgotPasswordInputs.email}
              onChange={onchange}
              isInvalid={
                checkValidation_ForgotPassword("email") ||
                (isForgotClicked && forgotPasswordInputs.email === "")
              }
              errorMessage={
                isForgotClicked && forgotPasswordInputs.email === ""
                  ? "Email is required"
                  : "Invalid email"
              }
              placeholder="Enter your email"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") handleForgotpassword();
              }}
            />

            <Input_Auth
              type="password"
              name="newPassword"
              value={forgotPasswordInputs.newPassword}
              onChange={onchange}
              isInvalid={
                checkValidation_ForgotPassword("newPassword") ||
                (isForgotClicked && forgotPasswordInputs.newPassword === "")
              }
              isVisible={isNewPasswordVisible}
              setIsVisible={setIsNewPasswordVisible}
              placeholder="New password"
              errorMessage={
                isForgotClicked && forgotPasswordInputs.newPassword === ""
                  ? "Password is required"
                  : passwordValidate(forgotPasswordInputs.newPassword)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") handleForgotpassword();
              }}
            />

            <Input_Auth
              type="password"
              name="confirm_password"
              value={forgotPasswordInputs.confirm_password}
              onChange={onchange}
              isInvalid={
                checkValidation_ForgotPassword("confirm_password") ||
                (isForgotClicked &&
                  forgotPasswordInputs.confirm_password === "")
              }
              isVisible={isConfirmPasswordVisible}
              setIsVisible={setConfirmPasswordIsVisible}
              placeholder="Confirm password"
              errorMessage={
                isForgotClicked && forgotPasswordInputs.confirm_password === ""
                  ? "Confirm password is required"
                  : "Password do not match"
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") handleForgotpassword();
              }}
            />
          </div>

          <PrimaryButton
            title="Reset Password"
            onClick={handleForgotpassword}
            loading={isLoading}
          />

          <RedirectLink
            message="Remember password?"
            redirectTo="Login here"
            path="/auth/login"
          />
        </div>
      )}
    </>
  );
}
