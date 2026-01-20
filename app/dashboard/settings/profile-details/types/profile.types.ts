import { SchoolDetails } from "@/app/dashboard/settings/school-details/types/school.types";

export type UserRole = "admin" | "teacher" | "staff" | "student";
export type Gender = "male" | "female" | "other";

export interface ProfileDetails {
  _id: string;
  name: string;
  phone_number: string;
  email: string;
  avatar_url?: string;
  gender?: Gender;
  role: UserRole;
  password?: string;
  isEmailVerified: boolean;
  school_id?: SchoolDetails;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface GetProfileResponse {
  data: ProfileDetails;
  message?: string;
}

export interface UpdateProfileRequest {
  profile: Partial<
    Omit<
      ProfileDetails,
      | "_id"
      | "password"
      | "isEmailVerified"
      | "createdAt"
      | "updatedAt"
      | "__v"
      | "email"
      | "school_id"
    >
  >;
}

export interface UpdateProfileResponse {
  data: ProfileDetails;
  message?: string;
}
