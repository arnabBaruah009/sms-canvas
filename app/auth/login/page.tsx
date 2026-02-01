"use client";

import Link from "next/link";
import { Input_Auth } from "@/app/auth/components/auth-input/input";
import { RedirectLink } from "@/app/auth/components/redirect-link/redirect-link";
import { Heading } from "@/app/auth/components/auth-heading/heading";
import { useState, useEffect } from "react";
import { Login_Input_Type } from "@/app/auth/types/login.types";
import { checkValidation } from "@/lib/utils/validation.utils";
import { useLoginMutation } from "@/lib/apis/auth.api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createSession } from "@/lib/utils/sessions.utils";
import { useDispatch } from "react-redux";
import { setToken } from "@/lib/redux/slice/auth.slice";
import { PrimaryButton } from "@/components/buttons/primary-button";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loginInputs, setLoginInputs] = useState<Login_Input_Type>({
    phone: "",
    password: "",
  });
  const [login, { isLoading }] = useLoginMutation();
  const [isLoginClicked, setIsLoginClicked] = useState<boolean>(false);

  const checkValidation_Login = (name: keyof Login_Input_Type) => {
    return checkValidation(name, loginInputs, "register");
  };

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInputs({ ...loginInputs, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setIsLoginClicked(true);

    if (
      checkValidation_Login("phone") ||
      loginInputs.phone === "" ||
      loginInputs.password === ""
    ) {
      return;
    }

    try {
      const response = await login({ user: loginInputs });

      if ("error" in response) {
        const message =
          (response.error as any)?.data?.message ?? "Server not reachable!";
        toast.error(message);
      } else if ("data" in response) {
        const {
          accessToken,
          isEmailVerified,
          schoolId,
        } = response.data.data;
        if (isEmailVerified) {
          dispatch(setToken(accessToken));
          createSession(accessToken);
          toast.success(`Welcome`);
          if (Boolean(schoolId)) {
            router.push("/dashboard/home");
          } else {
            router.push("/dashboard/settings/school-details");
          }
        } else {
          toast.error("Please verify your email");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="w-full md:w-3/4 flex flex-col items-center p-6">
      <Heading title="Welcome back!" subtitle="Log in to your account" />
      <div className="my-10 mt-16 flex flex-col justify-between gap-4 w-full sm:w-4/5">
        <Input_Auth
          type="tel"
          name="phone"
          value={loginInputs.phone}
          onChange={onchange}
          isInvalid={
            checkValidation_Login("phone") ||
            (isLoginClicked && loginInputs.phone === "")
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleLogin();
          }}
          errorMessage={
            isLoginClicked && loginInputs.phone === ""
              ? "Phone number is required"
              : "Phone number must be 10 digits"
          }
          placeholder="Enter your 10-digit phone number"
        />

        <Input_Auth
          type="password"
          name="password"
          value={loginInputs.password}
          onChange={onchange}
          isInvalid={isLoginClicked && loginInputs.password === ""}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          placeholder="Enter your password"
          errorMessage={
            isLoginClicked && loginInputs.password === ""
              ? "Password is required"
              : ""
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleLogin();
          }}
        />
      </div>

      <PrimaryButton title="Login" onClick={handleLogin} loading={isLoading} />

      <Link href="/auth/forgot-password">
        <p className="font-quicksand font-medium text-sm hover:underline underline-offset-4 mt-2">
          Forgot password?
        </p>
      </Link>

      <RedirectLink
        message="Don't have an account yet?"
        redirectTo="Register here"
        path="/auth/register"
      />
    </div>
  );
}
