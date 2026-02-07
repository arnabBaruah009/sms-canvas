"use client";

import { Input_Auth } from "@/app/auth/components/auth-input/input";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { RedirectLink } from "@/app/auth/components/redirect-link/redirect-link";
import { Heading } from "@/app/auth/components/auth-heading/heading";
import { useState } from "react";
import { Register_Input_Type } from "@/app/auth/types/register.types";
import {
  checkValidation,
  passwordValidate,
} from "@/lib/utils/validation.utils";
import { useRegisterMutation } from "@/lib/apis/auth.api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setConfirmPasswordIsVisible] =
    useState<boolean>(false);
  const [registerInputs, setRegisterInputs] = useState<Register_Input_Type>({
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [register, { isLoading, isSuccess }] = useRegisterMutation();
  const [isRegisterClicked, setIsRegisterClicked] = useState<boolean>(false);

  const checkValidation_Register = (name: keyof Register_Input_Type) => {
    return checkValidation(name, registerInputs, "register");
  };

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInputs({ ...registerInputs, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setIsRegisterClicked(true);

    // Check for validation errors
    if (
      checkValidation_Register("phone") ||
      checkValidation_Register("password") ||
      checkValidation_Register("confirm_password") ||
      registerInputs.phone === "" ||
      registerInputs.password === "" ||
      registerInputs.confirm_password === ""
    ) {
      return;
    }

    try {
      const response = await register({ user: registerInputs });

      if ("error" in response) {
        const message =
          (response.error as any)?.data?.message ?? "Server not reachable!";
        toast.error(message);
      } else if ("data" in response) {
        const registrationStatus = response.data.registrationStatus;
        if (registrationStatus) {
          toast.success("Registration successful!");
          router.push("/auth/login");
        } else {
          toast.error("Registration failed");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="w-full md:w-3/4 flex flex-col items-center p-6">
      <Heading
        title="Register"
        subtitle="Enter your credentials to access the platform"
      />
      <div className="my-10 mt-16 flex flex-col justify-between gap-4 w-full sm:w-4/5">
        <Input_Auth
          type="tel"
          name="phone"
          value={registerInputs.phone}
          onChange={onchange}
          isInvalid={
            checkValidation_Register("phone") ||
            (isRegisterClicked && registerInputs.phone === "")
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleRegister();
          }}
          errorMessage={
            isRegisterClicked && registerInputs.phone === ""
              ? "Phone number is required"
              : "Phone number must be 10 digits"
          }
          placeholder="Enter your 10-digit phone number"
        />

        <Input_Auth
          type="password"
          name="password"
          value={registerInputs.password}
          onChange={onchange}
          isInvalid={
            checkValidation_Register("password") ||
            (isRegisterClicked && registerInputs.password === "")
          }
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          placeholder="Enter your password"
          errorMessage={
            isRegisterClicked && registerInputs.password === ""
              ? "Password is required"
              : passwordValidate(registerInputs.password)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleRegister();
          }}
        />

        <Input_Auth
          type="password"
          name="confirm_password"
          value={registerInputs.confirm_password}
          onChange={onchange}
          isInvalid={
            checkValidation_Register("confirm_password") ||
            (isRegisterClicked && registerInputs.confirm_password === "")
          }
          isVisible={isConfirmPasswordVisible}
          setIsVisible={setConfirmPasswordIsVisible}
          placeholder="Confirm password"
          errorMessage={
            isRegisterClicked && registerInputs.confirm_password === ""
              ? "Confirm password is required"
              : "Password do not match"
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleRegister();
          }}
        />
      </div>

      <PrimaryButton
        title="Register"
        onClick={handleRegister}
        loading={isLoading}
      />

      <RedirectLink
        message="Already a member?"
        redirectTo="Login here"
        path="/auth/login"
      />
    </div>
  );
}
