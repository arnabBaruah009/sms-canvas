export type UserRole = "admin" | "teacher" | "staff" | "student";
export type Gender = "male" | "female" | "other";

export interface ProfileDetails {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  avatar_url?: string;
  gender?: Gender;
  role: UserRole;
  password?: string;
  isEmailVerified: boolean;
  school_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface GetProfileResponse {
  data: ProfileDetails;
  message?: string;
}

export interface UpdateProfileRequest {
  profile: Partial<
    Omit<
      ProfileDetails,
      | "id"
      | "password"
      | "isEmailVerified"
      | "created_at"
      | "updated_at"
      | "deleted_at"
    >
  >;
}

export interface UpdateProfileResponse {
  data: ProfileDetails;
  message?: string;
}
